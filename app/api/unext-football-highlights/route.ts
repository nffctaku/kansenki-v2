import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const maxResults = Math.max(1, Math.min(10, Number(limitParam ?? '5') || 5));
  const fetchMaxParam = searchParams.get('fetchMax');
  const fetchMax = Math.max(maxResults, Math.min(50, Number(fetchMaxParam ?? '25') || 25));
  const q = searchParams.get('q');
  const handle = searchParams.get('handle') || 'UNEXT_football';

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'YOUTUBE_API_KEY is not configured' }, { status: 500 });
  }

  try {
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${encodeURIComponent(apiKey)}`,
      { next: { revalidate: 600 } }
    );

    if (!channelRes.ok) {
      return NextResponse.json(
        { error: 'Failed to resolve channel from handle', status: channelRes.status },
        { status: 502 }
      );
    }

    const channelJson = await channelRes.json();
    const channelId: string | undefined = channelJson?.items?.[0]?.id;
    if (!channelId) {
      return NextResponse.json({ error: 'Channel not found for handle' }, { status: 404 });
    }

    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(channelId)}&order=date&type=video&maxResults=${fetchMax}${q ? `&q=${encodeURIComponent(q)}` : ''}&key=${encodeURIComponent(apiKey)}`,
      { next: { revalidate: 300 } }
    );

    if (!videosRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch latest videos', status: videosRes.status },
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
