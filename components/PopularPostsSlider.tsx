"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRankingPosts } from '@/hooks/useRankingPosts';
import PostCard from './PostCard';
import { Skeleton } from '@/components/ui/skeleton';

const PopularPostsSlider = () => {
  const { rankedPosts, loading, error } = useRankingPosts();

  if (loading) {
    return (
      <div className="w-full overflow-hidden">
        <div className="flex space-x-4 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="min-w-[280px] h-[350px] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }
  
  if (rankedPosts.length === 0) {
    return null; // データがない場合は何も表示しない
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 px-4 text-white">人気の観戦記</h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={'auto'}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="pb-10 px-4"
      >
        {rankedPosts.map((post) => (
          <SwiperSlide key={post.id} style={{ width: '280px' }}>
            <PostCard post={post} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PopularPostsSlider;
