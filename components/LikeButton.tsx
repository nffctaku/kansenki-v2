'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface LikeButtonProps {
  postId: string;
  collectionName: string; // This prop is kept for consistency but the logic will only use postId
  size?: 'xs' | 'sm' | 'md';
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, size = 'md' }) => {
  const [user, setUser] = useState<User | null>(null);
  const [liked, setLiked] = useState(false);
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

  const checkLikeStatus = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const likeRef = doc(db, 'users', user.uid, 'likes', postId);
      const docSnap = await getDoc(likeRef);
      setLiked(docSnap.exists());
    } catch (error) {
      console.error('Error checking like status:', error);
    } finally {
      setLoading(false);
    }
  }, [user, postId]);

  useEffect(() => {
    if (user) {
      checkLikeStatus();
    } else {
      // Reset state when user logs out
      setLiked(false);
    }
  }, [user, checkLikeStatus]);

  const handleLike = async () => {
    if (!user) {
      alert('いいねするにはログインが必要です。');
      return;
    }
    if (loading) return;

    setLoading(true);
    const likeRef = doc(db, 'users', user.uid, 'likes', postId);

    try {
      if (liked) {
        await deleteDoc(likeRef);
        setLiked(false);
      } else {
        await setDoc(likeRef, {
          postId: postId,
          createdAt: serverTimestamp(),
        });
        setLiked(true);
      }
    } catch (error) {
      console.error('Error updating like:', error);
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
      onClick={handleLike}
      disabled={!user}
      className={`flex items-center justify-center rounded-full transition-colors duration-200 ease-in-out p-2 disabled:opacity-50 disabled:cursor-not-allowed
        ${liked 
          ? 'text-red-500 hover:bg-red-100 dark:hover:bg-gray-800' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`
      }
    >
      {liked ? (
        <FaHeart className={`${iconStyles[size]}`} />
      ) : (
        <FaRegHeart className={`${iconStyles[size]}`} />
      )}
    </button>
  );
};

export default LikeButton;
