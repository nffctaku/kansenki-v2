import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const photoReference = searchParams.get('ref');

  if (!photoReference) {
    return new Response('Photo reference is required', { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return new Response('API key not configured', { status: 500 });
  }

  try {
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
    
    const photoResponse = await fetch(photoUrl);

    if (!photoResponse.ok) {
      return new Response('Failed to fetch photo from Google', { status: photoResponse.status });
    }

    // Get the image data as a blob
    const imageBlob = await photoResponse.blob();
    
    // Create a new response with the image data and correct content type
    return new Response(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': photoResponse.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    });

  } catch (error) {
    console.error('Error proxying photo request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
