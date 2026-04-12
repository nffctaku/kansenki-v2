import { NextResponse } from 'next/server';

async function fetchChannelIdFromYouTubePage(handle: string) {
  const normalized = handle.startsWith('@') ? handle.slice(1) : handle;
  const res = await fetch(`https://www.youtube.com/@${encodeURIComponent(normalized)}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const m = html.match(/"channelId"\s*:\s*"(UC[^"]+)"/);
  if (m?.[1]) return m[1];
  const m2 = html.match(/itemprop="channelId"\s*content="(UC[^"]+)"/);
  return m2?.[1] ?? null;
}

async function fetchLatestVideosFromRss(channelId: string, fetchMax: number) {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const xml = await res.text();

  const entries = xml.split('<entry>').slice(1);
  const items = entries
    .map((chunk) => {
      const idMatch = chunk.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = chunk.match(/<title>([\s\S]*?)<\/title>/);
      if (!idMatch?.[1] || !titleMatch?.[1]) return null;
      const title = titleMatch[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      return {
        id: `unext-${idMatch[1]}`,
        label: title,
        youtubeVideoId: idMatch[1],
      };
    })
    .filter(Boolean)
    .slice(0, fetchMax);

  return items;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const maxResults = Math.max(1, Math.min(10, Number(limitParam ?? '5') || 5));
  const fetchMaxParam = searchParams.get('fetchMax');
  const fetchMax = Math.max(maxResults, Math.min(50, Number(fetchMaxParam ?? '25') || 25));
  const q = searchParams.get('q');
  const handle = searchParams.get('handle') || 'UNEXT_football';
  const wantsLatestOnly = !q;
  const directChannelId = searchParams.get('channelId');

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey && wantsLatestOnly) {
    try {
      const resolvedChannelId = directChannelId ?? (await fetchChannelIdFromYouTubePage(handle));
      if (!resolvedChannelId) {
        return NextResponse.json({ error: 'Channel not found for handle (rss fallback)' }, { status: 404 });
      }
      const items = await fetchLatestVideosFromRss(resolvedChannelId, fetchMax);
      if (!items) return NextResponse.json({ error: 'Failed to fetch latest videos (rss fallback)' }, { status: 502 });
      return NextResponse.json(
        { items: items.slice(0, maxResults) },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=300',
          },
        }
      );
    } catch (error) {
      console.error('Error fetching RSS fallback videos:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'YOUTUBE_API_KEY is not configured' }, { status: 500 });
  }

  try {
    let channelId: string | undefined;
    let channelResolveError: { status?: number; body?: string } | null = null;
    let channelSearchError: { status?: number; body?: string } | null = null;

    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${encodeURIComponent(apiKey)}`,
      { next: { revalidate: 600 } }
    );

    if (channelRes.ok) {
      const channelJson = await channelRes.json();
      channelId = channelJson?.items?.[0]?.id;
    } else {
      channelResolveError = {
        status: channelRes.status,
        body: await channelRes.text().catch(() => undefined),
      };
    }

    if (!channelId) {
      const searchQueries = handle.startsWith('@') ? [handle, handle.slice(1)] : [handle, `@${handle}`];
      for (const sq of searchQueries) {
        const searchRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=${encodeURIComponent(sq)}&key=${encodeURIComponent(apiKey)}`,
          { next: { revalidate: 600 } }
        );

        if (!searchRes.ok) {
          channelSearchError = {
            status: searchRes.status,
            body: await searchRes.text().catch(() => undefined),
          };
          continue;
        }

        const searchJson = await searchRes.json();
        const resolved: string | undefined = searchJson?.items?.[0]?.id?.channelId;
        if (resolved) {
          channelId = resolved;
          break;
        }
      }
    }

    if (!channelId) {
      return NextResponse.json(
        {
          error: 'Channel not found for handle',
          channelResolveError,
          channelSearchError,
        },
        { status: 404 }
      );
    }

    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(channelId)}&order=date&type=video&maxResults=${fetchMax}${q ? `&q=${encodeURIComponent(q)}` : ''}&key=${encodeURIComponent(apiKey)}`,
      { next: { revalidate: 300 } }
    );

    if (!videosRes.ok) {
      const body = await videosRes.text().catch(() => undefined);
      if (wantsLatestOnly && videosRes.status === 403 && typeof body === 'string' && body.includes('quotaExceeded')) {
        const resolvedChannelId = channelId ?? (directChannelId ?? (await fetchChannelIdFromYouTubePage(handle)));
        if (!resolvedChannelId) {
          return NextResponse.json(
            { error: 'Channel not found for handle (rss fallback)', status: videosRes.status, body },
            { status: 404 }
          );
        }
        const rssItems = await fetchLatestVideosFromRss(resolvedChannelId, fetchMax);
        if (!rssItems) {
          return NextResponse.json(
            { error: 'Failed to fetch latest videos (rss fallback)', status: videosRes.status, body },
            { status: 502 }
          );
        }

        return NextResponse.json(
          { items: rssItems.slice(0, maxResults) },
          {
            status: 200,
            headers: {
              'Cache-Control': 'public, max-age=300',
            },
          }
        );
      }

      return NextResponse.json(
        {
          error: 'Failed to fetch latest videos',
          status: videosRes.status,
          body,
        },
        { status: 502 }
      );
    }

    const videosJson = await videosRes.json();

    const items = (videosJson?.items ?? [])
      .map((it: any) => {
        const videoId = it?.id?.videoId;
        const title = it?.snippet?.title;
        const description = it?.snippet?.description;
        if (!videoId || !title) return null;
        return {
          id: `unext-${videoId}`,
          label: title,
          youtubeVideoId: videoId,
          description: typeof description === 'string' ? description : undefined,
        };
      })
      .filter(Boolean);

    return NextResponse.json(
      { items },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching U-NEXT highlights:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
