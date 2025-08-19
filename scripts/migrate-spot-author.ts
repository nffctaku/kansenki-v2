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

async function migrateSpotAuthorNickname() {
  console.log('Starting spot author migration...');
  const spotsRef = db.collection('spots');
  // 'nickname'フィールドが存在するドキュメントをすべて取得
  const snapshot = await spotsRef.where('nickname', '!=', null).get();

  if (snapshot.empty) {
    console.log('No spots with "nickname" field found to migrate.');
    return;
  }

  console.log(`Found ${snapshot.docs.length} spots to check for migration.`);

  const batch = db.batch();
  let migratedCount = 0;

  snapshot.docs.forEach(doc => {
    const spotData = doc.data();
    // authorNicknameがまだ存在しないドキュメントのみを対象とする
    if (spotData.nickname && !spotData.authorNickname) {
      console.log(`  > Scheduling migration for spot ${doc.id}...`);
      batch.update(doc.ref, {
        authorNickname: spotData.nickname, // 新しいフィールドを追加
        nickname: admin.firestore.FieldValue.delete() // 古いフィールドを削除
      });
      migratedCount++;
    }
  });

  if (migratedCount === 0) {
      console.log('No spots required migration (all relevant spots already have an authorNickname).');
      return;
  }

  console.log(`Attempting to migrate ${migratedCount} spots...`);

  try {
    await batch.commit();
    console.log(`Migration finished. Successfully migrated ${migratedCount} spots.`);
  } catch (error) {
    console.error('An error occurred during the batch commit:', error);
  }
}

migrateSpotAuthorNickname().catch((error) => {
  console.error('An unexpected error occurred:', error);
});
