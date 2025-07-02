'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { PostFormData } from '@/types/post';

type Post = PostFormData & {
  authorId?: string;
};

export default function MyPage() {
  useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState('');
  const [uid, setUid] = useState('');
  const [xLink, setXLink] = useState('');
  const [noteLink, setNoteLink] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [showXInput, setShowXInput] = useState(true);
  const [showNoteInput, setShowNoteInput] = useState(true);
  const [postCollectionMap, setPostCollectionMap] = useState(new Map<string, string>());


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setNickname(userData.nickname || '');
          setUserId(userData.id || '');
          setXLink(userData.xLink || '');
          setNoteLink(userData.noteLink || '');
        }

        // Fetch new posts from 'posts' collection
        const newPostsQuery = query(collection(db, 'posts'), where('authorId', '==', user.uid));
        const newPostsSnapshot = await getDocs(newPostsQuery);
        const newPostsData = newPostsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            existingImageUrls: (data.imageUrls || []).slice().reverse(),
          } as Post;
        });

        // Fetch old posts from 'simple-posts' collection
        const oldPostsQuery = query(collection(db, 'simple-posts'), where('uid', '==', user.uid));
        const oldPostsSnapshot = await getDocs(oldPostsQuery);
        const oldPostsData = oldPostsSnapshot.docs.map((doc) => {
          const data = doc.data();
          // Normalize old data structure to the new PostFormData structure
          const matchInfo = data.matches && data.matches[0] ? {
            competition: data.matches[0].competition || '',
            season: data.matches[0].season || data.season || '',
            date: data.matches[0].date || '',
            kickoff: data.matches[0].kickoff || '',
            homeTeam: data.matches[0].homeTeam || data.matches[0].teamA || '',
            awayTeam: data.matches[0].awayTeam || data.matches[0].teamB || '',
            homeScore: data.matches[0].homeScore || '',
            awayScore: data.matches[0].awayScore || '',
            stadium: data.matches[0].stadium || '',
            ticketPrice: '',
            ticketPurchaseRoute: '',
            seat: '',
            seatReview: '',
          } : undefined;

          return {
            id: doc.id,
            authorId: data.uid,
            authorNickname: data.nickname || '',
            title: data.title || '',
            isPublic: data.isPublic !== undefined ? data.isPublic : true,
            postType: 'new',
            match: matchInfo,
            existingImageUrls: (data.imageUrls || []).slice().reverse(),
            travelStartDate: data.travelStartDate || '',
            travelEndDate: data.travelEndDate || '',
            visitedCities: data.visitedCities || [],
            transports: data.transports || [],
            imageFiles: [],
            categories: [],
          } as Post;
        });
        
        const tempCollectionMap = new Map<string, string>();
        oldPostsData.forEach(p => p.id && tempCollectionMap.set(p.id, 'simple-posts'));
        newPostsData.forEach(p => p.id && tempCollectionMap.set(p.id, 'posts'));
        setPostCollectionMap(tempCollectionMap);

        // Combine and remove duplicates, preferring new posts over old ones
        const combinedPosts = [...oldPostsData, ...newPostsData];
        const uniquePosts = Array.from(new Map(combinedPosts.map(p => [p.id, p])).values());
        
        setPosts(uniquePosts);

      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (postId: string) => {
    if (window.confirm('本当にこの投稿を削除しますか？')) {
      const collectionName = postCollectionMap.get(postId);
      if (!collectionName) {
        setMessage('エラー: 投稿のコレクションが見つかりません。');
        console.error('Could not find collection for post ID:', postId);
        return;
      }
      try {
        await deleteDoc(doc(db, collectionName, postId));
        setPosts(posts.filter((post) => post.id !== postId));
        setMessage('投稿を削除しました。');
      } catch (error) {
        console.error('削除エラー:', error);
        setMessage('削除中にエラーが発生しました。');
      }
    }
  };

  const handleSave = async () => {
    if (!uid) return;
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        nickname,
        xLink,
        noteLink,
      });
      setMessage('✅ プロフィールを更新しました');
    } catch (err) {
      console.error('❌ 更新エラー:', err);
      setMessage('❌ 更新に失敗しました');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
      alert('ログアウトに失敗しました。');
    }
  };

  if (loading) return <div className="p-6 dark:text-white">読み込み中...</div>;

