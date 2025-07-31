import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import {onCall, HttpsError} from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

export const getPostStats = onCall({cors: true}, async (request) => {
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
