'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '@/lib/firebase';
import { SimplePost, SimpleTravel, Hotel } from '@/types/match';
import { Post } from '@/types/post';

export interface HotelMapData {
  id: string;
  name: string;
  city?: string;
  coords?: {
    lat: number;
    lng: number;
  };
  rating?: number;
  comment?: string;
  postId: string;
  postTitle: string;
  author: string;
  season: string;
  url?: string;
  bookingSite?: string;
  price?: number;
  nights?: number;
}

export function useHotelData() {
  const [hotels, setHotels] = useState<HotelMapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, authLoading] = useAuthState(auth);

  useEffect(() => {
    // Wait for auth to complete before fetching data
    if (authLoading) {
      console.log('🔄 Waiting for authentication...');
      return;
    }

    const fetchHotelData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🏨 Starting hotel data fetch...');
        console.log('👤 User authenticated:', !!user);
        const hotelData: HotelMapData[] = [];

        // Fetch from posts collection (new format)
        console.log('📄 Fetching from posts collection...');
        try {
          const postsQuery = query(
            collection(db, 'posts'),
            where('isPublic', '==', true)
          );
          const postsSnapshot = await getDocs(postsQuery);
        console.log(`📄 Found ${postsSnapshot.docs.length} posts`);
        
        let postsHotelCount = 0;
        
        for (const doc of postsSnapshot.docs) {
          const postData = doc.data() as Post;
          
          if (postData.hotels && postData.hotels.length > 0) {
            for (const hotel of postData.hotels) {
              // Try to geocode hotel location using hotel name and city for precise location
              let coords = undefined;
              if (hotel.city) {
                coords = await geocodeHotel(hotel.name, hotel.city);
              }
              
              hotelData.push({
                id: `${doc.id}-${hotel.id}`,
                name: hotel.name,
                city: hotel.city,
                coords,
                rating: hotel.overallRating,
                comment: hotel.comment,
                postId: doc.id,
                postTitle: postData.title,
                author: postData.authorNickname || 'Unknown',
                season: postData.match?.season || 'Unknown',
                url: hotel.url,
                bookingSite: hotel.bookingSite,
                price: hotel.price,
                nights: hotel.nights,
              });
              postsHotelCount++;
            }
          }
        }
        console.log(`📄 Extracted ${postsHotelCount} hotels from posts collection`);
        } catch (postsError) {
          console.error('❌ Error fetching posts:', postsError);
        }

        // Fetch from simple-posts collection (legacy format)
        console.log('📄 Fetching from simple-posts collection...');
        try {
          const simplePostsQuery = query(
            collection(db, 'simple-posts'),
            where('isPublic', '==', true)
          );
          const simplePostsSnapshot = await getDocs(simplePostsQuery);
          
          for (const doc of simplePostsSnapshot.docs) {
            const postData = doc.data() as SimplePost;
            
            // Simple posts don't typically contain hotel data directly
            // but we keep this for future compatibility
          }
        } catch (simplePostsError) {
          console.error('❌ Error fetching simple-posts:', simplePostsError);
        }

        // Fetch from simple-travels collection
        console.log('🧳 Fetching from simple-travels collection...');
        try {
          // Try without any filters first to test permissions
          const travelsSnapshot = await getDocs(collection(db, 'simple-travels'));
          console.log(`🧳 Found ${travelsSnapshot.docs.length} travels`);
          
          let travelsHotelCount = 0;
          
          for (const doc of travelsSnapshot.docs) {
            const travelData = doc.data() as SimpleTravel;
            
            if (travelData.hotels && travelData.hotels.length > 0) {
              for (const hotel of travelData.hotels) {
                // Try to geocode hotel location using hotel name and city for precise location
                let coords = undefined;
                if (hotel.city) {
                  coords = await geocodeHotel(hotel.name, hotel.city);
                }
                
                hotelData.push({
                  id: `travel-${doc.id}-${hotel.id}`,
                  name: hotel.name,
                  city: hotel.city,
                  coords,
                  rating: hotel.overallRating,
                  comment: hotel.comment,
                  postId: doc.id,
                  postTitle: travelData.name,
                  author: 'Unknown', // SimpleTravel doesn't have author name, only authorId
                  season: 'Unknown', // SimpleTravel doesn't have season
                  url: hotel.url,
                  bookingSite: hotel.bookingSite,
                  price: hotel.price,
                  nights: hotel.nights,
                });
                travelsHotelCount++;
              }
            }
          }
          console.log(`🧳 Extracted ${travelsHotelCount} hotels from simple-travels collection`);
        } catch (travelsError) {
          console.error('❌ Error fetching simple-travels:', travelsError);
        }
        
        console.log(`🏨 Total hotels found: ${hotelData.length}`);
        console.log(`🗺️ Hotels with coordinates: ${hotelData.filter((h: HotelMapData) => h.coords).length}`);

        setHotels(hotelData);
      } catch (err) {
        console.error('❌ Error fetching hotel data:', err);
        if (err instanceof Error) {
          console.error('❌ Error message:', err.message);
          console.error('❌ Error stack:', err.stack);
        }
        setError(`ホテルデータの取得に失敗しました: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [user, authLoading]);

  return { hotels, loading, error };
}

// Enhanced geocoding function with Google Geocoding API fallback
async function geocodeHotel(hotelName: string, city: string): Promise<{ lat: number; lng: number } | undefined> {
  console.log(`🗺️ Geocoding hotel: "${hotelName}" in "${city}"`);
  
  // First try Google Geocoding API for precise location
  const googleResult = await geocodeWithGoogle(hotelName, city);
  if (googleResult) {
    console.log(`✅ Google Geocoding success: ${hotelName}, ${city}`);
    return googleResult;
  }
  
  // Fallback to hardcoded city coordinates
  const cityResult = await geocodeCity(city);
  if (cityResult) {
    console.log(`✅ Fallback to city coordinates: ${city}`);
    return cityResult;
  }
  
  console.log(`❌ No coordinates found for: ${hotelName}, ${city}`);
  return undefined;
}

// Google Geocoding API function
async function geocodeWithGoogle(hotelName: string, city: string): Promise<{ lat: number; lng: number } | undefined> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.log('⚠️ Google Maps API key not found, skipping Google Geocoding');
    return undefined;
  }
  
  try {
    // Create search query: "Hotel Name, City"
    const query = encodeURIComponent(`${hotelName}, ${city}`);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`
    );
    
    if (!response.ok) {
      console.log(`❌ Google Geocoding API error: ${response.status}`);
      return undefined;
    }
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng
      };
    } else {
      console.log(`❌ Google Geocoding no results: ${data.status}`);
      return undefined;
    }
  } catch (error) {
    console.log(`❌ Google Geocoding error:`, error);
    return undefined;
  }
}