return (
  <div className="min-h-screen bg-[#f9f9f9] dark:bg-gray-900 font-sans pb-48">
    <div className="flex justify-between items-center px-4 py-3 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <h1 className="text-lg font-bold dark:text-white">マイページ</h1>
    </div>

    {/* 編集フォーム */}
    <div className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow space-y-5">
      {/* ニックネーム */}
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold dark:text-gray-300">ニックネーム</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-2/3 text-right rounded-lg px-3 py-1 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border-none"
        />
      </div>

      {/* ユーザーID */}
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold dark:text-gray-300">ユーザーID（@ID）</label>
        <input
          type="text"
          value={userId}
          disabled
          className="w-2/3 text-right bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1 text-gray-500 dark:text-gray-400 border-none"
        />
      </div>

      {/* Xリンク */}
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold dark:text-gray-300">X</label>
        {showXInput ? (
          <input
            type="url"
            placeholder="https://x.com/..."
            value={xLink}
            onChange={(e) => setXLink(e.target.value)}
            className="w-2/3 text-right rounded-lg px-3 py-1 bg-gray-100 dark:bg-gray-700 dark:text-white border-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowXInput(true)}
            className="text-blue-600 hover:underline text-sm"
          >
            リンクを設定
          </button>
        )}
      </div>

      {/* Noteリンク */}
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold dark:text-gray-300">Note</label>
        {showNoteInput ? (
          <input
            type="url"
            placeholder="https://note.com/..."
            value={noteLink}
            onChange={(e) => setNoteLink(e.target.value)}
            className="w-2/3 text-right rounded-lg px-3 py-1 bg-gray-100 dark:bg-gray-700 dark:text-white border-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowNoteInput(true)}
            className="text-green-600 hover:underline text-sm"
          >
            リンクを設定
          </button>
        )}
      </div>

      {/* ボタン */}
      <div className="text-right space-x-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          保存する
        </button>
        <button
          onClick={handleLogout}
          className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition"
        >
          ログアウト
        </button>
      </div>

      {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
    </div>

    {/* あなたの投稿一覧 */}
<div className="p-4">
  <div className="mb-6">
    <h2 className="text-lg font-bold mb-4 dark:text-white">あなたの投稿</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {posts.filter(p => p.id).map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col"
        >
          <a href={`/posts/${post.id}`}>
            <Image
              src={post.existingImageUrls?.[0] || '/no-image.png'}
              alt="観戦画像"
              width={400}
              height={400}
              className="w-full aspect-square object-cover hover:opacity-90 transition"
            />
          </a>

          <div className="p-4 text-sm flex-grow leading-[1.1] space-y-[2px]">
            <p className="text-[12px] text-gray-400 dark:text-gray-500 leading-[1.1] m-0">
              {post.match?.season || 'シーズン未設定'}
            </p>
            <p className="text-[13px] font-bold dark:text-gray-200 leading-[1.1] m-0">
              {post.match?.competition || '大会名未入力'}
            </p>
            <p className="text-[13px] text-gray-800 dark:text-gray-300 leading-[1.1] m-0">
              {post.match?.homeTeam || 'チームA'} vs {post.match?.awayTeam || 'チームB'}
            </p>
          </div>

          <div className="flex justify-between items-center px-4 pb-4">
            <a
              href={`/edit/${post.id}`}
              className="flex items-center gap-[4px] text-green-600 text-[12px] hover:underline"
            >
              <Image
                src="/えんぴつのアイコン素材.png"
                alt="編集"
                width={10}
                height={10}
                className="w-[10px] h-[10px] object-contain dark:invert"
              />
              編集
            </a>
            <button
              onClick={() => {
              if (post.id) {
                handleDelete(post.id);
              }
            }}
              className="flex items-center gap-[4px] text-red-600 text-[12px] hover:underline"
            >
              <Image
                src="/ゴミ箱の無料アイコン.png"
                alt="削除"
                width={10}
                height={10}
                className="w-[10px] h-[10px] object-contain dark:invert"
              />
               削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

       {/* がっつり余白 */}
    <div className="h-48" />
  </div>
  );
}


