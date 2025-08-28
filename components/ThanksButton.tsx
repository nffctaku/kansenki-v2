'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { PiHandsClapping, PiHandsClappingFill } from 'react-icons/pi';

interface ThanksButtonProps {
  postId: string;
  collectionName: string; // Kept for consistency, not used in new logic
  size?: 'xs' | 'sm' | 'md';
}

const ThanksButton: React.FC<ThanksButtonProps> = ({ postId, size = 'md' }) => {
  const [user, setUser] = useState<User | null>(null);
  const [thanked, setThanked] = useState(false);
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

  const checkThanksStatus = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const thanksRef = doc(db, 'users', user.uid, 'thanks', postId);
      const docSnap = await getDoc(thanksRef);
      setThanked(docSnap.exists());
    } catch (error) {
      console.error('Error checking thanks status:', error);
    } finally {
      setLoading(false);
    }
  }, [user, postId]);

  useEffect(() => {
    if (user) {
      checkThanksStatus();
    } else {
      setThanked(false);
    }
  }, [user, checkThanksStatus]);

  const handleThanks = async () => {
    if (!user) {
      alert('「参考になった」を伝えるにはログインが必要です。');
      return;
    }
    if (loading) return;

    setLoading(true);
    const thanksRef = doc(db, 'users', user.uid, 'thanks', postId);

    try {
      if (thanked) {
        await deleteDoc(thanksRef);
        setThanked(false);
      } else {
        await setDoc(thanksRef, {
          postId: postId,
          createdAt: serverTimestamp(),
        });
        setThanked(true);
      }
    } catch (error) {
      console.error('Error updating thanks:', error);
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
      onClick={handleThanks}
      disabled={!user}
      className={`flex items-center justify-center rounded-full transition-colors duration-200 ease-in-out p-2 disabled:opacity-50 disabled:cursor-not-allowed
        ${thanked
          ? 'text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-800'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`
      }
    >
      {thanked ? (
        <PiHandsClappingFill className={`${iconStyles[size]}`} />
      ) : (
        <PiHandsClapping className={`${iconStyles[size]}`} />
      )}
    </button>
  );
};

export default ThanksButton;
