'use client';

import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '@/lib/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { doc, getDoc, runTransaction } from 'firebase/firestore';

interface LikeButtonProps {
  postId: string;
  collectionName: string;
  size?: 'xs' | 'sm' | 'md';
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, collectionName, size = 'md' }) => {
  const [user, setUser] = useState<User | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const getLikeCount = useCallback(async () => {
    const postRef = doc(db, collectionName, postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      setLikeCount(postSnap.data().likeCount || 0);
    }
  }, [postId, collectionName]);

  useEffect(() => {
    const checkLikeStatus = async () => {
      setLoading(true);
      await getLikeCount();
      if (user) {
        const likeRef = doc(db, collectionName, postId, 'likes', user.uid);
        const likeSnap = await getDoc(likeRef);
        setLiked(likeSnap.exists());
      } else {
        setLiked(false);
      }
      setLoading(false);
    };

    if (postId) {
      checkLikeStatus();
    }
  }, [postId, user, getLikeCount, collectionName]);

  const handleLike = async () => {
    if (!user) {
      alert('いいねするにはログインが必要です。');
      return;
    }
    if (loading) return;

    setLoading(true);

    const postRef = doc(db, collectionName, postId);
    const likeRef = doc(db, collectionName, postId, 'likes', user.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) {
          throw new Error('Post does not exist!');
        }

        // Check the like document's existence within the transaction
        const likeDoc = await transaction.get(likeRef);

        const currentLikeCount = postDoc.data().likeCount || 0;

        if (liked) {
          // User wants to unlike, so the like document should exist.
          if (likeDoc.exists()) {
            transaction.update(postRef, { likeCount: Math.max(0, currentLikeCount - 1) });
            transaction.delete(likeRef);
          }
        } else {
          // User wants to like, so the like document should not exist.
          if (!likeDoc.exists()) {
            transaction.update(postRef, { likeCount: currentLikeCount + 1 });
            transaction.set(likeRef, { createdAt: new Date() });
          }
        }
      });

      setLiked(!liked);
      await getLikeCount();
    } catch (error) {
      console.error('Error processing like: ', error);
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
      onClick={handleLike}
      disabled={loading || !user}
      className={`flex items-center justify-center ${gapStyles[size]} rounded-full transition-colors duration-200 ease-in-out ${sizeStyles[size]} bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {liked ? (
        <FaHeart className={`${iconStyles[size]} text-red-500`} />
      ) : (
        <FaRegHeart className={`${iconStyles[size]} text-gray-600 dark:text-gray-300`} />
      )}
      <span className={`font-semibold ${liked ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>{likeCount}</span>
    </button>
  );
};

export default LikeButton;
