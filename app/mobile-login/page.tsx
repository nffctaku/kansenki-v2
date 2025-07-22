'use client';

import { useRouter } from 'next/navigation';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, provider, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function MobileLoginPage() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  useTheme();

  // デバッグログを追加する関数
  const addDebugLog = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Firebase設定の診断
  useEffect(() => {
    addDebugLog('🔧 Firebase設定診断開始');
    addDebugLog(`🔍 Auth Domain: ${auth.config.authDomain}`);
    addDebugLog(`🔍 Project ID: ${auth.config.projectId}`);
    addDebugLog(`🔍 現在のドメイン: ${window.location.hostname}`);
    addDebugLog(`🔍 現在のプロトコル: ${window.location.protocol}`);
  }, []);

  // リダイレクト結果の処理（モバイル専用）
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        addDebugLog('📱 モバイル専用ページ - リダイレクト結果を確認中...');
        addDebugLog(`🔍 現在のURL: ${window.location.href}`);
        addDebugLog(`🔍 URLパラメータ: ${window.location.search}`);
        addDebugLog(`🔍 URL Hash: ${window.location.hash}`);
        addDebugLog(`🔍 Referrer: ${document.referrer}`);
        
        // URLパラメータの詳細解析
        const urlParams = new URLSearchParams(window.location.search);
        const urlHash = window.location.hash;
        addDebugLog(`🔍 URL解析: パラメータ数=${urlParams.toString().length}, ハッシュ=${urlHash}`);
        
        // Firebase Auth状態の確認
        addDebugLog(`🔍 Auth currentUser: ${auth.currentUser ? 'ログイン済み' : 'ログインなし'}`);
        
        // リダイレクト結果取得前の待機
        addDebugLog('⏳ getRedirectResult実行中...');
        const result = await getRedirectResult(auth);
        addDebugLog(`🔍 getRedirectResult結果: ${result ? 'ユーザー情報あり' : 'なし'}`);
        
        if (result?.user) {
          addDebugLog(`✅ リダイレクト認証成功: ${result.user.displayName || result.user.email}`);
          addDebugLog(`🔍 ユーザーUID: ${result.user.uid}`);
          
          setIsLoggingIn(true);
          await createUserProfile(result.user);
          addDebugLog('✅ プロフィール作成完了、マイページに遷移中...');
          
          // 少し待ってからリダイレクト
          setTimeout(() => {
            addDebugLog('🚀 マイページにリダイレクト実行');
            router.push('/mypage');
          }, 1000);
        } else if (auth.currentUser) {
          addDebugLog('ℹ️ 既存のログインユーザーを検出');
          addDebugLog(`🔍 既存ユーザー: ${auth.currentUser.displayName || auth.currentUser.email}`);
          router.push('/mypage');
        } else {
          addDebugLog('ℹ️ リダイレクト結果なし - 通常のページロード');
          setIsLoggingIn(false);
        }
      } catch (error: any) {
        addDebugLog(`❌ リダイレクト認証エラー: ${error.code || error.message}`);
        addDebugLog(`❌ エラー詳細: ${JSON.stringify(error)}`);
        setError(`認証エラー: ${error.code || error.message}`);
        setIsLoggingIn(false);
      }
    };

    addDebugLog('🚀 モバイル専用ログインページ初期化');
    handleRedirectResult();
  }, [router]);

  // ユーザープロフィール作成関数
  const createUserProfile = async (user: any) => {
    try {
      addDebugLog('👤 ユーザープロフィール作成開始');
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const uniqueId = 'user' + Math.random().toString(36).substring(2, 8);

        await setDoc(userRef, {
          uid: user.uid,
          id: uniqueId,
          nickname: user.displayName || 'no-name',
          photoURL: user.photoURL || '',
          createdAt: new Date(),
        });
        addDebugLog(`✅ Firestore にプロフィール作成: @${uniqueId}`);
      } else {
        addDebugLog('🔁 Firestore プロフィールは既に存在');
      }
    } catch (error: any) {
      addDebugLog(`❌ プロフィール作成エラー: ${error.message}`);
      throw error;
    }
  };

  const handleLogin = async () => {
    if (isLoggingIn) return;
    
    setIsLoggingIn(true);
    setError(null);
    addDebugLog('🔐 モバイル専用ログイン開始');
    
    try {
      // 認証前の詳細診断
      addDebugLog('📱 signInWithRedirect実行前の診断');
      addDebugLog(`🔍 認証前URL: ${window.location.href}`);
      addDebugLog(`🔍 User Agent: ${navigator.userAgent}`);
      addDebugLog(`🔍 Provider設定: ${JSON.stringify(provider)}`);
      
      // Firebase Auth設定の確認
      addDebugLog(`🔍 Auth設定確認: authDomain=${auth.config.authDomain}`);
      addDebugLog(`🔍 予想されるリダイレクトURI: ${window.location.origin}/mobile-login`);
      
      // Providerの詳細設定
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      addDebugLog('🔧 Provider設定: prompt=select_account を追加');
      
      await signInWithRedirect(auth, provider);
      addDebugLog('✅ signInWithRedirect実行完了 - Googleにリダイレクト中');
      // この後Googleの認証ページにリダイレクトされる
    } catch (error: any) {
      addDebugLog(`❌ ログインエラー: ${error.code || error.message}`);
      addDebugLog(`❌ エラー詳細: ${JSON.stringify(error)}`);
      
      let errorMessage = 'ログインに失敗しました';
      if (error.code === 'auth/unauthorized-domain') {
        errorMessage = `認証ドメインエラー: ${window.location.hostname} が許可されていません。Firebase Consoleで認証ドメインを確認してください。`;
        addDebugLog(`❌ 認証ドメインエラー詳細: 現在のドメイン ${window.location.hostname} がFirebase認証ドメインリストに含まれていません`);
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'ネットワークエラーが発生しました。接続を確認してください。';
      }
      
      setError(errorMessage);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-sm text-center">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2 dark:text-white">📱 モバイルログイン</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">モバイル専用ページ</p>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">Googleアカウントでログインしてください</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-md text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 py-3 px-4 hover:shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image
            src="/google-icon.svg"
            alt="Google ロゴ"
            width={18}
            height={18}
          />
          <span className="text-sm text-[#3c4043] dark:text-gray-200 font-medium">
            {isLoggingIn ? 'リダイレクト中...' : 'Googleでログイン'}
          </span>
        </button>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>🔄 リダイレクト方式専用</p>
        </div>

        {error && (
          <button
            onClick={() => {
              setError(null);
              setIsLoggingIn(false);
              setDebugInfo([]);
            }}
            className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            再試行
          </button>
        )}

        {/* デバッグ情報表示 */}
        {debugInfo.length > 0 && (
          <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-left">
            <h3 className="text-xs font-semibold mb-2 dark:text-white">デバッグログ:</h3>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              {debugInfo.map((log, index) => (
                <div key={index} className="font-mono text-xs break-all">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={() => router.push('/login')}
            className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
          >
            通常のログインページに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
