// app/components/AnnouncementBanner.tsx
'use client';

'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  order: number;
}

const AnnouncementBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      const q = query(collection(db, 'banners'), orderBy('order'));
      const querySnapshot = await getDocs(q);
      const bannersData = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Banner))
        .filter(banner => banner.imageUrl);
      setBanners(bannersData);
    };

    fetchBanners();
  }, []);
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
        loop={false}
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