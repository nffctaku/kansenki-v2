'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useRecentSpots } from '@/hooks/useRecentSpots';
import PostCard from '@/components/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toUnifiedPost } from '@/types/post';
import { UnifiedPost } from '@/types/post';
import { useEffect, useState } from 'react';

export const RecentSpotsSlider = () => {
  const { spots, authorProfiles, loading, error } = useRecentSpots(10);
  const [unifiedSpots, setUnifiedSpots] = useState<UnifiedPost[]>([]);

  useEffect(() => {
    if (spots.length > 0 && authorProfiles.size > 0) {
      const transformedSpots = spots
        .map(spot => toUnifiedPost(spot, 'spots', null, null, authorProfiles))
        .filter((post): post is UnifiedPost => post !== null);
      setUnifiedSpots(transformedSpots);
    }
  }, [spots, authorProfiles]);

  if (error) {
    return <div className="text-red-500 text-center my-4">{error}</div>;
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-white">おすすめスポット</h2>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1.5}
        navigation
        breakpoints={{
          640: { slidesPerView: 2.5 },
          1024: { slidesPerView: 4.5 },
        }}
        className="pb-4"
      >
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <SwiperSlide key={index}>
                <Skeleton className="h-[300px] w-full rounded-lg" />
              </SwiperSlide>
            ))
          : unifiedSpots.map((spot) => (
              <SwiperSlide key={spot.id}>
                <PostCard post={spot} />
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};
