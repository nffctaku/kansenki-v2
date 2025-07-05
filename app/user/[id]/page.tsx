'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
export const dynamic = 'force-dynamic';

import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';


import { useTheme } from 'next-themes';
import LikeButton from '@/components/LikeButton';
import { travelFrequencyOptions, countryOptions, overseasMatchCountOptions } from '@/components/data';

type UserInfo = {
  nickname: string;
  id: string;
  xLink?: string;
  noteLink?: string;
  youtubeUrl?: string;
  instagramLink?: string;
  avatarUrl?: string;
  bio?: string;
  travelFrequency?: string;
  residence?: string;
  overseasMatchCount?: string;
  visitedCountries?: string[];
};

export default function UserPostsPage() {
  const { id } = useParams();
  useTheme();
  const [posts, setPosts] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchUserAndPosts = async (userId: string) => {
      setLoading(true);
      try {
        // ユーザーのUIDを使って、該当するユーザーをusersコレクションから直接取得します。
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          // 該当ユーザーが見つからなかった場合
          setNotFound(true);
          setLoading(false);
          return;
        }

        // ユーザー情報と、投稿の検索に使う内部的なID（UID）を取得します。
        const userData = userDoc.data();
        const userUid = userDoc.id; // This is the UID, which is what we need for posts query

        // 画面に表示するためのユーザー情報をセットします。
        setUserInfo(userData as UserInfo);

        // 取得したUIDを使って、そのユーザーの投稿一覧を取得します。
        // 新しいフォーマットの投稿 ('posts'コレクション)
        const postsCollection = collection(db, 'posts');
        const qNew = query(
          postsCollection,
          where('authorId', '==', userUid),
          where('isPublic', '==', true)
        );
        const snapshotNew = await getDocs(qNew);
        const newPosts = snapshotNew.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            matches: d.match ? [d.match] : [],
          };
        });

        // 古いフォーマットの投稿 ('simple-posts'コレクション)
        const simplePostsCollection = collection(db, 'simple-posts');
        const qLegacy = query(simplePostsCollection, where('uid', '==', userUid));
        const snapshotLegacy = await getDocs(qLegacy);
        const legacyPosts = snapshotLegacy.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 新旧の投稿を結合し、重複を排除した上で、作成日時順に並び替えます。
        const combined = [...newPosts, ...legacyPosts];
        const uniquePosts = Array.from(new Map(combined.map((p) => [p.id, p])).values());
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
      fetchUserAndPosts(id);
    } else {
      // URLにIDが含まれていない場合
      setNotFound(true);
      setLoading(false);
    }
  }, [id]);

  if (loading) return <p className="p-6 dark:text-white">読み込み中...</p>;
  if (notFound || !userInfo) return <p className="p-6 text-red-500">ユーザーが見つかりません。</p>;

  return (
    <div className="max-w-screen-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">

      <div className="p-4 sm:p-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
          {/* Avatar */}
          <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden flex-shrink-0 border-4 border-white dark:border-gray-800 shadow-md">
            <Image
              src={userInfo.avatarUrl || '/no-image.png'}
              alt="avatar"
              fill
              className="object-cover"
            />
          </div>

          {/* User Info (Name, Links, Bio) */}
          <div className="mt-4 sm:mt-0 text-center sm:text-left flex-grow">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{userInfo.nickname}</h1>
            
            {/* Social Links */}
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
              {userInfo.xLink && (
                <a href={userInfo.xLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <FaXTwitter size={24} />
                </a>
              )}
              {userInfo.instagramLink && (
                <a href={userInfo.instagramLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <FaInstagram size={24} />
                </a>
              )}
              {userInfo.youtubeUrl && (
                <a href={userInfo.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <FaYoutube size={24} />
                </a>
              )}
              {userInfo.noteLink && (
                <a href={userInfo.noteLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <span className="font-bold text-xl">note</span>
                </a>
              )}
            </div>

            {/* Bio */}
            {userInfo.bio && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center sm:text-left whitespace-pre-wrap">
                {userInfo.bio}
              </p>
            )}

            {/* Travel Info Section */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 w-full text-left">
                <div className="space-y-3">
                    {userInfo.residence && userInfo.residence !== '未選択' && (
                        <div className="flex">
                            <span className="w-32 text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">居住地</span>
                            <span className="text-sm text-gray-800 dark:text-gray-200">{countryOptions.find(o => o.value === userInfo.residence)?.label || userInfo.residence}</span>
                        </div>
                    )}
                    {userInfo.travelFrequency && userInfo.travelFrequency !== '0' && (
                        <div className="flex">
                            <span className="w-32 text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">海外渡航回数</span>
                            <span className="text-sm text-gray-800 dark:text-gray-200">{travelFrequencyOptions.find(o => o.value === userInfo.travelFrequency)?.label || userInfo.travelFrequency}</span>
                        </div>
                    )}
                    {userInfo.overseasMatchCount && userInfo.overseasMatchCount !== '0' && (
                        <div className="flex">
                            <span className="w-32 text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">海外観戦試合数</span>
                            <span className="text-sm text-gray-800 dark:text-gray-200">{overseasMatchCountOptions.find(o => o.value === userInfo.overseasMatchCount)?.label || userInfo.overseasMatchCount}</span>
                        </div>
                    )}
                    {userInfo.visitedCountries && userInfo.visitedCountries.length > 0 && (
                        <div className="flex items-start">
                            <span className="w-32 text-sm font-medium text-gray-500 dark:text-gray-400 pt-0.5 shrink-0">行ったことのある国</span>
                            <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">{userInfo.visitedCountries.map(country => countryOptions.find(c => c.value === country)?.label || country).join(', ')}</span>
                        </div>
                    )}
                </div>
            </div>
          </div>
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
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                  {post.season || (post.matches?.[0]?.date ? new Date(post.matches[0].date).toLocaleDateString('ja-JP') : 'シーズン未設定')}
              </p>
              <LikeButton postId={post.id} size="xs" />
            </div>
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
