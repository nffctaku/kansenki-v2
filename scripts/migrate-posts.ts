import * as admin from 'firebase-admin';

// ------------------------------------------------------------------
// 注意：このスクリプトを実行する前に、Firebaseプロジェクトから
// 「サービスアカウントキー」をダウンロードし、そのファイルパスを
// 環境変数 GOOGLE_APPLICATION_CREDENTIALS に設定してください。
// ------------------------------------------------------------------

// Firebase Admin SDKの初期化
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error: any) {
  if (error.code !== 'app/duplicate-app') {
    console.error('Firebase Admin SDK initialization error:', error);
    process.exit(1);
  }
}

const db = admin.firestore();

// 新しい「旅のしおり」のデータ構造
interface Travel {
  uid: string;
  author: string;
  title: string;
  isPublic: boolean;
  flights: any[];
  hotels: any[];
  costs: any | null;
  itineraries: any[];
  createdAt: admin.firestore.Timestamp | admin.firestore.FieldValue;
  updatedAt: admin.firestore.FieldValue;
}

// 元の投稿データの構造（推測されるフィールドをオプショナルで定義）
interface Post {
  uid?: string;
  author?: string;
  title?: string;
  isPublic?: boolean;
  travelId?: string;
  cost?: Record<string, number>;
  flights?: any[];
  hotels?: any[];
  itineraries?: any[];
  match?: {
    homeTeam?: string;
    awayTeam?: string;
    date?: string;
  };
  createdAt?: admin.firestore.Timestamp;
}

async function migratePosts() {
  console.log('Starting migration...');
  const postsRef = db.collection('simple-posts');
  const travelsRef = db.collection('simple-travels');
  
  const snapshot = await postsRef.get();

  // travelIdがまだない投稿のみをフィルタリング
  const postsToMigrate = snapshot.docs.filter(doc => !doc.data().travelId);

  if (postsToMigrate.length === 0) {
    console.log('No new posts found to migrate.');
    return;
  }
  
  console.log(`Found ${postsToMigrate.length} posts to migrate.`);

  const defaultUid = 'zKrgbi28IZT0iRmMndRoQs1C98K2';
  const defaultAuthor = 'taku';
  let migratedCount = 0;

  for (const doc of postsToMigrate) {
    const postId = doc.id;
    console.log(`Migrating post ${postId}...`);
    
    try {
      const postData = doc.data() as Post;

      const totalCost = Object.values(postData.cost || {}).reduce((sum, value) => sum + (Number(value) || 0), 0);

      const matchInfo = postData.match ? `${postData.match.homeTeam || ''} vs ${postData.match.awayTeam || ''}` : '試合';
      const matchDate = postData.match?.date || '';
      const defaultTitle = `（移行データ）${matchInfo}観戦 ${matchDate}`.trim();

      const newTravelData: Travel = {
        uid: postData.uid || defaultUid,
        author: postData.author || defaultAuthor,
        title: postData.title || defaultTitle,
        isPublic: postData.isPublic !== undefined ? postData.isPublic : true,
        flights: postData.flights || [],
        hotels: postData.hotels || [],
        costs: postData.cost ? { ...postData.cost, total: totalCost } : null,
        itineraries: postData.itineraries || [],
        createdAt: postData.createdAt || admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // 1. 新しいtravelドキュメントを作成
      const travelRef = await travelsRef.add(newTravelData);
      console.log(`  > Created travel document ${travelRef.id}`);

      // 2. 元のpostドキュメントを更新
      await postsRef.doc(postId).update({
        travelId: travelRef.id,
      });
      console.log(`  > Updated post ${postId} with new travelId.`);

      migratedCount++;
    } catch (error) {
      console.error(`Failed to migrate post ${postId}:`, error);
    }
  }

  console.log(`Migration finished. Successfully migrated ${migratedCount} posts.`);
}

migratePosts().catch((error) => {
  console.error('An unexpected error occurred:', error);
});
