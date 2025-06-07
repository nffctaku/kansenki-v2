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
import { onAuthStateChanged } from 'firebase/auth';

type Post = {
  id: string;
  imageUrls: string[];
  season: string;
  matches: {
    teamA: string;
    teamB: string;
    competition: string;
    season: string;
    nickname: string;
  }[];
};

export default function MyPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState('');
  const [uid, setUid] = useState('');
  const [xLink, setXLink] = useState('');
  const [noteLink, setNoteLink] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [showXInput, setShowXInput] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);

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

        const q = query(
          collection(db, 'simple-posts'),
          where('uid', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const userPosts: Post[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
        setPosts(userPosts);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (postId: string) => {
  const confirmed = confirm('本当に削除しますか？');
  if (!confirmed) return;
  try {
    await deleteDoc(doc(db, 'simple-posts', postId));
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  } catch {
    alert('削除に失敗しました');
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


  if (loading) return <div className="p-6">読み込み中...</div>;

 return (
  <div className="min-h-screen bg-[#f9f9f9] font-sans">
    <div className="flex justify-between items-center px-4 py-3 border-b bg-white">
      <h1 className="text-lg font-bold">マイページ</h1>
    </div>

    {/* 編集フォーム */}
    <div className="mb-10 p-6 bg-white rounded-xl shadow space-y-5">
      <div>
        <label className="block text-sm font-semibold mb-1">ニックネーム</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full rounded-lg px-4 py-2 bg-gray-100 focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">ユーザーID（@ID）</label>
        <input
          type="text"
          value={userId}
          disabled
          className="w-full bg-gray-100 rounded-lg px-4 py-2 text-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">X</label>
        {!showXInput ? (
          <button
            type="button"
            onClick={() => setShowXInput(true)}
            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
          >
            リンクを設定
          </button>
        ) : (
          <input
            type="url"
            placeholder="https://x.com/..."
            value={xLink}
            onChange={(e) => setXLink(e.target.value)}
            className="w-full rounded-lg px-4 py-2 bg-gray-100"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Note</label>
        {!showNoteInput ? (
          <button
            type="button"
            onClick={() => setShowNoteInput(true)}
            className="text-green-600 hover:underline text-sm flex items-center gap-1"
          >
            リンクを設定
          </button>
        ) : (
          <input
            type="url"
            placeholder="https://note.com/..."
            value={noteLink}
            onChange={(e) => setNoteLink(e.target.value)}
            className="w-full rounded-lg px-4 py-2 bg-gray-100"
          />
        )}
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
      >
        保存する
      </button>

      {message && <p className="text-sm text-green-600">{message}</p>}
    </div>

    {/* あなたの投稿一覧 */}
    <div className="p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold">あなたの投稿</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              {/* 投稿画像 */}
              <img
                src={post.imageUrls?.[0] || '/no-image.png'}
                alt="投稿画像"
                className="w-full aspect-square object-cover"
              />

              {/* 投稿情報 */}
              <div className="p-2 text-sm">
                <p className="font-semibold truncate">
                  {post.matches?.[0]?.nickname || '試合名未入力'}
                </p>
                <p className="text-gray-600 text-xs">
                  {post.matches?.[0]?.teamA} vs {post.matches?.[0]?.teamB}
                </p>
                <a
                  href={`/posts/${post.id}`}
                  className="text-xs text-blue-600 underline mt-1 inline-block"
                >
                  投稿を表示
                </a>
              </div>

              {/* ✅ 削除ボタン（カードの下） */}
              <div className="px-2 pb-3">
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-xs text-red-600 border border-red-300 px-3 py-1 rounded hover:bg-red-50 transition"
                >
                  この投稿を削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => router.push('/')}
          className="text-sm text-blue-600 hover:underline"
        >
          トップページに戻る
        </button>
      </div>
    </div>
  </div>
);
}
