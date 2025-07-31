import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import {onCall, HttpsError} from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

export const getPostStats = onCall({
  cors: [
    'http://localhost:3000',
    'http://localhost:3007',
    /footballtop-a4271\.web\.app$/,
    /footballtop-a4271\.firebaseapp\.com$/,
  ],
}, async (request) => {
  try {
    logger.info("getPostStats function called", {structuredData: true});

    const postsSnapshot = await db.collection("posts").get();
    const simplePostsSnapshot = await db.collection("simple-posts").get();

    const totalPosts = postsSnapshot.size + simplePostsSnapshot.size;

    logger.info(`Stats calculated: Total posts = ${totalPosts}`);

    return {
      totalPosts: totalPosts,
    };
  } catch (error) {
    logger.error("Error in getPostStats:", error);
    throw new HttpsError("internal", "Unable to fetch post stats.");
  }
});
