'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore'; // ★ increment 追加
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

type MatchInfo = {
  teamA: string;
  teamB: string;
  competition: string;
  season: string;
  nickname: string;
};

type Travel = {
  id: string;
  nickname: string;
  imageUrls?: string[];
  category?: string;
  matches?: MatchInfo[];
  season?: string;
  likeCount?: number; // ★ 追加
};

export default function HomePage() {
  const [posts, setPosts] = useState<Travel[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  // ✅ Firestore から投稿データ取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'simple-posts'));
        const data: Travel[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            nickname: d.nickname ?? '',
            imageUrls: d.imageUrls ?? [],
            category: d.category ?? 'other',
            matches: Array.isArray(d.matches) ? d.matches : [],
            season: d.season ?? '',
            likeCount: d.likeCount ?? 0, // ★
          };
        });
        setPosts(data.reverse());
      } catch (error) {
        console.error('投稿取得エラー:', error);
      }
    };

    fetchPosts();

    // ✅ スマホリダイレクト後のログイン検知
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        setIsLoggedIn(true);
        console.log('スマホログイン完了:', result.user);
      }
    }).catch((err) => {
      console.error('ログインエラー:', err); // ★ エラーハンドリング追加
    });
  }, []);

  // ✅ 通常ログイン検知
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // ✅ 投稿ボタン
  const handlePostClick = () => {
    router.push(isLoggedIn ? '/form' : '/login');
  };

  // ✅ マイページボタン
  const handleMyPageClick = () => {
    router.push(isLoggedIn ? '/mypage' : '/login');
  };

  // ✅ 投稿をカテゴリごとにまとめる
  const groupedByCategory = posts.reduce((acc, post) => {
    const category = post.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(post);
    return acc;
  }, {} as Record<string, Travel[]>);

  // ✅ いいね処理（匿名）
  const handleLike = async (postId: string) => {
    const likedKey = `liked_${postId}`;
    if (typeof window !== 'undefined' && localStorage.getItem(likedKey)) return;

    try {
      const postRef = doc(db, 'simple-posts', postId);
      await updateDoc(postRef, {
        likeCount: increment(1),
      });
      localStorage.setItem(likedKey, 'true');
    } catch (error) {
      console.error('いいねエラー:', error);
    }
  };

  // 🔻 この下に return JSX が続く（ここには手を入れなくてOK）



return (
  <div className="bg-white min-h-screen">
    <header className="bg-white px-4 py-4 font-sans border-b border-gray-200">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* 左：タイトル */}
        <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
          現地観戦記
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
  <a
    href="https://note.com/football_top/n/n111e239d79a9?sub_rt=share_pw"
    target="_blank"
    rel="noopener noreferrer"
    className="block"
  >
    <Image
      src="/グリーン　イエロー　シンプル　クーポン　バナー.png"
      alt="クーポンバナー"
      width={800}
      height={200}
      className="rounded-lg shadow-md max-w-full h-auto transition hover:opacity-90"
    />
  </a>
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
        <h2 className="text-lg font-bold mb-4 px-2 text-gray-800">
  <Link href={`/category/${category}`}>
    <span className="inline-block hover:text-blue-600 transition duration-200">
      {japaneseCategory}
    </span>
  </Link>
</h2>
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
                                src={post.imageUrls?.[0] ?? '/no-image.png'}
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
    {post.season || 'シーズン未設定'}
  </p>
   {/* ♡ いいねボタン */}
  <button
  onClick={() => handleLike(post.id)}
  className="mt-2 text-xs text-red-500 hover:opacity-80 transition bg-transparent border-none outline-none appearance-none"
>
  ♡ {post.likeCount || 0}
</button>

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
                            src={post.imageUrls?.[0] ?? '/no-image.png'}
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
                      <p className="text-xs text-gray-500">
  {post.season || 'シーズン未設定'}
</p>
 {/* ♡ いいねボタン */}
  <button
  onClick={() => handleLike(post.id)}
  className="mt-2 text-xs text-red-500 hover:opacity-80 transition bg-transparent border-none outline-none appearance-none"
>
  ♡ {post.likeCount || 0}
</button>
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

  {/* ✅ XとNoteのアイコンリンク表示（アイコン間隔を広めに） */}
  <div className="flex justify-center space-x-10">
    <a
      href="https://x.com/FOOTBALLTOP2024"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src="/X.png"
        alt="Xリンク"
        width={32}
        height={32}
        className="hover:opacity-80 transition"
      />
    </a>
    <a
      href="https://note.com/football_top"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
         src="/note.png"
  alt="Noteリンク"
  width={80}
  height={40}
        className="hover:opacity-80 transition"
      />
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
