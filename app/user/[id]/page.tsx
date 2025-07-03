'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

type UserInfo = {
  nickname: string;
  xLink?: string;
  noteLink?: string;
  avatarUrl?: string;
  coverUrl?: string;
};

export default function UserPostsPage() {
  const { id } = useParams();
  useTheme();
  const [posts, setPosts] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async (userId: string) => {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setNotFound(true);
          return;
        }

        const userData = userSnap.data();
        setUserInfo(userData as UserInfo);

        // Fetch from 'posts' (new format)
        const postsCollection = collection(db, 'posts');
        const qNew = query(postsCollection, where("authorId", "==", userId), where("isPublic", "==", true));
        const snapshotNew = await getDocs(qNew);
        const newPosts = snapshotNew.docs.map((doc) => {
            const d = doc.data();
            return {
                id: doc.id,
                ...d,
                // ensure consistency for fields used in render
                matches: d.match ? [d.match] : [],
            };
        });

        // Fetch from 'simple-posts' (legacy format)
        const simplePostsCollection = collection(db, 'simple-posts');
        const qLegacy = query(simplePostsCollection, where('uid', '==', userId));
        const snapshotLegacy = await getDocs(qLegacy);
        const legacyPosts = snapshotLegacy.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Combine and remove duplicates
        const combined = [...newPosts, ...legacyPosts];
        const uniquePosts = Array.from(new Map(combined.map(p => [p.id, p])).values());
        
        // Sort by creation date
        uniquePosts.sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));

        setPosts(uniquePosts);
      } catch (err) {
        console.error('データ取得エラー:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (id && typeof id === 'string') {
      fetchUserPosts(id);
    } else if (id) {
      // Handle cases where id is string[] if necessary, or mark as not found
      setNotFound(true);
      setLoading(false);
    }
  }, [id]);

  if (loading) return <p className="p-6 dark:text-white">読み込み中...</p>;
  if (notFound || !userInfo) return <p className="p-6 text-red-500">ユーザーが見つかりません。</p>;

  return (
    <div className="max-w-screen-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* カバー画像 */}
      {userInfo.coverUrl && (
        <div className="relative h-40 w-full bg-gray-200 dark:bg-gray-700">
          <Image
            src={userInfo.coverUrl}
            alt="cover"
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="px-4 pt-4 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userInfo.nickname}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">@{id}</p>

        {/* XリンクとNoteリンク */}
        <div className="flex items-center gap-4">
          {userInfo.xLink && (
            <Link href={userInfo.xLink} target="_blank" rel="noopener noreferrer">
              <Image
                src="/X.png"
                alt="Xリンク"
                width={32}
                height={32}
                className="hover:opacity-80 rounded dark:invert"
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
<div className="px-4 pb-10 mt-4 border-t dark:border-gray-700 pt-6">
  {posts.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-400">投稿がありません。</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <Link href={`/posts/${post.id}`}>
            <div className="w-full aspect-square bg-gray-100 dark:bg-gray-600 relative">
              <Image
                src={post.imageUrls?.[0] || '/no-image.png'}
                alt="観戦写真"
                fill
                className="object-cover"
              />
            </div>
          </Link>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
              {post.matches?.[0]
                ? `${post.matches[0].homeTeam || post.matches[0].teamA} vs ${post.matches[0].awayTeam || post.matches[0].teamB}`
                : '試合情報なし'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
