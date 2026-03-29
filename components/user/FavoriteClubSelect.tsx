'use client';

import type { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { premierLeagueClubs } from '@/lib/clubMaster';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  favoriteClubIds: string[];
  setFavoriteClubIds: Dispatch<SetStateAction<string[]>>;
};

export function FavoriteClubSelect({ open, setOpen, favoriteClubIds, setFavoriteClubIds }: Props) {
  const premierClubs = Object.values(premierLeagueClubs);

  const toggleFavoriteClub = (clubId: string) => {
    setFavoriteClubIds((prev) => {
      if (prev.includes(clubId)) return prev.filter((id) => id !== clubId);
      return [...prev, clubId];
    });
  };

  return (
    <div>
      <div className="block text-sm font-medium text-gray-700 dark:text-gray-300">お気に入りクラブ（Premier League）</div>
      <div className="mt-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              <span className="text-sm text-gray-900 dark:text-gray-100">
                {favoriteClubIds.length > 0 ? `選択中：${favoriteClubIds.length}クラブ` : 'クラブを選択...'}
              </span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <div className="max-h-[320px] overflow-y-auto p-1">
              {premierClubs.map((club) => {
                const checked = favoriteClubIds.includes(club.id);
                return (
                  <button
                    type="button"
                    key={club.id}
                    onClick={() => toggleFavoriteClub(club.id)}
                    className={`w-full flex items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700/50 ${
                      checked ? 'bg-gray-100 dark:bg-gray-700/60' : ''
                    }`}
                  >
                    <Check className={`h-4 w-4 ${checked ? 'opacity-100 text-green-600' : 'opacity-0'}`} />
                    <span className="relative w-6 h-6 shrink-0">
                      <Image
                        src={club.logoSrc}
                        alt={club.nameJa}
                        fill
                        sizes="24px"
                        className="object-contain"
                      />
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 truncate">{club.nameJa}</span>
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        {favoriteClubIds.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {favoriteClubIds.map((clubId) => {
              const club = (premierLeagueClubs as Record<string, any>)[clubId];
              if (!club) {
                return (
                  <span
                    key={clubId}
                    className="rounded-full px-3 py-1 text-xs bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                  >
                    {clubId}
                  </span>
                );
              }

              return (
                <span
                  key={clubId}
                  className="inline-flex items-center gap-2 rounded-full pl-2 pr-3 py-1 text-xs bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
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
        )}
      </div>
    </div>
  );
}