// Simple geocoding function for major cities (fallback)
async function geocodeCity(city: string): Promise<{ lat: number; lng: number } | undefined> {
  console.log(`🗺️ Geocoding city: "${city}"`);
  
  // Hardcoded coordinates for major European cities
  const cityCoordinates: Record<string, { lat: number; lng: number }> = {
    // UK (English)
    'London': { lat: 51.5074, lng: -0.1278 },
    'Manchester': { lat: 53.4808, lng: -2.2426 },
    'Liverpool': { lat: 53.4084, lng: -2.9916 },
    'Birmingham': { lat: 52.4862, lng: -1.8904 },
    'Leeds': { lat: 53.8008, lng: -1.5491 },
    'Newcastle': { lat: 54.9783, lng: -1.6178 },
    'Brighton': { lat: 50.8225, lng: -0.1372 },
    'Cardiff': { lat: 51.4816, lng: -3.1791 },
    'Nottingham': { lat: 52.9548, lng: -1.1581 },
    'Plymouth': { lat: 50.3755, lng: -4.1427 },
    
    // UK (Japanese)
    'ロンドン': { lat: 51.5074, lng: -0.1278 },
    'マンチェスター': { lat: 53.4808, lng: -2.2426 },
    'リバプール': { lat: 53.4084, lng: -2.9916 },
    'バーミンガム': { lat: 52.4862, lng: -1.8904 },
    'リーズ': { lat: 53.8008, lng: -1.5491 },
    'ニューカッスル': { lat: 54.9783, lng: -1.6178 },
    'ブライトン': { lat: 50.8225, lng: -0.1372 },
    'カーディフ': { lat: 51.4816, lng: -3.1791 },
    'ノッティンガム': { lat: 52.9548, lng: -1.1581 },
    'プリマス': { lat: 50.3755, lng: -4.1427 },
    
    // Italy (English)
    'Milan': { lat: 45.4642, lng: 9.1900 },
    'Rome': { lat: 41.9028, lng: 12.4964 },
    'Turin': { lat: 45.0703, lng: 7.6869 },
    'Naples': { lat: 40.8518, lng: 14.2681 },
    'Florence': { lat: 43.7696, lng: 11.2558 },
    'Bologna': { lat: 44.4949, lng: 11.3426 },
    'Genoa': { lat: 44.4056, lng: 8.9463 },
    'Venice': { lat: 45.4408, lng: 12.3155 },
    
    // Italy (Japanese)
    'ミラノ': { lat: 45.4642, lng: 9.1900 },
    'ローマ': { lat: 41.9028, lng: 12.4964 },
    'トリノ': { lat: 45.0703, lng: 7.6869 },
    'ナポリ': { lat: 40.8518, lng: 14.2681 },
    'フィレンツェ': { lat: 43.7696, lng: 11.2558 },
    'ボローニャ': { lat: 44.4949, lng: 11.3426 },
    'ジェノヴァ': { lat: 44.4056, lng: 8.9463 },
    'ヴェネツィア': { lat: 45.4408, lng: 12.3155 },
    
    // France
    'Paris': { lat: 48.8566, lng: 2.3522 },
    'Lyon': { lat: 45.7640, lng: 4.8357 },
    'Marseille': { lat: 43.2965, lng: 5.3698 },
    'Nice': { lat: 43.7102, lng: 7.2620 },
    'Toulouse': { lat: 43.6047, lng: 1.4442 },
    'Strasbourg': { lat: 48.5734, lng: 7.7521 },
    'Nantes': { lat: 47.2184, lng: -1.5536 },
    'Lille': { lat: 50.6292, lng: 3.0573 },
    
    // Spain (English)
    'Madrid': { lat: 40.4168, lng: -3.7038 },
    'Barcelona': { lat: 41.3851, lng: 2.1734 },
    'Valencia': { lat: 39.4699, lng: -0.3763 },
    'Seville': { lat: 37.3891, lng: -5.9845 },
    'Bilbao': { lat: 43.2627, lng: -2.9253 },
    'Málaga': { lat: 36.7213, lng: -4.4214 },
    'Las Palmas': { lat: 28.1248, lng: -15.4300 },
    'Vigo': { lat: 42.2406, lng: -8.7207 },
    
    // Spain (Japanese)
    'マドリード': { lat: 40.4168, lng: -3.7038 },
    'バルセロナ': { lat: 41.3851, lng: 2.1734 },
    'バレンシア': { lat: 39.4699, lng: -0.3763 },
    'セビリア': { lat: 37.3891, lng: -5.9845 },
    'ビルバオ': { lat: 43.2627, lng: -2.9253 },
    'マラガ': { lat: 36.7213, lng: -4.4214 },
    'ラスパルマス': { lat: 28.1248, lng: -15.4300 },
    'ビーゴ': { lat: 42.2406, lng: -8.7207 },
  };

  // Try exact match first
  if (cityCoordinates[city]) {
    console.log(`✅ Exact match found for: ${city}`);
    return cityCoordinates[city];
  }

  // Try case-insensitive match
  const cityKey = Object.keys(cityCoordinates).find(
    key => key.toLowerCase() === city.toLowerCase()
  );
  
  if (cityKey) {
    console.log(`✅ Case-insensitive match found: ${city} -> ${cityKey}`);
    return cityCoordinates[cityKey];
  }

  // Try partial matching (contains)
  const partialMatch = Object.keys(cityCoordinates).find(
    key => key.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(key.toLowerCase())
  );
  
  if (partialMatch) {
    console.log(`✅ Partial match found: ${city} -> ${partialMatch}`);
    return cityCoordinates[partialMatch];
  }

  // If no match found, return undefined
  console.log(`❌ No coordinates found for city: ${city}`);
  return undefined;
}
