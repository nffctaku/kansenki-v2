'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

type Travel = {
  id: string;
  nickname: string;
  imageUrls?: string[];
  category?: string;
  season?: string;
  likeCount?: number;
  matches?: { teamA: string; teamB: string }[];
};

export default function CategoryPage() {
  const { category } = useParams();
  const [posts, setPosts] = useState<Travel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'simple-posts'), where('category', '==', category));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Travel[];
      setPosts(data);
    };
    if (category) fetchData();
  }, [category]);

  const categoryLabelMap: Record<string, string> = {
    england: 'イングランド',
    italy: 'イタリア',
    france: 'フランス',
    spain: 'スペイン',
    other: 'その他',
  };

  const title = categoryLabelMap[category as string] || category;

  const displayedPosts = posts.filter((post) => {
    const matchText = post.matches?.[0]
      ? `${post.matches[0].teamA} vs ${post.matches[0].teamB}`.toLowerCase()
      : '';
    const seasonText = post.season?.toLowerCase() || '';
    return (
      matchText.includes(searchTerm.toLowerCase()) ||
      seasonText.includes(searchTerm.toLowerCase())
    );
  });

 return (
  <div
    className="mb-12 px-4 w-full max-w-screen-xl mx-auto"
    style={{ paddingBottom: '200px' }}
  >
    <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-800">{title}の観戦記</h1>

    <div className="mb-6">
      <input
        type="text"
        placeholder="試合名やシーズンで検索"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring focus:border-blue-400"
      />
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[6px] w-full max-w-full">
      {displayedPosts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="block no-underline text-inherit"
        >
          <div className="bg-white rounded-lg shadow p-2 hover:opacity-90 transition">
            <div className="relative aspect-square w-full bg-gray-200 rounded overflow-hidden">
              {post.imageUrls?.[0] ? (
                <Image
                  src={post.imageUrls[0]}
                  alt="投稿画像"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 20vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}
            </div>

            {post.matches?.[0] && (
              <div className="mt-2 px-1 text-sm font-semibold truncate text-gray-800 no-underline">
                {post.matches[0].teamA} vs {post.matches[0].teamB}
              </div>
            )}

            <div className="text-xs text-gray-500 px-1">
              {post.season || 'シーズン未設定'}
            </div>

            <div className="text-xs text-red-500 px-1 mt-1">
              ♡ {post.likeCount || 0}
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);
}