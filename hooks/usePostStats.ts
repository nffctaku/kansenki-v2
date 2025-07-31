import { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '@/lib/firebase';

export interface PostStats {
  totalPosts: number;
  publicPosts: number;
  loading: boolean;
  error: string | null;
}

export function usePostStats(): PostStats {
  const [stats, setStats] = useState<PostStats>({
    totalPosts: 0,
    publicPosts: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchPostStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        const functions = getFunctions();
        const getPostStats = httpsCallable(functions, 'getPostStats');
        const result = await getPostStats();
        
        const data = result.data as { totalPosts: number };

        setStats({
          totalPosts: data.totalPosts,
          publicPosts: 0, // Public posts count is not available from this function yet
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('投稿数の取得に失敗しました:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: '投稿数の取得に失敗しました',
        }));
      }
    };

    fetchPostStats();
  }, []);

  return stats;
}
