'use client';

import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '@/lib/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { PiHandsClapping, PiHandsClappingFill } from 'react-icons/pi';
import { doc, getDoc, runTransaction } from 'firebase/firestore';

interface ThanksButtonProps {
  postId: string;
  collectionName: string;
  size?: 'xs' | 'sm' | 'md';
}

const ThanksButton: React.FC<ThanksButtonProps> = ({ postId, collectionName, size = 'md' }) => {
  const [user, setUser] = useState<User | null>(null);
  const [thanked, setThanked] = useState(false);
  const [thanksCount, setThanksCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const getThanksCount = useCallback(async () => {
    const postRef = doc(db, collectionName, postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      setThanksCount(postSnap.data().helpfulCount || 0);
    }
  }, [postId, collectionName]);

  useEffect(() => {
    const checkThanksStatus = async () => {
      setLoading(true);
      await getThanksCount();
      if (user) {
        const thanksRef = doc(db, collectionName, postId, 'thanks', user.uid);
        const thanksSnap = await getDoc(thanksRef);
        setThanked(thanksSnap.exists());
      } else {
        setThanked(false);
      }
      setLoading(false);
    };

    if (postId) {
      checkThanksStatus();
    }
  }, [postId, user, getThanksCount, collectionName]);

  const handleThanks = async () => {
    if (!user) {
      alert('「参考になった」を伝えるにはログインが必要です。');
      return;
    }
    if (loading) return;

    setLoading(true);

    const postRef = doc(db, collectionName, postId);
    const thanksRef = doc(db, collectionName, postId, 'thanks', user.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) {
          throw new Error('Post does not exist!');
        }

        const thanksDoc = await transaction.get(thanksRef);
        const currentThanksCount = postDoc.data().helpfulCount || 0;

        if (thanked) {
          if (thanksDoc.exists()) {
            transaction.update(postRef, { helpfulCount: Math.max(0, currentThanksCount - 1) });
            transaction.delete(thanksRef);
          }
        } else {
          if (!thanksDoc.exists()) {
            transaction.update(postRef, { helpfulCount: currentThanksCount + 1 });
            transaction.set(thanksRef, { createdAt: new Date() });
          }
        }
      });

      setThanked(!thanked);
      await getThanksCount();
    } catch (error) {
      console.error('Error processing thanks: ', error);
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
      onClick={handleThanks}
      disabled={loading || !user}
      className={`flex items-center justify-center ${gapStyles[size]} rounded-full transition-colors duration-200 ease-in-out ${sizeStyles[size]} bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {thanked ? (
        <PiHandsClappingFill className={`${iconStyles[size]} text-blue-500`} />
      ) : (
        <PiHandsClapping className={`${iconStyles[size]} text-gray-600 dark:text-gray-300`} />
      )}
      <span className={`font-semibold ${thanked ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'}`}>{thanksCount}</span>
    </button>
  );
};

export default ThanksButton;
