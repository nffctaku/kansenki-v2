import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { UnifiedPost, toUnifiedPost } from '../types/post';
import { UserProfile } from '../types/user';

export const useUserPosts = (user: User | null, currentUserProfile: UserProfile | null) => {
  const [userPosts, setUserPosts] = useState<UnifiedPost[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<UnifiedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authorProfiles, setAuthorProfiles] = useState<Map<string, { nickname: string; photoURL: string; }>>(new Map());

  const getMillis = (date: Date | Timestamp | null): number => {
    if (!date) return 0;
    if (date instanceof Timestamp) {
      return date.toMillis();
    }
    return date.getTime();
  };

  const toUnifiedPostCallback = useCallback((item: any, type: string, profiles: Map<string, { nickname: string; photoURL: string; }>): UnifiedPost | null => {
    if (!currentUserProfile || !user) return null;
    return toUnifiedPost(item, type, user, currentUserProfile, profiles);
  }, [user, currentUserProfile]);

  const processPosts = useCallback(async () => {
    if (!user || !currentUserProfile) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 1. Fetch all raw post and bookmark data
      const rawPosts: { id: string; data: any; type: string }[] = [];
      const postCollections = ['posts', 'simple-posts', 'simple-travels', 'spots'];
      for (const collectionName of postCollections) {
        const q = query(collection(db, collectionName), where('authorId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.forEach(doc => {
          rawPosts.push({ id: doc.id, data: doc.data(), type: collectionName });
        });
      }

      const bookmarkedPostInfo: { data: any; type: string }[] = [];
      if (currentUserProfile.bookmarks && currentUserProfile.bookmarks.length > 0) {
        const bookmarkPromises = currentUserProfile.bookmarks.map(async (bookmark) => {
          const { collectionName, postId } = bookmark;
          const postDocRef = doc(db, collectionName, postId);
          const postDocSnap = await getDoc(postDocRef);
          if (postDocSnap.exists()) {
            return { data: { id: postDocSnap.id, ...postDocSnap.data() }, type: collectionName };
          }
          return null;
        });
        const results = await Promise.all(bookmarkPromises);
        bookmarkedPostInfo.push(...results.filter((p): p is { data: any; type: string } => p !== null));
      }

      const allRawData: (any & { id: string; type: string })[] = [
        ...rawPosts.map(p => ({ ...p.data, id: p.id, type: p.type })),
        ...bookmarkedPostInfo.map(p => ({ ...p.data, type: p.type }))
      ];

      // 2. Collect all author IDs
      const authorIds = [...new Set(allRawData.map(p => p.authorId).filter(Boolean))];

      // 3. Fetch missing author profiles
      const newProfiles = new Map<string, { nickname: string; photoURL: string; }>();
      const profilesToFetch = authorIds.filter(id => !authorProfiles.has(id));

      if (profilesToFetch.length > 0) {
        const profilePromises = profilesToFetch.map(async (authorId) => {
          const profileDocRef = doc(db, 'users', authorId);
          const profileDocSnap = await getDoc(profileDocRef);
          if (profileDocSnap.exists()) {
            const profileData = profileDocSnap.data();
            return { id: authorId, profile: { nickname: profileData.nickname || '名無し', photoURL: profileData.avatarUrl || '/default-avatar.svg' } };
          }
          return null;
        });
        const profileResults = await Promise.all(profilePromises);
        profileResults.forEach(result => {
          if (result) {
            newProfiles.set(result.id, result.profile);
          }
        });
      }

      const updatedProfiles = new Map([...authorProfiles, ...newProfiles]);
      if (newProfiles.size > 0) {
        setAuthorProfiles(updatedProfiles);
      }
      
      // 4. Unify all posts with complete profiles
      const allUnifiedPosts = allRawData.map(p => toUnifiedPostCallback(p, p.type, updatedProfiles))
        .filter((p): p is UnifiedPost => p !== null);

      // Separate user posts and bookmarked posts
      const userPostsData = allUnifiedPosts.filter(p => p.authorId === user.uid);
      const bookmarkedPostsData = allUnifiedPosts.filter(p => currentUserProfile.bookmarks?.some(b => b.postId === p.id));

      userPostsData.sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt));
      bookmarkedPostsData.sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt));

      setUserPosts(userPostsData);
      setBookmarkedPosts(bookmarkedPostsData);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      setError('投稿の読み込み中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  }, [user, currentUserProfile, authorProfiles, toUnifiedPostCallback]);

  useEffect(() => {
    processPosts();
  }, [processPosts]);

  const handleDelete = async (postId: string, collectionName: string) => {
    try {
      await deleteDoc(doc(db, collectionName, postId));
      setUserPosts(prev => prev.filter(p => p.id !== postId));
      setBookmarkedPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      console.error(`Error deleting post ${postId} from ${collectionName}:`, error);
    }
  };

  return { userPosts, bookmarkedPosts, loading, error, handleDelete, refetch: processPosts };
};
