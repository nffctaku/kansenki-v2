'use client';

import Link from 'next/link';
import AnnouncementBanner from '../components/AnnouncementBanner';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { UnifiedPostWithDate } from '@/types/post';
import { Timestamp } from 'firebase/firestore';
import PostCard from '@/components/PostCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function TimelinePage() {
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
                data.authorName ||
                (data.author && typeof data.author === 'object' ? data.author.name : null) ||
                '名無し',
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

  const curatedTweets: Array<{
    id: string;
    label: string;
    excerpt?: string;
    publishedAt?: string;
  }> = [
    {
      id: '2039042166862004322',
      label: 'SAMURAI BLUE',
      excerpt: undefined,
      publishedAt: undefined,
    },
  ];

  const profileUrl = 'https://x.com/jfa_samuraiblue?s=20';

  return (
    <>
      <AnnouncementBanner />
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950">
        <div className="px-3 pt-4 pb-24">
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

          <div className="rounded-2xl border border-white/10 bg-white/10 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-100">日本代表 公式X</div>
                  <div className="text-xs text-gray-300">@jfa_samuraiblue</div>
                </div>
                <Link
                  href={profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full px-3 py-2 text-xs bg-white/10 text-gray-100 border border-white/10 hover:bg-white/15 transition-colors shrink-0"
                >
                  プロフィール
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {curatedTweets.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
                  >
                    <div className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-sm text-gray-100 font-semibold">X</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm text-gray-100 truncate">{t.label}</div>
                            {t.publishedAt && (
                              <div className="text-xs text-gray-400 shrink-0">{t.publishedAt}</div>
                            )}
                          </div>
                          {t.excerpt ? (
                            <div className="mt-1 text-xs text-gray-200 leading-relaxed line-clamp-3">
                              {t.excerpt}
                            </div>
                          ) : (
                            <div className="mt-1 text-xs text-gray-300">
                              ここに本文の抜粋を入れると、アプリ内で内容が見やすくなります。
                            </div>
                          )}
                          <div className="mt-3 flex items-center gap-2">
                            <Link
                              href={`https://x.com/jfa_samuraiblue/status/${t.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full px-3 py-2 text-xs bg-white/90 text-slate-900 hover:bg-white transition-colors"
                            >
                              ツイートを開く
                            </Link>
                            <Link
                              href={profileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full px-3 py-2 text-xs bg-white/10 text-gray-100 border border-white/10 hover:bg-white/15 transition-colors"
                            >
                              公式Xへ
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
