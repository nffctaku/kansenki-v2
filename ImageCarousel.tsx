'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';

type ImageCarouselProps = {
  imageUrls: string[];
};

export default function ImageCarousel({ imageUrls }: ImageCarouselProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <Swiper
        pagination={{ clickable: true }}
        modules={[Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        className="rounded-xl"
      >
        {imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div className="relative aspect-square w-full bg-gray-200 rounded overflow-hidden">
              <Image
                src={url}
                alt={`投稿画像 ${index + 1}`}
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
