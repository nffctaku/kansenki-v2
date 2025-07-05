'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Hotel, SimpleTravel, IndividualCost, Transport } from '@/types/match';
import { Post } from '@/types/post';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { airlineOptions, seatClassOptions, costLabels } from '@/components/data';
import LikeButton from '@/components/LikeButton';
import ShareButton from '@/components/ShareButton';

// Helper component for star ratings
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center my-2">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// Helper component for content sections
const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
    <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">{title}</h2>
    {children}
  </div>
);

export default function PostDetailClient({ initialPost }: { initialPost: Post }) {
  const router = useRouter();
  const [post, setPost] = useState<Post>(initialPost);

  if (!post) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <p className="text-lg text-slate-600 dark:text-slate-400">投稿が見つかりませんでした。</p>
                <button onClick={() => router.back()} className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline">
                    ← 戻る
                </button>
            </div>
        </div>
    );
  }

  const { id, title, content, images, match, hotels, spots, costs, goods, firstAdvice, transports } = post;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 break-words">{title}</h1>
      
      {images && images.length > 0 && (
        <div className="mb-8">
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="rounded-lg shadow-lg"
          >
            {images.map((url, index) => (
              <SwiperSlide key={index}>
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                  <Image src={url} alt={`${title}の画像 ${index + 1}`} layout="fill" objectFit="contain" className="rounded-lg" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {match && (
        <DetailSection title="試合情報">
           {/* Match details rendering */}
        </DetailSection>
      )}

      {/* Other sections like Hotels, Spots, Costs etc. */}

      <div className="my-8 py-6 border-y border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-center gap-4">
        <LikeButton postId={id} size="md" />
        <ShareButton title={post.title} url={`https://kansenki.footballtop.net/posts/${id}`} />
      </div>

      <div className="mt-6">
        <button onClick={() => router.back()} className="text-indigo-600 dark:text-indigo-400 hover:underline">
          ← 戻る
        </button>
      </div>
    </div>
  );
}
