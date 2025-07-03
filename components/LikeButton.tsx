'use client';

import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '@/lib/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, runTransaction } from 'firebase/firestore';

interface LikeButtonProps {
  postId: string;
  size?: 'xs' | 'sm' | 'md';
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, size = 'md' }) => {
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
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      setLikeCount(postSnap.data().likeCount || 0);
    }
  }, [postId]);

  useEffect(() => {
    const checkLikeStatus = async () => {
      setLoading(true);
      await getLikeCount();
      if (user) {
        const likeRef = doc(db, 'posts', postId, 'likes', user.uid);
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
  }, [postId, user, getLikeCount]);

  const handleLike = async () => {
    if (!user) {
      alert('いいねするにはログインが必要です。');
      return;
    }
    if (loading) return;

    setLoading(true);

    const postRef = doc(db, 'posts', postId);
    const likeRef = doc(db, 'posts', postId, 'likes', user.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) {
          throw 'Post does not exist!';
        }

        const currentLikeCount = postDoc.data().likeCount || 0;
        if (liked) {
          transaction.update(postRef, { likeCount: currentLikeCount - 1 });
          transaction.delete(likeRef);
        } else {
          transaction.update(postRef, { likeCount: currentLikeCount + 1 });
          transaction.set(likeRef, { createdAt: new Date() });
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
    xs: 'px-2 py-0.5 text-[11px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-4 py-2 text-base',
  };

  const iconStyles = {
    xs: 'text-base',
    sm: 'text-xl',
    md: 'text-2xl',
  };

  const loadingStyles = {
    xs: 'h-6 w-12',
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
      className={`flex items-center justify-center gap-1 rounded-full transition-colors duration-200 ease-in-out ${sizeStyles[size]} ${
        liked
          ? 'bg-pink-500 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span className={`${iconStyles[size]} ${liked ? 'text-red-500' : 'text-gray-400'}`}>
        {liked ? '❤️' : '🤍'}
      </span>
      <span className="font-semibold text-gray-800 dark:text-gray-200">{likeCount}</span>
    </button>
  );
};

export default LikeButton;
