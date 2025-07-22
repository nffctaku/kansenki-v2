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

  // リダイレクト結果の処理（直接的なアプローチ）
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        console.log('🔄 リダイレクト結果を確認中...');
        
        // セッション状態の確認
        const redirectInitiated = sessionStorage.getItem('firebase_redirect_initiated');
        console.log('🔍 リダイレクト状態:', redirectInitiated);
        
        if (!redirectInitiated) {
          console.log('ℹ️ 通常のページロード - リダイレクト処理をスキップ');
          setIsLoggingIn(false);
          return;
        }
        
        // Googleリダイレクトから戻ってきた場合の処理
        console.log('🚀 Googleリダイレクトから復帰 - 認証結果を確認中...');
        
        // URLパラメータでGoogle認証の成功を確認
        const urlParams = new URLSearchParams(window.location.search);
        const hasAuthCode = urlParams.has('code') || urlParams.has('state');
        console.log('🔍 URL認証パラメータ:', { hasAuthCode, search: window.location.search });
        
        // Firebase Auth状態の確認（複数回試行）
        let authResult = null;
        let attempts = 0;
        const maxAttempts = 5;
        
        while (!authResult && attempts < maxAttempts) {
          attempts++;
          console.log(`🔍 認証状態確認 (${attempts}/${maxAttempts})...`);
          
          // getRedirectResultの確認
          authResult = await getRedirectResult(auth);
          
          if (authResult?.user) {
            console.log('✅ getRedirectResultで認証成功!');
            break;
          }
          
          // currentUserの確認
          if (auth.currentUser) {
            console.log('✅ currentUserで認証済みユーザー検出!');
            authResult = { user: auth.currentUser };
            break;
          }
          
          // 500ms待機してから再試行
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        // 認証結果の処理
        if (authResult?.user) {
          console.log('✅ 認証成功!', {
            displayName: authResult.user.displayName,
            email: authResult.user.email,
            uid: authResult.user.uid
          });
          
          // プロフィール作成とリダイレクト
          await createUserProfile(authResult.user);
          sessionStorage.removeItem('firebase_redirect_initiated');
          
          console.log('✅ プロフィール作成完了 - マイページに遷移中...');
          router.push('/mypage');
          return;
        }
        
        // 認証失敗の場合
        console.log('❌ 認証結果を取得できませんでした');
        console.log('🔍 詳細情報:', {
          hasAuthCode,
          currentUser: auth.currentUser,
          authDomain: auth.config.authDomain,
          currentDomain: window.location.hostname
        });
        
        // エラーメッセージを表示
        setError('認証に失敗しました。ページを再読み込みして再試行してください。');
        sessionStorage.removeItem('firebase_redirect_initiated');
        setIsLoggingIn(false);
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

    // 常にリダイレクト結果をチェック（モバイル・デスクトップ共通）
    console.log('🚀 ログインページ初期化 - リダイレクト結果処理を開始');
    handleRedirectResult();
  }, [router]);

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
    console.log('🚀 ログインボタンクリック検出');
    console.log('🔍 現在の状態:', {
      isLoggingIn,
      isMobile,
      currentURL: window.location.href,
      authInitialized: !!auth,
      providerInitialized: !!provider
    });
    
    if (isLoggingIn) {
      console.log('⚠️ ログイン処理中のためスキップ');
      return;
    }
    
    setIsLoggingIn(true);
    setError(null);
    
    try {
      console.log('🔍 Firebase Auth状態確認:', {
        authDomain: auth.config.authDomain,
        currentDomain: window.location.hostname,
        protocol: window.location.protocol
      });
      
      // モバイルでもポップアップ認証を使用（リダイレクトの問題を回避）
      console.log('🚀 ポップアップ認証を開始 (モバイル/デスクトップ統一)');
      
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log('✅ ポップアップ認証成功:', user.displayName);

        if (user) {
          await createUserProfile(user);
          console.log('✅ プロフィール作成完了 - マイページに遷移中...');
          router.push('/mypage');
        }
        
        setIsLoggingIn(false);
      } catch (popupError: any) {
        console.error('❌ ポップアップ認証エラー:', {
          code: popupError.code,
          message: popupError.message,
          stack: popupError.stack
        });
        throw popupError;
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