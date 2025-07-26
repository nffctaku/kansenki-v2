// app/components/AnnouncementBanner.tsx
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// お知らせバナーのサンプルデータ。将来的には外部から取得するように変更できます。
const banners = [
  {
    id: 1,
    imageUrl: '/世界中のFOOTBALL (12).png',
    title: 'プレゼントキャンペーン開催！',
    subtitle: '観戦記投稿でリヴァプールグッズをGET',
    link: 'https://note.com/football_top/n/nacd67cc7aa8e?sub_rt=share_pw',
  },
  {
    id: 2,
    imageUrl: '/世界中のFOOTBALL (9).png',
    title: 'アップデート',
    subtitle: '追加投稿が簡単に！',
    link: '/features/champions-league',
  },
  {
    id: 3,
    imageUrl: '/世界中のFOOTBALL (10).png',
    title: '海外サッカーファンにフォーカス',
    subtitle: 'ファンメディアはこちらから！',
    link: '/campaign/post-2025',
  },
];

const AnnouncementBanner = () => {
  return (
    <div className="w-full my-3 px-3 md:px-6 lg:px-8">
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        className="pb-10"
        style={{
          // @ts-ignore
          '--swiper-navigation-color': '#000000',
          '--swiper-pagination-color': '#000000',
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <Link href={banner.link} className="no-underline">
                <div className="relative w-full h-48 sm:h-52 md:h-56 lg:h-60">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-gray-800 dark:text-white text-sm md:text-base lg:text-lg font-bold truncate">{banner.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm lg:text-base mt-1 truncate">{banner.subtitle}</p>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AnnouncementBanner;