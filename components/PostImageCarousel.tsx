'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';

interface PostImageCarouselProps {
  imageUrls: string[];
}

export default function PostImageCarousel({ imageUrls }: PostImageCarouselProps) {
  if (!imageUrls || imageUrls.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <Swiper
        pagination={{ clickable: true }}
        modules={[Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        className="rounded-xl"
      >
        {imageUrls.slice(0, 5).map((url: string, index: number) => (
          <SwiperSlide key={index}>
            <div className="relative aspect-square w-full bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
              <Image
                src={url}
                alt={`観戦写真${index + 1}`}
                fill
                sizes="100%"
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
