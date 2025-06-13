'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
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
  likeCount?: number;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Travel[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false); // 👈 クライアント判定用
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // 👈 マウント後にクライアントと判定

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
            likeCount: d.likeCount ?? 0,
          };
        });
        setPosts(data.reverse());
      } catch (error) {
        console.error('投稿取得エラー:', error);
      }
    };

    fetchPosts();

    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setIsLoggedIn(true);
          console.log('スマホログイン完了:', result.user);
        }
      })
      .catch((err) => {
        console.error('ログインエラー:', err);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handlePostClick = () => {
    router.push(isLoggedIn ? '/form' : '/login');
  };

  const handleMyPageClick = () => {
    router.push(isLoggedIn ? '/mypage' : '/login');
  };

  const groupedByCategory = posts.reduce((acc, post) => {
    const category = post.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(post);
    return acc;
  }, {} as Record<string, Travel[]>);

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


  return (
   <div className="bg-white min-h-screen pb-[72px]">
      <header className="bg-white font-sans border-b border-gray-200 relative h-14">
        <div className="max-w-screen-xl mx-auto relative h-full flex items-center justify-center">
         
          {/* タイトル（常に中央） */}
          <h1 className="text-[12px] font-bold text-gray-900 whitespace-nowrap">
            現地観戦記
          </h1>
        </div>
      </header>

    <div className="w-full flex justify-center bg-white py-6">
      <a
        href="https://note.com/football_top/n/n111e239d79a9?sub_rt=share_pw"
        target="_blank"
        rel="noopener noreferrer"
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

    <div className="px-4 py-12 text-gray-500 w-full max-w-screen-md mx-auto pb-20">
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

            <div className="block md:hidden">
              <Swiper spaceBetween={12} slidesPerView={'auto'} className="!px-4">
                {displayedPosts.map((post) => {
                  const hasImage = post.imageUrls?.[0];
                  const hasMatch = post.matches?.[0];
                  return (
                    <SwiperSlide key={post.id} className="!w-[220px] !max-w-[220px]">
                      <div className="bg-gray-100 rounded-3xl p-3">
                        <Link href={`/posts/${post.id}`}>
                          <div className="relative aspect-square w-full bg-gray-200 overflow-hidden rounded-xl">
                            {hasImage ? (
                              <Image src={hasImage} alt="投稿画像" fill className="object-cover rounded-xl" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                            )}
                          </div>
                        </Link>
                        <div className="pt-3">
                          <h3 className="text-sm font-semibold truncate text-gray-800">
                            {hasMatch ? `${hasMatch.teamA} vs ${hasMatch.teamB}` : '試合情報なし'}
                          </h3>
                          <p className="text-xs text-gray-500">{post.season || 'シーズン未設定'}</p>
                          <button onClick={() => handleLike(post.id)} className="mt-2 text-xs text-red-500">♡ {post.likeCount || 0}</button>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>

            <div className="hidden md:grid grid-cols-5 gap-4">
              {displayedPosts.map((post) => {
                const hasImage = post.imageUrls?.[0];
                const hasMatch = post.matches?.[0];
                return (
                  <div key={post.id} className="bg-gray-100 rounded-3xl p-3">
                    <Link href={`/posts/${post.id}`}>
                      <div className="relative aspect-square w-full bg-gray-200 overflow-hidden rounded-xl">
                        {hasImage ? (
                          <Image src={hasImage} alt="投稿画像" fill className="object-cover rounded-xl" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                        )}
                      </div>
                    </Link>
                    <div className="pt-4">
                      <h3 className="text-base font-bold text-gray-800 truncate">
                        {hasMatch ? `${hasMatch.teamA} vs ${hasMatch.teamB}` : '試合情報なし'}
                      </h3>
                      <p className="text-xs text-gray-500">{post.season || 'シーズン未設定'}</p>
                      <button onClick={() => handleLike(post.id)} className="mt-2 text-xs text-red-500">♡ {post.likeCount || 0}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>

   <footer className="mt-12 py-8 text-center space-y-4 text-sm text-gray-600">
  <Image
    src="/footballtop-logo-12.png"
    alt="FOOTBALLTOP ロゴ"
    width={180}
    height={60}
    unoptimized
    className="mx-auto"
  />
  <div className="flex justify-center space-x-10">
    <a href="https://x.com/FOOTBALLTOP2024" target="_blank" rel="noopener noreferrer">
      <Image src="/X.png" alt="Xリンク" width={32} height={32} className="hover:opacity-80 transition" />
    </a>
    <a href="https://note.com/football_top" target="_blank" rel="noopener noreferrer">
      <Image src="/note.png" alt="Noteリンク" width={80} height={40} className="hover:opacity-80 transition" />
    </a>
  </div>
  <p className="text-xs text-gray-400">© 2025 FOOTBALLTOP. All rights reserved.</p>
</footer>
</div> // ← ここは return 最上位の div（min-h-screen pb-[72px]）の閉じタグ
);
}
