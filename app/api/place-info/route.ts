import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!name || !lat || !lng) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    // Step 1: Find Place ID from text query and location bias
    const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      name
    )}&inputtype=textquery&fields=place_id&locationbias=circle:2000@${lat},${lng}&key=${apiKey}`;

    const findPlaceResponse = await fetch(findPlaceUrl);
    const findPlaceData = await findPlaceResponse.json();

    if (findPlaceData.status !== 'OK' || !findPlaceData.candidates || findPlaceData.candidates.length === 0) {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 });
    }

    const placeId = findPlaceData.candidates[0].place_id;

    // Step 2: Get Place Details (photos) using the Place ID
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${apiKey}`;
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (detailsData.status !== 'OK' || !detailsData.result.photos || detailsData.result.photos.length === 0) {
      return NextResponse.json({ error: 'No photos found for this place' }, { status: 404 });
    }

    const photoReference = detailsData.result.photos[0].photo_reference;

    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;

    return NextResponse.json({ photoUrl });

  } catch (error) {
    console.error('Error fetching from Google Places API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
