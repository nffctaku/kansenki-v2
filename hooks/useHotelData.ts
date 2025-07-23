import { useEffect, useState } from 'react';

// ホテルデータ型
export interface Hotel {
  id: string;
  name: string;
  city?: string;
  coords?: {
    lat: number;
    lng: number;
  };
  rating?: number;
  price?: number;
  postTitle?: string;
  author?: string;
  nights?: number;
  bookingSite?: string;
}

// 仮のデータ取得（本番はFirestore等と連携）
export function useHotelData() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 仮データ
    setHotels([
      {
        id: 'hotel1',
        name: '8 Rooms Madrid',
        city: 'Madrid',
        coords: { lat: 40.4102, lng: -3.6822 },
        rating: 4.5,
        price: 12000,
        postTitle: 'とても快適なホテル',
        author: 'user1',
        nights: 2,
        bookingSite: 'Booking.com',
      },
      // 必要に応じて追加
    ]);
    setLoading(false);
  }, []);

  return { hotels, loading, error };
}
