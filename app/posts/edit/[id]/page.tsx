'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);

  // 編集するフィールドのステート
  const [competition, setCompetition] = useState('');
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [nickname, setNickname] = useState('');
  const [season, setSeason] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      const ref = doc(db, 'simple-posts', id as string);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setPost(data);
        const match = data.matches?.[0] || {};
        setCompetition(match.competition || '');
        setTeamA(match.teamA || '');
        setTeamB(match.teamB || '');
        setNickname(match.nickname || '');
        setSeason(data.season || '');
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    const ref = doc(db, 'simple-posts', id as string);
    await updateDoc(ref, {
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
    router.push('/mypage');
  };

  if (loading) return <p className="p-6">読み込み中...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-lg font-bold mb-4">投稿を編集</h1>

      <label className="block text-sm font-semibold mb-1">大会名</label>
      <input
        type="text"
        value={competition}
        onChange={(e) => setCompetition(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block text-sm font-semibold mb-1">チームA</label>
      <input
        type="text"
        value={teamA}
        onChange={(e) => setTeamA(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block text-sm font-semibold mb-1">チームB</label>
      <input
        type="text"
        value={teamB}
        onChange={(e) => setTeamB(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block text-sm font-semibold mb-1">表示名（ニックネーム）</label>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block text-sm font-semibold mb-1">シーズン</label>
      <input
        type="text"
        value={season}
        onChange={(e) => setSeason(e.target.value)}
        className="w-full mb-6 p-2 border rounded"
      />

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        保存する
      </button>
    </div>
  );
}
