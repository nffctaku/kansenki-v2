import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// 即座に永続化設定を適用（ブラウザ環境でのみ）
if (typeof window !== 'undefined') {
  console.log('🚀 Firebase Auth永続化設定を即座に適用開始');
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('✅ Firebase Auth永続化設定が正常に完了しました');
      const keys = Object.keys(localStorage).filter(k => k.includes('firebase'));
      console.log('🔍 設定後のLocalStorageキー数:', keys.length);
    })
    .catch((error) => {
      console.error('❌ Firebase Auth永続化設定に失敗:', error);
    });
}

// Firebase認証の永続化設定を強制的に実行する関数
export const initializePersistence = async (): Promise<void> => {
  if (typeof window === 'undefined') {
    console.log('🚫 サーバーサイドのため永続化設定をスキップ');
    return;
  }
  
  try {
    console.log('🔧 Firebase Auth永続化設定を適用中...');
    console.log('🔍 現在のAuth状態:', {
      authInitialized: !!auth,
      currentUser: auth.currentUser?.email || 'なし',
      authDomain: auth.config.authDomain
    });
    
    // 永続化設定を強制実行
    await setPersistence(auth, browserLocalPersistence);
    
    // LocalStorageの確認
    const firebaseKeys = Object.keys(localStorage).filter(key => key.includes('firebase'));
    console.log('🔍 永続化設定後のLocalStorage:', { firebaseKeys: firebaseKeys.length });
    
    console.log('✅ Firebase Auth永続化設定完了');
  } catch (error) {
    console.error('❌ Firebase Auth永続化設定エラー:', error);
    console.error('❌ エラー詳細:', {
      code: (error as any).code,
      message: (error as any).message,
      stack: (error as any).stack
    });
    throw error;
  }
};

const provider = new GoogleAuthProvider();
const storage = getStorage(app);


export { db, auth, provider, storage };
