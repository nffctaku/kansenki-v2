'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, limit, Timestamp } from 'firebase/firestore';
export const dynamic = 'force-dynamic';

import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';

import { useTheme } from 'next-themes';
import PostCard from '@/components/PostCard';
import SpotCard, { SpotData } from '@/components/SpotCard';
import { UnifiedPost } from '@/types/post';
import { SimplePost } from '@/types/match';
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

const toUnifiedPost = (
    item: any, 
    type: string, 
    authorProfile?: UserInfo
  ): UnifiedPost | null => {
  if (!item || !item.id) return null;

  // Prioritize authorProfile for consistent author info on the user page
  const post = item as any;
  const authorId = authorProfile?.id || post.author?.id || post.authorId || post.userId || '';
  const authorName = authorProfile?.nickname || post.author?.name || post.authorName || '名無し';
  const authorImage = authorProfile?.avatarUrl || post.author?.image || post.authorImage || '/default-avatar.svg';



  let subtext: string | null = null;
  if (post.match?.stadium?.name) {
    subtext = `${post.match.league} | ${post.match.stadium.name}`;
  } else if (post.spotName) {
    subtext = post.spotName;
  }

  let createdAt: Date | null = null;
  if (post.createdAt) {
    if (post.createdAt instanceof Timestamp) {
      createdAt = post.createdAt.toDate();
    } else if (typeof post.createdAt === 'string') {
      createdAt = new Date(post.createdAt);
    } else if (post.createdAt.seconds) {
      createdAt = new Timestamp(post.createdAt.seconds, post.createdAt.nanoseconds).toDate();
    }
  }

  const unifiedPost: UnifiedPost = {
    id: post.id,
    postType: type as any,
    collectionName: type,
    title: post.title || post.spotName || '無題',
    subtext,
    imageUrls: post.imageUrls || post.images || (post.imageUrl ? [post.imageUrl] : []),
    authorId,
    authorName,
    authorImage,
    createdAt,
    league: post.match?.league || '',
    country: post.match?.country || '',
    href: `/${type}/${post.id}`,
    originalData: item,
  };

  return unifiedPost;
};

export default function UserPostsPage() {
  const { id } = useParams();
  useTheme();
  const [items, setItems] = useState<UnifiedPost[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const getMillis = (date: Date | Timestamp | null): number => {
    if (!date) return 0;
    if (date instanceof Timestamp) return date.toMillis();
    return date.getTime();
  };

  useEffect(() => {
    const fetchUserAndPosts = async (userId: string) => {
      console.log('Fetching data for user:', userId);
      setLoading(true);
      try {
        const usersCollection = collection(db, 'users');
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const userData = userDocSnap.data() as UserInfo;
        setUserInfo(userData);
        console.log('User info fetched:', userData);

        const fetchCollection = async (collectionName: string, postType: 'post' | 'simple-post' | 'spot' | 'simple-travel') => {
          const collRef = collection(db, collectionName);
          
          // Query for new data structure (authorId)
          const q1 = query(collRef, where('authorId', '==', userId), limit(50));
          // Query for old data structure (author.id)
          const q2 = query(collRef, where('author.id', '==', userId), limit(50));

          const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);

          const posts1 = snapshot1.docs.map(doc => toUnifiedPost({ ...doc.data(), id: doc.id }, postType, userData));
          const posts2 = snapshot2.docs.map(doc => toUnifiedPost({ ...doc.data(), id: doc.id }, postType, userData));

          // Combine, filter out nulls/undefined, and remove duplicates
          const combined = [...posts1, ...posts2].filter((p): p is UnifiedPost => !!p);
          const uniquePosts = Array.from(new Map(combined.map(p => [p.id, p])).values());
          
          return uniquePosts;
        };

        const posts = await fetchCollection('posts', 'post');
        const simplePosts = await fetchCollection('simple-posts', 'simple-post');
        const simpleTravels = await fetchCollection('simple-travels', 'simple-travel');
        const spots = await fetchCollection('spots', 'spot');

        const allItems = [...posts, ...simplePosts, ...simpleTravels, ...spots];
        allItems.sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt));
        setItems(allItems);

      } catch (err) {
        console.error('Error fetching data:', err);
        setNotFound(true);
      } finally {
        console.log('Finished fetching data.');
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
  {items.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-400">投稿がありません。</p>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
      {items.map((item) => {
        // 'simple-travel'の場合もPostCardを使用するなどの分岐を追加
        if (item.postType === 'spot') {
          return <SpotCard key={item.id} spot={item.originalData as SpotData} />;
        } else {
          return <PostCard key={item.id} post={item} showLikeButton={false} />;
        }
      })}
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

