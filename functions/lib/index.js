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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostStats = void 0;
const logger = __importStar(require("firebase-functions/logger"));
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const cors = __importStar(require("cors"));
admin.initializeApp();
const db = admin.firestore();
const corsHandler = cors({ origin: true });
exports.getPostStats = (0, https_1.onRequest)((request, response) => {
    corsHandler(request, response, async () => {
        try {
            logger.info("getPostStats function called", { structuredData: true });
            const postsSnapshot = await db.collection("posts").get();
            const simplePostsSnapshot = await db.collection("simple-posts").get();
            const simpleTravelsSnapshot = await db.collection("simple-travels").get();
            const spotsSnapshot = await db.collection("spots").get();
            const totalPosts = postsSnapshot.size + simplePostsSnapshot.size + simpleTravelsSnapshot.size + spotsSnapshot.size;
            logger.info(`Stats calculated: Total posts = ${totalPosts}`);
            response.json({
                totalPosts: totalPosts,
            });
        }
        catch (error) {
            logger.error("Error in getPostStats:", error);
            response.status(500).send("Unable to fetch post stats.");
        }
    });
});
//# sourceMappingURL=index.js.map