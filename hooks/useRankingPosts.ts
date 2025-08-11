import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, doc, getDoc, where, orderBy, limit } from 'firebase/firestore';
import { UnifiedPost } from '../types/post';
import { Timestamp } from 'firebase/firestore';
import { UserProfile } from '@/types/user';

// ランキングスコアを計算するヘルパー関数
const calculateScore = (post: any): number => {
  const score = (post.likeCount ?? 0) * 0.3 +
                (post.helpfulCount ?? 0) * 0.4 +
                (post.bookmarkCount ?? 0) * 0.2 +
                (post.viewCount ?? 0) * 0.1;
  return score;
};

export const useRankingPosts = () => {
  const [rankedPosts, setRankedPosts] = useState<UnifiedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRankedPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allPosts: (any & { score: number; type: string })[] = [];
      const postCollections = ['posts', 'simple-posts', 'simple-travels'];

      for (const collectionName of postCollections) {
        const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'), limit(100));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
          const data = doc.data();
          const score = calculateScore(data);
          if (score > 0) { // スコアが0より大きい投稿のみを対象
            allPosts.push({ id: doc.id, ...data, score, type: collectionName });
          }
        });
      }

      allPosts.sort((a, b) => b.score - a.score);
      const topPosts = allPosts.slice(0, 5);

      const authorIds = new Set<string>();
      topPosts.forEach(p => {
        const authorId = p.authorId || p.userId || (p.author && p.author.id);
        if (authorId) {
          authorIds.add(authorId);
        }
      });

      const authorProfiles = new Map<string, { nickname: string; avatarUrl: string }>();
      if (authorIds.size > 0) {
        const authorIdList = Array.from(authorIds);
        const chunks = [];
        for (let i = 0; i < authorIdList.length; i += 30) {
          chunks.push(authorIdList.slice(i, i + 30));
        }

        for (const chunk of chunks) {
          if (chunk.length === 0) continue;
          const usersQuery = query(collection(db, 'users'), where('__name__', 'in', chunk));
          const usersSnapshot = await getDocs(usersQuery);
          usersSnapshot.forEach(doc => {
            const userData = doc.data();
            authorProfiles.set(doc.id, {
              nickname: userData.nickname,
              avatarUrl: userData.avatarUrl
            });
          });
        }
      }

      const unifiedPosts = topPosts.map(p => {
        const data = p;
        const type = p.type;
        const authorId = data.authorId || data.userId || (data.author && data.author.id);
        const profile = authorId ? authorProfiles.get(authorId) : undefined;

        const authorName = profile?.nickname
          || data.authorName
          || (data.author && typeof data.author === 'object' ? data.author.name : (typeof data.author === 'string' ? data.author : null))
          || '名無し';

        const authorImage = profile?.avatarUrl
          || (data.author && typeof data.author === 'object' ? data.author.image : null)
          || data.authorImage
          || '/default-avatar.svg';

        const getTitle = () => {
          if (data.title) {
            return data.title;
          }
          if (type === 'posts' || type === 'simple-posts') {
            const homeTeam = data.match?.homeTeam || data.homeTeam;
            const awayTeam = data.match?.awayTeam || data.awayTeam;
            if (homeTeam && awayTeam) {
              return `${homeTeam} vs ${awayTeam}`;
            }
          }
          if (type === 'spots') {
            return data.spotName || 'スポット';
          }
          if (type === 'simple-travels') {
            return data.travelTitle || '旅行記';
          }
          return '無題の投稿';
        };

        let createdAt: Date | null = null;
        if (data.createdAt) {
          if (data.createdAt instanceof Timestamp) {
            createdAt = data.createdAt.toDate();
          } else if (typeof data.createdAt === 'string') {
            createdAt = new Date(data.createdAt);
          } else if (data.createdAt.seconds) {
            createdAt = new Timestamp(data.createdAt.seconds, data.createdAt.nanoseconds).toDate();
          }
        }

        return {
          id: data.id,
          postType: type,
          collectionName: type,
          title: getTitle(),
          subtext: data.match?.stadium?.name || data.stadium || data.spotAddress || null,
          imageUrls: data.imageUrls || data.images || (data.imageUrl ? [data.imageUrl] : []),
          authorId: authorId || '',
          authorName,
          authorImage,
          createdAt,
          league: data.match?.competition || data.match?.league || data.league || data.matches?.[0]?.competition || '',
          country: data.match?.country || data.country || '',
          href: `/${type.replace(/s$/, '')}s/${data.id}`,
          originalData: data,
        };
      }).filter(item => item.imageUrls && item.imageUrls.length > 0);

      setRankedPosts(unifiedPosts as UnifiedPost[]);
    } catch (err) {
      console.error("Error fetching ranked posts:", err);
      setError('ランキングの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRankedPosts();
  }, [fetchRankedPosts]);

  return { rankedPosts, loading, error, refetch: fetchRankedPosts };
};
