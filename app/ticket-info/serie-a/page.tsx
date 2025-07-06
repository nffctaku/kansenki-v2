'use client';

import React from 'react';
import Link from 'next/link';

export default function LeaguePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/ticket-info" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          &larr; リーグ選択に戻る
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white">セリエA</h1>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <p className="text-slate-700 dark:text-slate-300">ここにセリエAのチーム別チケット情報を表示します。</p>
      </div>
    </div>
  );
}
