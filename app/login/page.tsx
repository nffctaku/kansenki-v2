'use client';

import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const provider = new GoogleAuthProvider();
  useTheme();


  // ユーザープロフィール作成関数
  const createUserProfile = async (user: any) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newUserProfile = {
        nickname: user.displayName || '名無しさん',
        avatarUrl: user.photoURL || '/default-avatar.png',
        bio: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(userRef, newUserProfile);
      console.log(`✅ Firestore にプロフィール作成`);
    } else {
      console.log('🔁 Firestore プロフィールは既に存在');
    }
  };

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('✅ ポップアップ認証成功:', user.displayName);

      if (user) {
        await createUserProfile(user);
        router.push('/mypage');
      }
    } catch (error: any) {
      console.error('❌ ログインエラー:', error);
      let errorMessage = 'ログインに失敗しました。';
      if (error.code === 'auth/popup-blocked') {
        errorMessage = 'ポップアップがブロックされました。ブラウザの設定でポップアップを許可してください。';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'ログインがキャンセルされました。';
      }
      setError(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">ログイン</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Googleアカウントでログインしてください</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-md text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 py-2 px-4 hover:shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image
            src="/google-icon.svg"
            alt="Google ロゴ"
            width={18}
            height={18}
          />
          <span className="text-sm text-[#3c4043] dark:text-gray-200 font-medium">
            {isLoggingIn ? 'ログイン中...' : 'Googleでログイン'}
          </span>
        </button>

        {error && (
          <button
            onClick={() => {
              setError(null);
              setIsLoggingIn(false);
            }}
            className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            再試行
          </button>
        )}
      </div>
    </div>
  );
}
