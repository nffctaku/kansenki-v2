'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type VideoItem = { youtubeVideoId: string; label: string; description?: string };

export default function JfaVideosSection() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const res = await fetch('/api/unext-football-highlights?handle=jfa&limit=5&fetchMax=5');
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`${res.status} ${text}`.trim());
        }
        const json = await res.json();
        const items = (json?.items ?? []) as Array<{ youtubeVideoId?: string; label?: string; description?: string }>;
        const normalized = items
          .map((it) => {
            if (!it.youtubeVideoId || !it.label) return null;
            return {
              youtubeVideoId: it.youtubeVideoId,
              label: it.label,
              description: it.description,
            };
          })
          .filter(Boolean) as VideoItem[];

        if (!cancelled) setVideos(normalized.slice(0, 5));
      } catch (e) {
        if (!cancelled) {
          setVideos([]);
          setErrorMessage(e instanceof Error ? e.message : 'failed');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-gray-100">日本代表 公式YouTube</div>
            <div className="text-xs text-gray-300">@jfa</div>
          </div>
          <Link
            href="https://www.youtube.com/@jfa"
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-3 py-2 text-xs bg-white/10 text-gray-100 border border-white/10 hover:bg-white/15 transition-colors shrink-0"
          >
            チャンネル
          </Link>
        </div>

        <div className="mt-3">
          {loading ? (
            <div className="text-xs text-gray-300">読み込み中...</div>
          ) : videos.length === 0 ? (
            <div className="text-xs text-gray-300">
              動画が見つかりませんでした
              {errorMessage ? <div className="mt-1 text-[11px] text-gray-400">{errorMessage}</div> : null}
            </div>
          ) : (
            <div className="space-y-3">
              {(() => {
                const [first, ...rest] = videos;
                return (
                  <>
                    <Link
                      href={`https://www.youtube.com/watch?v=${first.youtubeVideoId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition-colors"
                    >
                      <div className="relative aspect-video w-full">
                        <Image
                          src={`https://i.ytimg.com/vi/${first.youtubeVideoId}/hqdefault.jpg`}
                          alt={first.label}
                          fill
                          sizes="(max-width: 768px) 100vw, 640px"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <div className="text-sm text-gray-100 font-semibold line-clamp-2">{first.label}</div>
                        {first.description ? (
                          <div className="mt-1 text-xs text-gray-300 line-clamp-2">{first.description}</div>
                        ) : null}
                      </div>
                    </Link>

                    {rest.length > 0 ? (
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={12}
                        slidesPerView={'auto'}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 4500, disableOnInteraction: false }}
                        loop={rest.length > 1}
                        className="pb-8"
                      >
                        {rest.slice(0, 4).map((v) => (
                          <SwiperSlide key={v.youtubeVideoId} style={{ width: '240px' }}>
                            <Link
                              href={`https://www.youtube.com/watch?v=${v.youtubeVideoId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="block rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition-colors"
                            >
                              <div className="relative aspect-video w-full">
                                <Image
                                  src={`https://i.ytimg.com/vi/${v.youtubeVideoId}/hqdefault.jpg`}
                                  alt={v.label}
                                  fill
                                  sizes="240px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="p-3">
                                <div className="text-xs text-gray-100 font-semibold line-clamp-2">{v.label}</div>
                              </div>
                            </Link>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : null}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
