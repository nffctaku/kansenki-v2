import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
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

        // Count posts from 'posts' collection (new format)
        const postsCollection = collection(db, 'posts');
        const postsSnapshot = await getDocs(postsCollection);
        const postsCount = postsSnapshot.size;

        // Count public posts from 'posts' collection
        const publicPostsQuery = query(postsCollection, where("isPublic", "==", true));
        const publicPostsSnapshot = await getDocs(publicPostsQuery);
        const publicPostsCount = publicPostsSnapshot.size;

        // Count posts from 'simple-posts' collection (legacy format)
        const simplePostsCollection = collection(db, 'simple-posts');
        const simplePostsSnapshot = await getDocs(simplePostsCollection);
        const simplePostsCount = simplePostsSnapshot.size;

        // Total counts
        const totalPosts = postsCount + simplePostsCount;
        const totalPublicPosts = publicPostsCount + simplePostsCount; // simple-posts are assumed to be public

        setStats({
          totalPosts,
          publicPosts: totalPublicPosts,
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
