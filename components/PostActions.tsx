'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PostActionsProps {
  likeCount: number;
  match?: {
    homeTeam: string;
    awayTeam: string;
  };
}

export default function PostActions({ likeCount, match }: PostActionsProps) {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Get the current URL on the client side
    setCurrentUrl(window.location.href);
  }, []);

  const handleCopy = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      alert('リンクをコピーしました！');
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
      {/* Like button (display only) */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1">
          <span className="text-[14px]">♡</span>
          <span className="text-[12px]">{likeCount || 0}</span>
        </div>
      </div>

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
