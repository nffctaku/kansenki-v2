'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import { doc, writeBatch, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PostActionsProps {
  postId: string;
  likeCount: number;
  helpfulCount: number;
  match?: {
    homeTeam: string;
    awayTeam: string;
  };
}

export default function PostActions({ postId, likeCount, helpfulCount, match }: PostActionsProps) {
  const [currentUrl, setCurrentUrl] = useState('');
  const [currentLikes, setCurrentLikes] = useState(likeCount);
  const [currentHelpfuls, setCurrentHelpfuls] = useState(helpfulCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBeenHelpful, setHasBeenHelpful] = useState(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);
    // Check localStorage to see if user has already interacted
    if (localStorage.getItem(`liked_${postId}`)) {
      setHasLiked(true);
    }
    if (localStorage.getItem(`helpful_${postId}`)) {
      setHasBeenHelpful(true);
    }
  }, [postId]);

  const handleCopy = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      alert('リンクをコピーしました！');
    }
  };

  const handleAction = async (action: 'like' | 'helpful') => {
    const alreadyActioned = action === 'like' ? hasLiked : hasBeenHelpful;
    if (alreadyActioned) return; // Prevent multiple clicks

    const postRef = doc(db, 'posts', postId);
    const simplePostRef = doc(db, 'simple-posts', postId);
    const batch = writeBatch(db);

    if (action === 'like') {
      setCurrentLikes(prev => prev + 1);
      setHasLiked(true);
      localStorage.setItem(`liked_${postId}`, 'true');
      batch.update(postRef, { likeCount: increment(1) });
      batch.update(simplePostRef, { likeCount: increment(1) });
    } else {
      setCurrentHelpfuls(prev => prev + 1);
      setHasBeenHelpful(true);
      localStorage.setItem(`helpful_${postId}`, 'true');
      batch.update(postRef, { helpfulCount: increment(1) });
      batch.update(simplePostRef, { helpfulCount: increment(1) });
    }

    try {
      await batch.commit();
    } catch (error) {
      console.error("Error updating counts: ", error);
      // Revert state if firestore update fails
      if (action === 'like') {
        setCurrentLikes(prev => prev - 1);
        setHasLiked(false);
        localStorage.removeItem(`liked_${postId}`);
      } else {
        setCurrentHelpfuls(prev => prev - 1);
        setHasBeenHelpful(false);
        localStorage.removeItem(`helpful_${postId}`);
      }
    }
  };

  const tweetText =
    match && match.homeTeam && match.awayTeam
      ? `『${match.homeTeam} vs ${match.awayTeam}』の観戦記をチェック！ #kansenki`
      : '観戦記をチェック！ #kansenki';

  const twitterShareUrl = currentUrl
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`
    : '#';

  return (
    <div className="flex justify-center items-center gap-6 mt-6 text-[11px] text-gray-700 dark:text-gray-400">
      {/* Helpful button */}
      <button onClick={() => handleAction('helpful')} disabled={hasBeenHelpful} className="flex flex-col items-center disabled:opacity-50 disabled:cursor-not-allowed">
        <div className="flex items-center gap-1">
          <span className="text-sm">参考になった</span>
          <span className="text-xs">{currentHelpfuls || 0}</span>
        </div>
      </button>

      {/* Like button */}
      <button onClick={() => handleAction('like')} disabled={hasLiked} className="flex flex-col items-center disabled:opacity-50 disabled:cursor-not-allowed">
        <div className="flex items-center gap-1">
          <span className="text-lg">♡</span>
          <span className="text-xs">{currentLikes || 0}</span>
        </div>
      </button>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="flex flex-col items-center hover:opacity-80 bg-transparent border-none p-0"
        disabled={!currentUrl}
        aria-label="Copy link"
      >
        <Image src="/フリーのクリップアイコン.png" alt="コピー" width={16} height={16} className="w-[16px] h-[16px] mb-0.5 object-contain dark:invert" />
      </button>

      {/* X (Twitter) share button */}
      <a
        href={twitterShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={!currentUrl ? 'pointer-events-none opacity-50' : 'hover:opacity-80'}
        aria-label="Share on X"
      >
        <Image src="/logo-black.png" alt="X" width={16} height={16} className="w-[16px] h-[16px] mb-0.5 object-contain dark:invert" />
      </a>
    </div>
  );
}
