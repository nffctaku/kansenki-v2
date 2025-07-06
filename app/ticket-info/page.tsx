'use client';

import React from 'react';
import Link from 'next/link';

const leagues = [
  { name: 'プレミアリーグ', path: '/ticket-info/premier-league' },
  { name: 'ラ・リーガ', path: '/ticket-info/la-liga' },
  { name: 'セリエA', path: '/ticket-info/serie-a' },
  { name: 'ブンデスリーガ', path: '/ticket-info/bundesliga' },
  { name: 'リーグ・アン', path: '/ticket-info/ligue-1' },
  { name: 'その他', path: '/ticket-info/other-leagues' },
];

export default function TicketInfoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white">リーグを選択</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {leagues.map((league) => (
          <Link href={league.path} key={league.name}>
            <div className="block bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer">
              <h2 className="text-xl font-semibold text-center text-slate-800 dark:text-slate-200">{league.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
