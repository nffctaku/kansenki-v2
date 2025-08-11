'use client';

import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '@/lib/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { doc, getDoc, runTransaction } from 'firebase/firestore';

interface BookmarkButtonProps {
  postId: string;
  collectionName: string;
  size?: 'xs' | 'sm' | 'md';
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ postId, collectionName, size = 'md' }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const getBookmarkCount = useCallback(async () => {
    const postRef = doc(db, collectionName, postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      setBookmarkCount(postSnap.data().bookmarkCount || 0);
    }
  }, [postId, collectionName]);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      setLoading(true);
      await getBookmarkCount();
      if (user) {
        const bookmarkRef = doc(db, collectionName, postId, 'bookmarks', user.uid);
        const bookmarkSnap = await getDoc(bookmarkRef);
        setBookmarked(bookmarkSnap.exists());
      } else {
        setBookmarked(false);
      }
      setLoading(false);
    };

    if (postId) {
      checkBookmarkStatus();
    }
  }, [postId, user, getBookmarkCount, collectionName]);

  const handleBookmark = async () => {
    if (!user) {
      alert('ブックマークするにはログインが必要です。');
      return;
    }
    if (loading) return;

    setLoading(true);

    const postRef = doc(db, collectionName, postId);
    const postBookmarkRef = doc(db, collectionName, postId, 'bookmarks', user.uid);
    const userBookmarkRef = doc(db, 'users', user.uid, 'bookmarks', postId);

    try {
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) {
          throw new Error('Post does not exist!');
        }

        const currentBookmarkCount = postDoc.data().bookmarkCount || 0;

        if (bookmarked) {
          // Un-bookmark
          transaction.update(postRef, { bookmarkCount: Math.max(0, currentBookmarkCount - 1) });
          transaction.delete(postBookmarkRef);
          transaction.delete(userBookmarkRef);
        } else {
          // Bookmark
          transaction.update(postRef, { bookmarkCount: currentBookmarkCount + 1 });
          transaction.set(postBookmarkRef, { createdAt: new Date() });
          transaction.set(userBookmarkRef, { createdAt: new Date(), collection: collectionName, postId: postId });
        }
      });

      setBookmarked(!bookmarked);
      await getBookmarkCount();
    } catch (error) {
      console.error('Error processing bookmark: ', error);
      alert('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const sizeStyles = {
    xs: 'px-1.5 py-0 text-[9px] leading-tight',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-4 py-2 text-base',
  };

  const iconStyles = {
    xs: 'text-xs',
    sm: 'text-xl',
    md: 'text-2xl',
  };

  const gapStyles = {
    xs: 'gap-px',
    sm: 'gap-1',
    md: 'gap-1',
  };

  const loadingStyles = {
    xs: 'h-4 w-9',
    sm: 'h-7 w-14',
    md: 'h-10 w-20',
  };

  if (loading) {
    return <div className={`bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse ${loadingStyles[size]}`}></div>;
  }

  return (
    <button
      onClick={handleBookmark}
      disabled={loading || !user}
      className={`flex items-center justify-center ${gapStyles[size]} rounded-full transition-colors duration-200 ease-in-out ${sizeStyles[size]} bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {bookmarked ? (
        <FaBookmark className={`${iconStyles[size]} text-yellow-500`} />
      ) : (
        <FaRegBookmark className={`${iconStyles[size]} text-gray-600 dark:text-gray-300`} />
      )}
      <span className={`font-semibold ${bookmarked ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-300'}`}>{bookmarkCount}</span>
    </button>
  );
};

export default BookmarkButton;
