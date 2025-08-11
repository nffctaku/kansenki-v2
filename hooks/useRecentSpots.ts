import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, orderBy, limit, where } from 'firebase/firestore';
import { SpotData } from '@/components/SpotCard';

export type AuthorProfile = {
  nickname: string;
  photoURL: string;
};

export const useRecentSpots = (count: number = 10) => {
  const [spots, setSpots] = useState<SpotData[]>([]);
  const [authorProfiles, setAuthorProfiles] = useState<Map<string, AuthorProfile>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentSpots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const spotsCollection = collection(db, 'spots');
      const q = query(spotsCollection, orderBy('createdAt', 'desc'), limit(count));
      const querySnapshot = await getDocs(q);
      
      const fetchedSpots: SpotData[] = [];
      const authorIds = new Set<string>();

      querySnapshot.forEach(doc => {
        const spot = { id: doc.id, ...doc.data() } as SpotData;
        fetchedSpots.push(spot);
        if (spot.authorId) {
          authorIds.add(spot.authorId);
        }
      });

      const profiles = new Map<string, AuthorProfile>();
      if (authorIds.size > 0) {
        const authorIdList = Array.from(authorIds);
        const usersQuery = query(collection(db, 'users'), where('__name__', 'in', authorIdList));
        const usersSnapshot = await getDocs(usersQuery);
        usersSnapshot.forEach(doc => {
          const userData = doc.data();
          profiles.set(doc.id, {
            nickname: userData.nickname || '名無し',
            photoURL: userData.avatarUrl || '/default-avatar.svg',
          });
        });
      }

      setSpots(fetchedSpots);
      setAuthorProfiles(profiles);
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

  return { spots, authorProfiles, loading, error, refetch: fetchRecentSpots };
};
