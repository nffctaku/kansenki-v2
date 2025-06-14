'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // 編集フィールド用ステート
  const [competition, setCompetition] = useState('');
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [nickname, setNickname] = useState('');
  const [season, setSeason] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const docRef = doc(db, 'simple-posts', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCompetition(data.matches?.[0]?.competition || '');
        setTeamA(data.matches?.[0]?.teamA || '');
        setTeamB(data.matches?.[0]?.teamB || '');
        setNickname(data.matches?.[0]?.nickname || '');
        setSeason(data.season || '');
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;

    try {
      const docRef = doc(db, 'simple-posts', id as string);
      await updateDoc(docRef, {
        season,
        matches: [
          {
            competition,
            teamA,
            teamB,
            nickname,
            season,
          },
        ],
      });
      alert('更新しました');
      router.push('/mypage');
    } catch (err) {
      console.error('更新エラー:', err);
      alert('更新に失敗しました');
    }
  };

  if (loading) return <div className="p-4">読み込み中...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-lg font-bold mb-4">投稿を編集</h1>

      <label className="block mb-2 text-sm font-semibold">大会名</label>
      <input
        className="w-full mb-4 p-2 border rounded"
        value={competition}
        onChange={(e) => setCompetition(e.target.value)}
      />

      <label className="block mb-2 text-sm font-semibold">チームA</label>
      <input
        className="w-full mb-4 p-2 border rounded"
        value={teamA}
        onChange={(e) => setTeamA(e.target.value)}
      />

      <label className="block mb-2 text-sm font-semibold">チームB</label>
      <input
        className="w-full mb-4 p-2 border rounded"
        value={teamB}
        onChange={(e) => setTeamB(e.target.value)}
      />

      <label className="block mb-2 text-sm font-semibold">投稿タイトル（ニックネーム）</label>
      <input
        className="w-full mb-4 p-2 border rounded"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      <label className="block mb-2 text-sm font-semibold">シーズン</label>
      <input
        className="w-full mb-4 p-2 border rounded"
        value={season}
        onChange={(e) => setSeason(e.target.value)}
      />

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        保存してマイページへ戻る
      </button>
    </div>
  );
}
