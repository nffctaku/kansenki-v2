'use client';

import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // 一意なID（ハンドル）を自動生成
          const uniqueId = 'user' + Math.random().toString(36).substring(2, 8);

          await setDoc(userRef, {
            uid: user.uid,
            id: uniqueId, // ← 公開ID（@◯◯）
            nickname: user.displayName || 'no-name', // ← 表示名（後で変更可能）
            photoURL: user.photoURL || '',
            createdAt: new Date(),
          });
          console.log(`✅ Firestore にプロフィール作成: @${uniqueId}`);
        } else {
          console.log('🔁 Firestore プロフィールは既に存在');
        }

        console.log('✅ ログイン成功:', user.displayName);
        router.push('/mypage');
      }
    } catch (error) {
      console.error('❌ ログインエラー:', error);
      alert('ログインに失敗しました');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-4">ログイン</h1>
        <p className="text-gray-600 mb-6">Googleアカウントでログインしてください</p>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md bg-white py-2 px-4 hover:shadow-sm transition"
        >
          <Image
            src="/google-icon.svg"
            alt="Google ロゴ"
            width={18}
            height={18}
          />
          <span className="text-sm text-[#3c4043] font-medium">Googleでログイン</span>
        </button>
      </div>
    </div>
  );
}
