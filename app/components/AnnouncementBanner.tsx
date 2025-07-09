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
    imageUrl: '/FOOTBALLTOP (7).png',
    title: '遂に今週開催！',
    subtitle: 'サカシャツ展の申込はこちらから',
    link: '/news/new-feature',
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
    imageUrl: '/FOOTBALLTOP (5).png',
    title: '',
    subtitle: 'ファンメディアはこちらから！',
    link: '/campaign/post-2025',
  },
];

const AnnouncementBanner = () => {
  return (
    <div className="w-full my-3 px-3">
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
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
          '--swiper-navigation-color': '#FFFFFF',
          '--swiper-pagination-color': '#FFFFFF',
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="bg-vuitton-brown rounded-xl overflow-hidden shadow-md">
              <Link href={banner.link} className="no-underline">
                <div className="relative w-full h-48">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-white text-md font-bold truncate">{banner.title}</h3>
                  <p className="text-gray-200 text-sm mt-1 truncate">{banner.subtitle}</p>
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