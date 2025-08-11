import React from 'react';
import { useRankingPosts } from '@/hooks/useRankingPosts';
import PostCard from './PostCard';
import { FaCrown } from 'react-icons/fa';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

const Ranking = () => {
  const { rankedPosts, loading, error } = useRankingPosts();

  if (loading) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  const crownColor = (index: number) => {
    switch (index) {
      case 0:
        return 'text-yellow-400'; // Gold
      case 1:
        return 'text-gray-400'; // Silver
      case 2:
        return 'text-yellow-600'; // Bronze
      default:
        return 'text-transparent'; // Hide crown for others
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 my-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">人気投稿ランキング</h2>
      {rankedPosts.length === 0 && !loading ? (
        <p className="text-center text-gray-500">ランキング対象の投稿がまだありません。</p>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Mousewheel, Keyboard]}
          spaceBetween={10}
          slidesPerView={2}
          navigation
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          mousewheel={{ forceToAxis: true }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
          className="w-full h-full py-8"
        >
          {rankedPosts.map((post, index) => (
            <SwiperSlide key={post.id}>
              <div className="relative group">
                <PostCard post={post} />
                <div className="absolute top-1 right-1 z-10 flex items-center justify-center w-8 h-8 bg-black bg-opacity-50 rounded-full pointer-events-none">
                  <FaCrown className={`text-xl ${crownColor(index)}`} />
                  <span className="absolute text-white text-xs font-bold">
                    {index + 1}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Ranking;
