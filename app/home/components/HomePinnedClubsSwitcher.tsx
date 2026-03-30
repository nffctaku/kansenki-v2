'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Plus, X } from 'lucide-react';
import { premierLeagueClubs } from '@/lib/clubMaster';

type Props = {
  favoriteClubIds: string[];
  pinnedClubIds: string[];
  selectedClubId: string | null;
  onSelect: (clubId: string | null) => void;
  onPin: (clubId: string) => void;
  onUnpin: (clubId: string) => void;
};

export default function HomePinnedClubsSwitcher({
  favoriteClubIds,
  pinnedClubIds,
  selectedClubId,
  onSelect,
  onPin,
  onUnpin,
}: Props) {
  const pinnedClubs = useMemo(() => {
    return pinnedClubIds
      .map((id) => (premierLeagueClubs as Record<string, any>)[id])
      .filter(Boolean);
  }, [pinnedClubIds]);

  const canPinMore = pinnedClubIds.length < 3;
  const pinCandidates = favoriteClubIds.filter((id) => !pinnedClubIds.includes(id));

  if (favoriteClubIds.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 overflow-x-auto max-w-full">
        {pinnedClubs.map((club) => {
          const active = selectedClubId === club.id;
          return (
            <button
              type="button"
              key={club.id}
              onClick={() => onSelect(club.id)}
              className={
                `relative w-12 h-12 shrink-0 rounded-full border shadow-sm transition-colors ` +
                (active
                  ? 'bg-white/95 border-amber-300/60'
                  : 'bg-white/90 border-white/15 hover:bg-white')
              }
              title={club.nameJa}
            >
              <Image src={club.logoSrc} alt={club.nameJa} fill sizes="48px" className="object-contain p-2" />
              <span className="absolute -top-1 -right-1">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnpin(club.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      onUnpin(club.id);
                    }
                  }}
                  className="h-5 w-5 rounded-full bg-black/60 border border-white/20 flex items-center justify-center"
                  aria-label="ピン留め解除"
                >
                  <X className="h-3 w-3 text-white/90" />
                </span>
              </span>
            </button>
          );
        })}

        {canPinMore && pinCandidates.length > 0 && (
          <button
            type="button"
            onClick={() => onPin(pinCandidates[0])}
            className="w-12 h-12 shrink-0 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/15"
            title="ピン留めを追加"
          >
            <Plus className="h-5 w-5 text-white/70" />
          </button>
        )}
      </div>
    </div>
  );
}
