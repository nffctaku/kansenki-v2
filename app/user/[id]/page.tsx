'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';

type UserInfo = {
  nickname: string;
  xLink?: string;
  noteLink?: string;
  avatarUrl?: string;
  coverUrl?: string;
};

export default function UserPostsPage() {
  const { id } = useParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const usersRef = collection(db, 'users');
        const userQuery = query(usersRef, where('id', '==', id));
        const userSnap = await getDocs(userQuery);

        if (userSnap.empty) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const userDoc = userSnap.docs[0];
        const userData = userDoc.data();
        const { nickname, xLink, noteLink, avatarUrl, coverUrl } = userData;

        setUserInfo({ nickname, xLink, noteLink, avatarUrl, coverUrl });

        const postsRef = collection(db, 'simple-posts');
        const postsQuery = query(postsRef, where('uid', '==', userData.uid));
        const postsSnap = await getDocs(postsQuery);

        const fetchedPosts = postsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(fetchedPosts);
      } catch (err) {
        console.error('データ取得エラー:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [id]);

  if (loading) return <p className="p-6">読み込み中...</p>;
  if (notFound || !userInfo) return <p className="p-6 text-red-500">ユーザーが見つかりません。</p>;

  return (
    <div className="max-w-screen-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
      {/* カバー画像 */}
      <div className="relative h-40 w-full bg-gray-200">
        {userInfo.coverUrl && (
          <Image
            src={userInfo.coverUrl}
            alt="cover"
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="px-4 pt-4 pb-6">
        <h1 className="text-2xl font-bold text-gray-900">{userInfo.nickname}</h1>
        <p className="text-sm text-gray-500 mb-3">@{id}</p>

        {/* XリンクとNoteリンク */}
        <div className="flex items-center gap-4">
          {userInfo.xLink && (
            <Link href={userInfo.xLink} target="_blank" rel="noopener noreferrer">
              <Image
                src="/X.png"
                alt="Xリンク"
                width={32}
                height={32}
                className="hover:opacity-80 rounded"
              />
            </Link>
          )}
          {userInfo.noteLink && (
            <Link href={userInfo.noteLink} target="_blank" rel="noopener noreferrer">
              <Image
                src="/note.png"
                alt="Noteリンク"
                width={80}
                height={40}
                className="hover:opacity-80 rounded"
              />
            </Link>
          )}
        </div>
      </div>

      {/* 投稿一覧 */}
<div className="px-4 pb-10 mt-4 border-t pt-6">
  {posts.length === 0 ? (
    <p className="text-gray-500">投稿がありません。</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <Link href={`/posts/${post.id}`}>
            <div className="w-full aspect-square bg-gray-100 relative">
              <Image
                src={post.imageUrls?.[0] || '/no-image.png'}
                alt="観戦写真"
                fill
                className="object-cover"
              />
            </div>
          </Link>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 truncate">
              {post.matches?.[0]
                ? `${post.matches[0].teamA} vs ${post.matches[0].teamB}`
                : '試合情報なし'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
                {post.season || 'シーズン未設定'}
            </p>
            <p className="text-xs text-red-500 mt-1">
              ♡ {post.likeCount || 0}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}

  {/* トップページに戻るボタン */}
  <div className="mt-8 text-center">
    <Link
      href="/"
      className="inline-block bg-blue-600 text-white text-sm font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
    >
      トップページに戻る
    </Link>
  </div>
</div>
</div>
  );
}
