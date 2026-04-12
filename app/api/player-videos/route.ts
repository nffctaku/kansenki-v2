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
      const publishedMatch = chunk.match(/<published>([^<]+)<\/published>/);
      if (!idMatch?.[1] || !titleMatch?.[1]) return null;
      const title = titleMatch[1]
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
      return {
        id: `yt-${idMatch[1]}`,
        label: title,
        youtubeVideoId: idMatch[1],
        publishedAt: publishedMatch?.[1] ?? null,
      };
    })
    .filter(Boolean)
    .slice(0, fetchMax);

  return items;
}

async function fetchVideoMetasFromYouTubeSearch(query: string, limit: number) {
  const res = await fetch(
    `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=CAISAhAB`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return null;
  const html = await res.text();

  const ids = new Set<string>();
  const re = /\"videoId\"\s*:\s*\"([a-zA-Z0-9_-]{11})\"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    ids.add(m[1]);
    if (ids.size >= limit * 3) break;
  }

  const picked = Array.from(ids).slice(0, limit);
  const metas = await Promise.all(
    picked.map(async (videoId) => {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`,
        { next: { revalidate: 3600 } }
      );
      if (!oembedRes.ok) return null;
      const json = await oembedRes.json().catch(() => null);
      const title = typeof json?.title === 'string' ? json.title : null;
      if (!title) return null;
      return {
        id: `yt-${videoId}`,
        youtubeVideoId: videoId,
        label: title,
        publishedAt: null,
      };
    })
  );

  return metas.filter(Boolean) as Array<{ id: string; youtubeVideoId: string; label: string; publishedAt: null }>;
}

type VideoItem = { id: string; youtubeVideoId: string; label: string; publishedAt: string | null };

type Source =
  | { type: 'handle'; value: string }
  | { type: 'channelId'; value: string };

const sources: Array<{ name: string; source: Source }> = [
  { name: 'JFA', source: { type: 'handle', value: 'jfa' } },
  { name: 'SoccerKing', source: { type: 'handle', value: 'SoccerKingJP' } },
  { name: 'PremierLeague', source: { type: 'handle', value: 'premierleague' } },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') ?? '').trim();
  const limitParam = searchParams.get('limit');
  const limit = Math.max(1, Math.min(10, Number(limitParam ?? '5') || 5));
  const fetchMaxParam = searchParams.get('fetchMax');
  const fetchMax = Math.max(limit, Math.min(50, Number(fetchMaxParam ?? '20') || 20));

  if (!query) {
    return NextResponse.json({ error: 'q is required' }, { status: 400 });
  }

  try {
    const normalizedQueries = Array.from(
      new Set([
        query,
        query.replace(/\s+/g, ''),
        query.replace(/・/g, ''),
        query.replace(/\s+/g, '').replace(/・/g, ''),
      ].filter(Boolean))
    );

    const results: VideoItem[] = [];
    const seen = new Set<string>();

    for (const s of sources) {
      if (results.length >= fetchMax) break;

      let channelId: string | null = null;
      if (s.source.type === 'channelId') {
        channelId = s.source.value;
      } else {
        channelId = await fetchChannelIdFromYouTubePage(s.source.value);
      }
      if (!channelId) continue;

      const items = await fetchLatestVideosFromRss(channelId, fetchMax);
      if (!items) continue;

      for (const it of items) {
        if (results.length >= fetchMax) break;
        const label = (it as any).label as string;
        const matched = normalizedQueries.some((qq) => label.includes(qq));
        if (!matched) continue;
        const vid = (it as any).youtubeVideoId as string;
        if (seen.has(vid)) continue;
        seen.add(vid);
        results.push(it as any);
      }
    }

    const sorted = results.sort((a, b) => {
      const ad = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bd = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bd - ad;
    });

    if (sorted.length === 0) {
      const fallback = await fetchVideoMetasFromYouTubeSearch(query, limit);
      if (fallback && fallback.length > 0) {
        return NextResponse.json(
          { items: fallback.slice(0, limit) },
          {
            status: 200,
            headers: {
              'Cache-Control': 'public, max-age=300',
            },
          }
        );
      }
    }

    return NextResponse.json(
      { items: sorted.slice(0, limit) },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching player videos:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
