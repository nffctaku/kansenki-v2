'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  postId: string;
  size?: 'sm' | 'md' | 'lg';
}

const BookmarkButton = ({ postId, size = 'md' }: BookmarkButtonProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
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

  const buttonSize = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  }[size];

  const iconSize = {
    sm: 20,
    md: 24,
    lg: 28,
  }[size];

  const checkBookmarkStatus = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const bookmarkRef = doc(db, 'users', user.uid, 'bookmarks', postId);
      const docSnap = await getDoc(bookmarkRef);
      setIsBookmarked(docSnap.exists());
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
      setIsBookmarked(false);
    }
  }, [user, checkBookmarkStatus]);

  const handleBookmark = async () => {
    if (!user) {
      alert('ログインしてください。');
      return;
    }

    setLoading(true);
    const bookmarkRef = doc(db, 'users', user.uid, 'bookmarks', postId);

    try {
      if (isBookmarked) {
        await deleteDoc(bookmarkRef);
        setIsBookmarked(false);
      } else {
        await setDoc(bookmarkRef, {
          postId: postId,
          createdAt: serverTimestamp(),
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleBookmark}
        disabled={loading}
        className={`rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 flex items-center justify-center
          ${isBookmarked
            ? 'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 focus:ring-slate-500'
          } 
          ${buttonSize}`
        }
        aria-label={isBookmarked ? 'ブックマークを解除' : 'ブックマークする'}
      >
        <Bookmark size={iconSize} fill={isBookmarked ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
};

export default BookmarkButton;
