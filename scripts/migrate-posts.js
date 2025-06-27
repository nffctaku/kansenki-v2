"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
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
}
catch (error) {
    if (error.code !== 'app/duplicate-app') {
        console.error('Firebase Admin SDK initialization error:', error);
        process.exit(1);
    }
}
const db = admin.firestore();
function migratePosts() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log('Starting migration...');
        const postsRef = db.collection('simple-posts');
        const travelsRef = db.collection('simple-travels');
        const snapshot = yield postsRef.get();
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
                const postData = doc.data();
                const totalCost = Object.values(postData.cost || {}).reduce((sum, value) => sum + (Number(value) || 0), 0);
                const matchInfo = postData.match ? `${postData.match.homeTeam || ''} vs ${postData.match.awayTeam || ''}` : '試合';
                const matchDate = ((_a = postData.match) === null || _a === void 0 ? void 0 : _a.date) || '';
                const defaultTitle = `（移行データ）${matchInfo}観戦 ${matchDate}`.trim();
                const newTravelData = {
                    uid: postData.uid || defaultUid,
                    author: postData.author || defaultAuthor,
                    title: postData.title || defaultTitle,
                    isPublic: postData.isPublic !== undefined ? postData.isPublic : true,
                    flights: postData.flights || [],
                    hotels: postData.hotels || [],
                    costs: postData.cost ? Object.assign(Object.assign({}, postData.cost), { total: totalCost }) : null,
                    itineraries: postData.itineraries || [],
                    createdAt: postData.createdAt || admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                };
                // 1. 新しいtravelドキュメントを作成
                const travelRef = yield travelsRef.add(newTravelData);
                console.log(`  > Created travel document ${travelRef.id}`);
                // 2. 元のpostドキュメントを更新
                yield postsRef.doc(postId).update({
                    travelId: travelRef.id,
                });
                console.log(`  > Updated post ${postId} with new travelId.`);
                migratedCount++;
            }
            catch (error) {
                console.error(`Failed to migrate post ${postId}:`, error);
            }
        }
        console.log(`Migration finished. Successfully migrated ${migratedCount} posts.`);
    });
}
migratePosts().catch((error) => {
    console.error('An unexpected error occurred:', error);
});
