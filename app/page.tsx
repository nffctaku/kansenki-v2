'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'

type Travel = {
  id: string;
  nickname: string;
  imageUrls?: string[];
  category?: string;
  matches?: {
    teamA: string;
    teamB: string;
    competition: string;
    season: string;
    nickname: string;
  }[];
};

export default function HomePage() {
  const [posts, setPosts] = useState<Travel[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, 'simple-posts'));
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          nickname: d.nickname || '',
          imageUrls: d.imageUrls || [],
          category: d.category || '',
          matches: d.matches || [],
        };
      });
      setPosts(data.reverse());
    };

    fetchPosts();

    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        setIsLoggedIn(true);
        console.log('スマホログイン完了:', result.user);
      }
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handlePostClick = () => {
    if (isLoggedIn) {
      router.push('/form');
    } else {
      router.push('/login');
    }
  };

  const handleMyPageClick = () => {
    if (isLoggedIn) {
      router.push('/mypage');
    } else {
      router.push('/login');
    }
  };

  const groupedByCategory = posts.reduce((acc, post) => {
    const category = post.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(post);
    return acc;
  }, {} as Record<string, Travel[]>);


return (
  <div className="bg-white min-h-screen">
    <header className="bg-white px-4 py-4 font-sans border-b border-gray-200">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* 左：タイトル */}
        <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
          現地観戦
        </h1>

        {/* 右：マイページ・投稿する（アイコン＋ラベル） */}
        <div className="flex items-center gap-6">
          {/* マイページ */}
          <button
            onClick={handleMyPageClick}
            className="flex flex-col items-center p-0 m-0 border-none bg-transparent hover:opacity-80"
          >
            <Image
              src="/ノートパソコンのアイコン素材3.png"
              alt="マイページ"
              width={28}
              height={28}
            />
            <span className="text-xs text-gray-500 mt-1">マイページ</span>
          </button>

          {/* 投稿する */}
          <button
            onClick={handlePostClick}
            className="flex flex-col items-center p-0 m-0 border-none bg-transparent hover:opacity-80"
          >
            <Image
              src="/枠つきの羽根ペンのアイコン素材.png"
              alt="投稿する"
              width={28}
              height={28}
            />
            <span className="text-xs text-gray-500 mt-1">投稿する</span>
          </button>
        </div>
      </div>

      {/* 検索バー（やわらかいUI + 薄いグレー背景） */}
      <div className="mt-4 max-w-screen-xl mx-auto px-2">
        <div className="w-full max-w-[600px] bg-gray-100 rounded-full px-4 py-2 shadow-sm">
          <input
            type="text"
            placeholder="クラブ名を検索"
            className="w-full h-10 bg-transparent text-base text-gray-800 placeholder-gray-400 border-none focus:outline-none"
          />
        </div>
      </div>
    </header>

    {/* 🔽 バナー画像差し込み */}
    <div className="w-full flex justify-center bg-white py-6">
      <Image
        src="/グリーン　イエロー　シンプル　クーポン　バナー.png"
        alt="バナー"
        width={800}
        height={200}
        className="rounded-lg shadow-md max-w-full h-auto"
      />
    </div>

    <div className="px-4 py-12 text-gray-500 w-full max-w-screen-md mx-auto">
      {Object.entries(groupedByCategory).map(([category, posts]) => {
        const categoryLabelMap: Record<string, string> = {
          england: 'イングランド',
          italy: 'イタリア',
          spain: 'スペイン',
          germany: 'ドイツ',
          france: 'フランス',
          other: 'その他',
        };

        const japaneseCategory = categoryLabelMap[category] || category;
        const displayedPosts = posts.slice(0, 5);

        return (
          <div key={category} className="mb-10 bg-gray-100 px-2 py-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4 px-2">{japaneseCategory}</h2>

            {/* ✅ スマホ表示（Swiper） */}
            <div className="block md:hidden">
              <Swiper spaceBetween={12} slidesPerView={'auto'} className="!px-4">
                {displayedPosts.map((post) => {
                  const hasImage = post.imageUrls?.[0];
                  const hasMatch = post.matches?.[0];

                  return (
                    <SwiperSlide key={post.id} className="!w-[220px] !max-w-[220px] shrink-0">
                      <div className="bg-gray-100 rounded-3xl p-3 transition-all duration-300">
                        <Link href={`/posts/${post.id}`}>
                          <div className="relative aspect-square w-full bg-gray-200 overflow-hidden rounded-xl">
                            {hasImage ? (
                              <Image
                                src={post.imageUrls[0]}
                                alt="投稿画像"
                                fill
                                className="object-cover rounded-xl"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                No Image
                              </div>
                            )}
                          </div>
                        </Link>
                        <div className="pt-3">
                          <h3 className="text-sm font-semibold truncate text-gray-800">
                            {hasMatch
                              ? `${hasMatch.teamA} vs ${hasMatch.teamB}`
                              : '試合情報なし'}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {hasMatch?.season || 'シーズン未設定'}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>

            {/* ✅ PC表示（Grid） */}
            <div className="hidden md:grid grid-cols-5 gap-[16px] w-full max-w-full">
              {displayedPosts.map((post) => {
                const hasImage = post.imageUrls?.[0];
                const hasMatch = post.matches?.[0];

                return (
                  <div key={post.id} className="bg-gray-100 rounded-3xl p-3 transition-all duration-300">
                    <Link href={`/posts/${post.id}`}>
                      <div className="relative aspect-square w-full bg-gray-200 overflow-hidden rounded-xl">
                        {hasImage ? (
                          <Image
                            src={post.imageUrls[0]}
                            alt="投稿画像"
                            fill
                            className="object-cover rounded-xl"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No Image
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="pt-4">
                      <h3 className="text-base font-bold text-gray-800 truncate">
                        {hasMatch
                          ? `${hasMatch.teamA} vs ${hasMatch.teamB}`
                          : '試合情報なし'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {hasMatch?.season || 'シーズン未設定'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ✅ map の外に置いたフッター（1回だけ表示される） */}
      <footer className="mt-12 py-8 text-center space-y-4 text-sm text-gray-600">
        <Image
          src="/footballtop-logo-12.png"
          alt="FOOTBALLTOP ロゴ"
          width={180}
          height={60}
          unoptimized
          className="mx-auto"
        />
        <div className="flex justify-center space-x-6">
          <a
            href="https://x.com/footballtop_jp"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            X
          </a>
          <a
            href="https://note.com/football_top"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Note
          </a>
        </div>
        <p className="text-xs text-gray-400">
          © 2025 FOOTBALLTOP. All rights reserved.
        </p>
      </footer>
    </div>
  </div>
);
}
