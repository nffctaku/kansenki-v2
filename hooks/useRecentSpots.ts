import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { SpotData } from '@/components/SpotCard';

export const useRecentSpots = (count: number = 10) => {
  const [spots, setSpots] = useState<SpotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentSpots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const spotsCollection = collection(db, 'spots');
      const q = query(spotsCollection, orderBy('createdAt', 'desc'), limit(count));
      const querySnapshot = await getDocs(q);
      
      const fetchedSpots = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SpotData));

      setSpots(fetchedSpots);
    } catch (err) {
      console.error("Error fetching recent spots:", err);
      setError('スポット情報の取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, [count]);

  useEffect(() => {
    fetchRecentSpots();
  }, [fetchRecentSpots]);

  return { spots, loading, error, refetch: fetchRecentSpots };
};
