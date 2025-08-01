import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UnifiedPost, toUnifiedPost } from '../types/post';

export const useUserPosts = (user: User | null, currentUserProfile: { nickname: string; avatarUrl: string } | null) => {
  const [combinedItems, setCombinedItems] = useState<UnifiedPost[]>([]);
  const [bookmarkedItems, setBookmarkedItems] = useState<UnifiedPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [authorProfiles, setAuthorProfiles] = useState<Map<string, { nickname: string; photoURL: string }>>(new Map());

  const getMillis = (date: Date | Timestamp | null): number => {
    if (!date) return 0;
    if (date instanceof Timestamp) return date.toMillis();
    return date.getTime();
  };

    const toUnifiedPostCallback = useCallback((item: any, type: string): UnifiedPost | null => {
        if (!currentUserProfile) return null;
    return toUnifiedPost(item, type, user, currentUserProfile, authorProfiles);
  }, [user, currentUserProfile, authorProfiles]);

  const fetchData = useCallback(async () => {
    // ユーザー情報またはプロフィール情報がまだ読み込まれていない場合は、処理を開始しない
        if (!user || !currentUserProfile) {
      setCombinedItems([]);
      setBookmarkedItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const uid = user.uid;

    

    const fetchPosts = async () => {
      const collectionsToQuery = ['posts', 'simple-posts', 'simple-travels', 'spots'];
      const allPosts: UnifiedPost[] = [];
      

      for (const collectionName of collectionsToQuery) {
        const q = query(collection(db, collectionName), where('authorId', '==', uid));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          return toUnifiedPostCallback({ id: doc.id, ...data }, collectionName);
        }).filter((p): p is UnifiedPost => p !== null);
        allPosts.push(...posts);
      }

      allPosts.sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt));
      setCombinedItems(allPosts);
      
    };

    const fetchBookmarkedPosts = async () => {
      const bookmarksRef = collection(db, 'users', uid, 'bookmarks');
      const bookmarksSnap = await getDocs(bookmarksRef);
      const bookmarkedPostInfo: { data: any; type: string }[] = [];
      const authorIdsToFetch = new Set<string>();

      for (const bookmarkDoc of bookmarksSnap.docs) {
        const bookmark = bookmarkDoc.data();
        const postTypes = ['posts', 'simple-posts', 'simple-travels', 'spots'];
        for (const type of postTypes) {
          const postRef = doc(db, type, bookmark.postId);
          const postSnap = await getDoc(postRef);
          if (postSnap.exists()) {
            const postData = { ...postSnap.data(), id: postSnap.id } as any;
            const authorId = postData.author?.id || postData.authorId || postData.userId;
            if (authorId && authorId !== uid) {
              authorIdsToFetch.add(authorId);
            }
            bookmarkedPostInfo.push({ data: postData, type });
                        
            break;
          }
        }
      }

      const newProfiles = new Map<string, { nickname: string; photoURL: string }>();
      for (const authorId of Array.from(authorIdsToFetch)) {
        if (!authorProfiles.has(authorId)) {
          const userDocRef = doc(db, 'users', authorId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            newProfiles.set(authorId, {
              nickname: userData.nickname || '名無し',
              photoURL: userData.photoURL || '/default-avatar.svg',
            });
          }
        }
      }

      if (newProfiles.size > 0) {
        setAuthorProfiles(prev => new Map([...Array.from(prev), ...Array.from(newProfiles)]));
      }

      const unifiedBookmarks = bookmarkedPostInfo
        .map(p => toUnifiedPostCallback(p.data, p.type))
        .filter((p): p is UnifiedPost => p !== null);

      unifiedBookmarks.sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt));
      setBookmarkedItems(unifiedBookmarks);
    };

    try {
      await Promise.all([fetchPosts(), fetchBookmarkedPosts()]);
    } catch (error) {
      console.error("Error fetching user posts and bookmarks:", error);
    } finally {
      setLoading(false);
    }
    }, [user, currentUserProfile, toUnifiedPostCallback]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

      const handleDelete = async (postId: string, collectionName: string) => {
    console.log(`[useUserPosts] handleDelete called with postId: ${postId}, collectionName: ${collectionName}`);
    if (!user) {
      console.error('[useUserPosts] User not found, aborting delete.');
      return;
    }

        if (!collectionName) {
      console.error(`[useUserPosts] Collection name not provided for post: ${postId}`);
      return;
    }

    try {
            console.log(`[useUserPosts] Attempting to delete doc: /${collectionName}/${postId}`);
      await deleteDoc(doc(db, collectionName, postId));
      console.log(`[useUserPosts] Deletion successful. Refetching data...`);
      // 削除後にデータを再取得してUIを更新
      await fetchData();
    } catch (error) {
            console.error('[useUserPosts] Error deleting post:', error);
    }
  };

  return { combinedItems, bookmarkedItems, loading, handleDelete, refetch: fetchData };
};
