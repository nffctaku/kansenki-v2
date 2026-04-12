'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UnifiedPostWithDate } from '@/types/post';
import PostCard from '@/components/PostCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

export default function LatestPostsSection() {
  const [latestPosts, setLatestPosts] = useState<UnifiedPostWithDate[]>([]);
  const [latestPostsLoading, setLatestPostsLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      setLatestPostsLoading(true);
      try {
        const collectionNames = ['posts', 'simple-posts'];
        const allItems: { data: any; type: string }[] = [];

        for (const collectionName of collectionNames) {
          const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'), limit(5));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            allItems.push({ data: { ...data, id: doc.id }, type: collectionName });
          });
        }

        const unifiedItems: UnifiedPostWithDate[] = allItems
          .map(({ data, type }) => {
            const getTitle = () => {
              if (data.title) return data.title;
              const homeTeam = data.match?.homeTeam || data.homeTeam;
              const awayTeam = data.match?.awayTeam || data.awayTeam;
              if (homeTeam && awayTeam) return `${homeTeam} vs ${awayTeam}`;
              return '無題';
            };

            return {
              id: data.id,
              postType: type.replace(/s$/, '') as any,
              collectionName: type,
              title: getTitle(),
              subtext: data.match?.stadium?.name || data.stadium || null,
              imageUrls: data.imageUrls || data.images || (data.imageUrl ? [data.imageUrl] : []),
              authorId: data.authorId || data.userId || (data.author && data.author.id) || '',
              authorName:
                data.authorName || (data.author && typeof data.author === 'object' ? data.author.name : null) || '名無し',
              authorImage:
                (data.author && typeof data.author === 'object' ? data.author.image : null) ||
                data.authorImage ||
                '/default-avatar.svg',
              createdAt: (() => {
                const d = data.createdAt;
                if (!d) return null;
                if (d instanceof Date) return d;
                if (typeof d === 'string') return new Date(d);
                if (typeof d.seconds === 'number') return new Timestamp(d.seconds, d.nanoseconds).toDate();
                return null;
              })(),
              league: data.match?.competition || data.match?.league || data.league || '',
              country: data.match?.country || data.country || '',
              href: `/${type}/${data.id}`,
              originalData: data,
            };
          })
          .filter((item) => item.imageUrls && item.imageUrls.length > 0);

        unifiedItems.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
        setLatestPosts(unifiedItems.slice(0, 5));
      } catch {
        setLatestPosts([]);
      } finally {
        setLatestPostsLoading(false);
      }
    };

    fetchLatest();
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 overflow-hidden mb-4">
      <div className="p-4">
        <div className="text-sm text-gray-100">最新の観戦記</div>
        <div className="mt-3">
          {latestPostsLoading ? (
            <div className="text-xs text-gray-300">読み込み中...</div>
          ) : latestPosts.length === 0 ? (
            <div className="text-xs text-gray-300">まだ観戦記がありません</div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={12}
              slidesPerView={'auto'}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              loop={latestPosts.length > 1}
              className="pb-8"
            >
              {latestPosts.map((post) => (
                <SwiperSlide key={post.id} style={{ width: '240px' }}>
                  <PostCard post={post} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}
