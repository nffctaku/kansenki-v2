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
      <h1 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white">プレミアリーグ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          [
            { name: 'アーセナル', path: '/ticket-info/premier-league/arsenal' },
            { name: 'クリスタルパレス', path: '/ticket-info/premier-league/crystal-palace' },
            { name: 'チェルシー', path: '/ticket-info/premier-league/chelsea' },
            { name: 'トッテナム・ホットスパー', path: '/ticket-info/premier-league/tottenham-hotspur' },
            { name: 'ノッティンガム・フォレスト', path: '/ticket-info/premier-league/nottingham-forest' },
            { name: 'ブライトン', path: '/ticket-info/premier-league/brighton' },
            { name: 'マンチェスター・シティ', path: '/ticket-info/premier-league/manchester-city' },
            { name: 'マンチェスター・ユナイテッド', path: '/ticket-info/premier-league/manchester-united' },
            { name: 'リヴァプール', path: '/ticket-info/premier-league/liverpool' },
          ].map((team) => (
            <Link href={team.path} key={team.name}>
              <div className="block bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer">
                <h2 className="text-xl font-semibold text-center text-slate-800 dark:text-slate-200">{team.name}</h2>
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  );
}
