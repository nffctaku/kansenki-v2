'use client';

import { useEffect, useState } from 'react';
import { collection, doc, getDoc, query, where, getDocs, limit, Timestamp } from 'firebase/firestore';
import { UnifiedPost, toUnifiedPost } from '@/types/post';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from '@/components/user/UserProfile';
import PostCard from '@/components/PostCard';
import SpotCard, { SpotData } from '@/components/SpotCard';

// NOTE: These interfaces and functions are extracted from the original page
// and should ideally be moved to a centralized types/utils file in the future.

interface UserInfo {
  nickname: string;
  id: string;
  uid: string;
  xLink?: string;
  noteLink?: string;
  youtubeUrl?: string;
  instagramLink?: string;
  photoURL?: string;
  visitedCountries?: string[];
  biography?: string;
  residence?: string;
  travelFrequency?: string;
  overseasMatchCount?: string;
}


interface UserPostsProps {
  userId: string; // This can be a user ID (slug) or the special string "mypage"
}

export default function UserPosts({ userId }: UserPostsProps) {
  const { user } = useAuth();

    const [items, setItems] = useState<UnifiedPost[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setUserInfo(null);
      setItems([]);

      try {
        let userDocId: string | undefined;
        let userDoc: any; // Should be DocumentSnapshot

        if (userId === 'mypage') {
          if (!user) {
            setError('ログインが必要です。');
            setLoading(false);
            return;
          }
          userDocId = user.uid;
          const userRef = doc(db, 'users', userDocId);
          userDoc = await getDoc(userRef);
        } else {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('id', '==', userId), limit(1));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            userDoc = querySnapshot.docs[0];
            userDocId = userDoc.id;
          } else {
            setError('ユーザーが見つかりません。');
            setLoading(false);
            return;
          }
        }

        if (!userDoc?.exists()) {
          setError('ユーザーが見つかりません。');
          setLoading(false);
          return;
        }

        const userData = userDoc.data();
        const fetchedUserInfo: UserInfo = {
          nickname: userData.nickname || '名無し',
          id: userDoc.id,
          uid: userData.uid || userDocId!,
          xLink: userData.socialLinks?.x,
          noteLink: userData.socialLinks?.note,
          youtubeUrl: userData.youtubeUrl,
          instagramLink: userData.instagramLink,
          photoURL: userData.photoURL || '/default-avatar.svg',
          visitedCountries: userData.visitedCountries || [],
          biography: userData.biography || '',
          residence: userData.residence,
          travelFrequency: userData.travelFrequency,
          overseasMatchCount: userData.overseasMatchCount,
        };
        setUserInfo(fetchedUserInfo);

        const fetchCollection = async (collectionName: string, type: 'post' | 'simple-post' | 'spot' | 'simple-travel') => {
          const collRef = collection(db, collectionName);
          const userDocRefForQuery = doc(db, 'users', fetchedUserInfo.id);

          const q1 = query(collRef, where('authorId', '==', fetchedUserInfo.uid), limit(50));
          const q2 = query(collRef, where('author', '==', userDocRefForQuery), limit(50));

          const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

                    const authorProfiles = new Map<string, { nickname: string; photoURL: string; }>();
          if (fetchedUserInfo) {
            authorProfiles.set(fetchedUserInfo.uid, { nickname: fetchedUserInfo.nickname, photoURL: fetchedUserInfo.photoURL || '' });
          }

          const results = [...snap1.docs, ...snap2.docs]
                        .map(d => toUnifiedPost({ id: d.id, ...d.data() }, type, user || null, null, authorProfiles))
            .filter((p): p is UnifiedPost => p !== null);

          return Array.from(new Map(results.map(item => [item.id, item])).values());
        };

        const postPromises = [
          fetchCollection('posts', 'post'),
          fetchCollection('simple-posts', 'simple-post'),
          fetchCollection('spots', 'spot'),
          fetchCollection('simple-travels', 'simple-travel'),
        ];

        const results = await Promise.all(postPromises);
                const combinedItems = results.flat().sort((a, b) => {
          const timeA = a.createdAt ? ('toDate' in a.createdAt ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime()) : 0;
          const timeB = b.createdAt ? ('toDate' in b.createdAt ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime()) : 0;
          return timeB - timeA;
        });

        setItems(combinedItems);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('データの取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, user]);

  if (loading) return <div className="p-6 text-center dark:text-white">読み込み中...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!userInfo) return <div className="p-6 text-center dark:text-white">ユーザー情報を読み込めませんでした。</div>;

  return (
    <div className="max-w-screen-lg mx-auto">
      <UserProfile userInfo={userInfo} postCount={items.length} />
      
      <div className="px-4 pb-10 mt-4 border-t dark:border-gray-700 pt-6">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">投稿一覧</h2>
        {items.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">投稿がありません。</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {items.map((item) => {
              switch (item.postType) {
                case 'post':
                                    return <PostCard key={item.id} post={item} />;
                case 'simple-post':
                                    return <PostCard key={item.id} post={item} />;
                case 'spot':
                  return <SpotCard key={item.id} spot={item.originalData as SpotData} />;
                case 'simple-travel':
                                    return <PostCard key={item.id} post={item} />;
                default:
                  return null;
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}
