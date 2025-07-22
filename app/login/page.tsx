'use client';

import { useRouter } from 'next/navigation';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, provider, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useTheme();

  // デバイス検出（精度向上）
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = [
        'mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone',
        'webos', 'opera mini', 'iemobile', 'wpdesktop'
      ];
      
      // より厳密なモバイル検出
      const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      const isMobileDevice = isMobileUA || (isTouchDevice && isSmallScreen);
      
      console.log('🔍 デバイス検出詳細:', {
        userAgent: userAgent,
        isMobileUA,
        isTouchDevice,
        isSmallScreen,
        screenWidth: window.innerWidth,
        final: isMobileDevice ? 'モバイル' : 'デスクトップ'
      });
      
      return isMobileDevice;
    };
    setIsMobile(checkMobile());
  }, []);

  // リダイレクト結果の処理（モバイル用）
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        console.log('🔄 リダイレクト結果を確認中...');
        console.log('🔍 現在のURL:', window.location.href);
        console.log('🔍 URLパラメータ:', window.location.search);
        
        const result = await getRedirectResult(auth);
        console.log('🔍 getRedirectResult結果:', result);
        
        if (result?.user) {
          console.log('✅ リダイレクト認証成功:', {
            displayName: result.user.displayName,
            email: result.user.email,
            uid: result.user.uid
          });
          
          setIsLoggingIn(true); // ローディング状態を設定
          await createUserProfile(result.user);
          console.log('✅ プロフィール作成完了、マイページに遷移中...');
          router.push('/mypage');
        } else {
          console.log('ℹ️ リダイレクト結果なし - 通常のページロード');
          setIsLoggingIn(false);
        }
      } catch (error: any) {
        console.error('❌ リダイレクト認証エラー:', {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
        setError(`認証エラー: ${error.code || error.message}`);
        setIsLoggingIn(false);
      }
    };

    // モバイルの場合のみリダイレクト結果を処理
    if (isMobile) {
      console.log('📱 モバイルデバイス - リダイレクト結果処理を開始');
      handleRedirectResult();
    } else {
      console.log('💻 デスクトップデバイス - リダイレクト結果処理をスキップ');
    }
  }, [isMobile, router]);

  // ユーザープロフィール作成関数
  const createUserProfile = async (user: any) => {
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
  };

  const handleLogin = async () => {
    if (isLoggingIn) return;
    
    setIsLoggingIn(true);
    setError(null);
    
    try {
      if (isMobile) {
        // モバイル：リダイレクト方式（Cross-Origin-Opener-Policy対策）
        console.log('📱 モバイルデバイス検出 - リダイレクト認証を開始');
        console.log('🚫 ポップアップを回避してリダイレクト方式を使用');
        console.log('🔍 認証前URL:', window.location.href);
        
        try {
          await signInWithRedirect(auth, provider);
          console.log('✅ signInWithRedirect実行完了');
          // この時点でページがリダイレクトされるため、以下のコードは実行されない
        } catch (redirectError) {
          console.error('❌ signInWithRedirectエラー:', redirectError);
          throw redirectError;
        }
        
        // リダイレクト後の処理はuseEffectで行う
        return; // 早期リターンでポップアップ処理を完全に回避
      } else {
        // デスクトップ：ポップアップ方式
        console.log('💻 デスクトップデバイス - ポップアップ認証を開始');
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        if (user) {
          await createUserProfile(user);
          console.log('✅ ポップアップ認証成功:', user.displayName);
          router.push('/mypage');
        }
        setIsLoggingIn(false);
      }
    } catch (error: any) {
      console.error('❌ ログインエラー:', error);
      
      let errorMessage = 'ログインに失敗しました';
      if (error.code === 'auth/popup-blocked') {
        errorMessage = 'ポップアップがブロックされました。ブラウザの設定でポップアップを許可してください。';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'ログインがキャンセルされました。';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = '認証ドメインが許可されていません。管理者にお問い合わせください。';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'ネットワークエラーが発生しました。接続を確認してください。';
      } else if (error.message && error.message.includes('Cross-Origin-Opener-Policy')) {
        errorMessage = 'ブラウザのセキュリティポリシーによりログインできません。リダイレクト方式を使用してください。';
      }
      
      setError(errorMessage);
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
            {isLoggingIn ? (isMobile ? 'リダイレクト中...' : 'ログイン中...') : 'Googleでログイン'}
          </span>
        </button>

        {isMobile && (
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            📱 モバイル用リダイレクト認証
          </p>
        )}

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