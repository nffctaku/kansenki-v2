'use client';

import Image from 'next/image';
import { premierLeagueClubs } from '@/lib/clubMaster';

type Props = {
  favoriteClubIds: string[];
};

export function FavoriteClubBadges({ favoriteClubIds }: Props) {
  if (!favoriteClubIds || favoriteClubIds.length === 0) return null;

  return (
    <div className="mt-4 text-left">
      <h3 className="font-semibold text-gray-500 dark:text-gray-400">お気に入りクラブ</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {favoriteClubIds.map((clubId) => {
          const club = (premierLeagueClubs as Record<string, any>)[clubId];
          if (!club) {
            return (
              <span
                key={clubId}
                className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-100"
              >
                {clubId}
              </span>
            );
          }

          return (
            <span
              key={clubId}
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 text-xs font-semibold pl-2 pr-3 py-1 rounded-full dark:bg-gray-700 dark:text-gray-100"
            >
              <span className="relative w-4 h-4">
                <Image
                  src={club.logoSrc}
                  alt={club.nameJa}
                  fill
                  sizes="16px"
                  className="object-contain"
                />
              </span>
              <span className="max-w-[10rem] truncate">{club.nameJa}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
