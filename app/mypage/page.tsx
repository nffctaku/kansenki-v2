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
  const [showXInput, setShowXInput] = useState(true); // ← true にする
const [showNoteInput, setShowNoteInput] = useState(true); // ← true にする


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
      {/* ニックネーム */}
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold">ニックネーム</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-2/3 text-right rounded-lg px-3 py-1 bg-gray-100 focus:outline-none border-none"
        />
      </div>

      {/* ユーザーID */}
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold">ユーザーID（@ID）</label>
        <input
          type="text"
          value={userId}
          disabled
          className="w-2/3 text-right bg-gray-100 rounded-lg px-3 py-1 text-gray-500 border-none"
        />
      </div>

      {/* Xリンク */}
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold">X</label>
        {showXInput ? (
          <input
            type="url"
            placeholder="https://x.com/..."
            value={xLink}
            onChange={(e) => setXLink(e.target.value)}
            className="w-2/3 text-right rounded-lg px-3 py-1 bg-gray-100 border-none"
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
        <label className="text-sm font-semibold">Note</label>
        {showNoteInput ? (
          <input
            type="url"
            placeholder="https://note.com/..."
            value={noteLink}
            onChange={(e) => setNoteLink(e.target.value)}
            className="w-2/3 text-right rounded-lg px-3 py-1 bg-gray-100 border-none"
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

      {/* 保存ボタン */}
      <div className="text-right">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          保存する
        </button>
      </div>

      {message && <p className="text-sm text-green-600">{message}</p>}
    </div>

    {/* あなたの投稿一覧 */}
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">あなたの投稿</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              <a href={`/posts/${post.id}`}>
                <img
                  src={post.imageUrls?.[0] || '/no-image.png'}
                  alt="観戦画像"
                  className="w-full aspect-square object-cover hover:opacity-90 transition"
                />
              </a>

              <div className="p-4 text-sm flex-grow leading-[1.1] space-y-[2px]">
                <p className="text-[12px] text-gray-400 leading-[1.1] m-0">
                  {post.season || 'シーズン未設定'}
                </p>
                <p className="text-[13px] font-bold leading-[1.1] m-0">
                  {post.matches?.[0]?.competition || '大会名未入力'}
                </p>
                <p className="text-[13px] text-gray-800 leading-[1.1] m-0">
                  {post.matches?.[0]?.teamA || 'チームA'} vs {post.matches?.[0]?.teamB || 'チームB'}
                </p>
              </div>

              <div className="flex justify-between items-center px-4 pb-4">
                <a
                  href={`/edit/${post.id}`}
                  className="flex items-center gap-[4px] text-green-600 text-[12px] hover:underline"
                >
                  <img
                    src="/えんぴつのアイコン素材.png"
                    alt="編集"
                    className="w-[10px] h-[10px] object-contain"
                  />
                  編集
                </a>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="flex items-center gap-[4px] text-red-600 text-[12px] hover:underline"
                >
                  <img
                    src="/ゴミ箱の無料アイコン.png"
                    alt="削除"
                    className="w-[10px] h-[10px] object-contain"
                  />
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
}