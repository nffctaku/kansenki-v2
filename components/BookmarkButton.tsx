'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

interface BookmarkButtonProps {
  postId: string;
  collectionName: string; // Kept for consistency, not used in new logic
  size?: 'xs' | 'sm' | 'md';
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ postId, size = 'md' }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const checkBookmarkStatus = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const bookmarkRef = doc(db, 'users', user.uid, 'bookmarks', postId);
      const docSnap = await getDoc(bookmarkRef);
      setBookmarked(docSnap.exists());
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    } finally {
      setLoading(false);
    }
  }, [user, postId]);

  useEffect(() => {
    if (user) {
      checkBookmarkStatus();
    } else {
      setBookmarked(false);
    }
  }, [user, checkBookmarkStatus]);

  const handleBookmark = async () => {
    if (!user) {
      alert('保存するにはログインが必要です。');
      return;
    }
    if (loading) return;

    setLoading(true);
    const bookmarkRef = doc(db, 'users', user.uid, 'bookmarks', postId);

    try {
      if (bookmarked) {
        await deleteDoc(bookmarkRef);
        setBookmarked(false);
      } else {
        await setDoc(bookmarkRef, {
          postId: postId,
          createdAt: serverTimestamp(),
        });
        setBookmarked(true);
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const iconStyles = {
    xs: 'text-xs',
    sm: 'text-xl',
    md: 'text-2xl',
  };

  if (loading) {
    return <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>;
  }

  return (
    <button
      onClick={handleBookmark}
      disabled={!user}
      className={`flex items-center justify-center rounded-full transition-colors duration-200 ease-in-out p-2 disabled:opacity-50 disabled:cursor-not-allowed
        ${bookmarked
          ? 'text-yellow-500 hover:bg-yellow-100 dark:hover:bg-gray-800'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`
      }
    >
      {bookmarked ? (
        <FaBookmark className={`${iconStyles[size]}`} />
      ) : (
        <FaRegBookmark className={`${iconStyles[size]}`} />
      )}
    </button>
  );
};

export default BookmarkButton;
