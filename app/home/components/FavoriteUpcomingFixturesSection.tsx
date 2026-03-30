'use client';

import Image from 'next/image';
import { getPremierLeagueClubById } from '@/lib/clubMaster';
import type { ManualFixture, ManualCompetitionId } from '@/lib/fixtures/manualFixtures';

type UpcomingFixtureItem = {
  fixture: ManualFixture;
  kickoffDate: Date | null;
};

type Props = {
  featured: UpcomingFixtureItem;
  others: UpcomingFixtureItem[];
  formatKickoff: (date: Date) => string;
  competitionLogoSrc: Record<string, string>;
  broadcasterByCompetition: Record<string, string>;
};

export default function FavoriteUpcomingFixturesSection({
  featured,
  others,
  formatKickoff,
  competitionLogoSrc,
  broadcasterByCompetition,
}: Props) {
  return (
    <div className="mb-5">
      <div className="mb-2 text-sm font-bold text-gray-100">お気に入りの今後の試合（手入力）</div>

      <div className="mb-3">{renderFeatured()}</div>

      {others.length > 0 && (
        <div className="flex items-stretch gap-3 overflow-x-auto max-w-full pb-1">{others.map(renderCompact)}</div>
      )}
    </div>
  );

  function renderFeatured() {
    const { fixture, kickoffDate } = featured;
    const home = getPremierLeagueClubById(fixture.homeClubId);
    const away = getPremierLeagueClubById(fixture.awayClubId);
    const logoSrc = competitionLogoSrc[fixture.competitionId];
    const broadcaster = broadcasterByCompetition[fixture.competitionId as ManualCompetitionId] ?? '';
    const homeLabel = home?.nameJa ?? fixture.homeClubId.toUpperCase();
    const awayLabel = away?.nameJa ?? fixture.awayClubId.toUpperCase();

    return (
      <div className="relative rounded-2xl border border-white/20 bg-white/10 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {logoSrc ? (
              <div className="relative h-10 w-10 shrink-0 rounded-full bg-white/90 border border-white/15">
                <Image src={logoSrc} alt={fixture.competitionId} fill sizes="40px" className="object-contain p-1.5" />
              </div>
            ) : (
              <div className="h-10 w-10 shrink-0 rounded-full bg-white/10 border border-white/10" />
            )}
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-100 truncate">{fixture.roundLabel ?? fixture.competitionId}</div>
              <div className="text-xs text-white/60">{kickoffDate ? formatKickoff(kickoffDate) : '未定'}</div>
            </div>
          </div>

          {broadcaster && (
            <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
              {broadcaster}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative h-12 w-12 shrink-0 rounded-full bg-white/90 border border-white/15">
              {home ? (
                <Image src={home.logoSrc} alt={home.nameJa} fill sizes="48px" className="object-contain p-2" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[10px] text-white/70">{fixture.homeClubId.toUpperCase()}</div>
              )}
            </div>
            <div className="text-sm font-semibold text-gray-100 truncate">{homeLabel}</div>
          </div>

          <div className="text-xs font-semibold text-white/60">vs</div>

          <div className="flex items-center gap-2 min-w-0">
            <div className="text-sm font-semibold text-gray-100 truncate">{awayLabel}</div>
            <div className="relative h-12 w-12 shrink-0 rounded-full bg-white/90 border border-white/15">
              {away ? (
                <Image src={away.logoSrc} alt={away.nameJa} fill sizes="48px" className="object-contain p-2" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[10px] text-white/70">{fixture.awayClubId.toUpperCase()}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderCompact({ fixture, kickoffDate }: UpcomingFixtureItem) {
    const home = getPremierLeagueClubById(fixture.homeClubId);
    const away = getPremierLeagueClubById(fixture.awayClubId);
    const logoSrc = competitionLogoSrc[fixture.competitionId];
    const broadcaster = broadcasterByCompetition[fixture.competitionId as ManualCompetitionId] ?? '';
    const homeLabel = home?.nameJa ?? fixture.homeClubId.toUpperCase();
    const awayLabel = away?.nameJa ?? fixture.awayClubId.toUpperCase();

    return (
      <div key={fixture.id} className="relative w-[260px] shrink-0 rounded-2xl border border-white/10 bg-white/10 px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {logoSrc ? (
              <div className="relative h-9 w-9 shrink-0 rounded-full bg-white/90 border border-white/15">
                <Image src={logoSrc} alt={fixture.competitionId} fill sizes="36px" className="object-contain p-1.5" />
              </div>
            ) : (
              <div className="h-9 w-9 shrink-0 rounded-full bg-white/10 border border-white/10" />
            )}
            <div className="min-w-0">
              <div className="text-xs font-semibold text-gray-100 truncate">{fixture.roundLabel ?? fixture.competitionId}</div>
              <div className="text-xs text-white/60">{kickoffDate ? formatKickoff(kickoffDate) : '未定'}</div>
              {broadcaster && (
                <div className="mt-1 inline-flex rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                  {broadcaster}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative h-10 w-10 shrink-0 rounded-full bg-white/90 border border-white/15">
              {home ? (
                <Image src={home.logoSrc} alt={home.nameJa} fill sizes="40px" className="object-contain p-2" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[10px] text-white/70">{fixture.homeClubId.toUpperCase()}</div>
              )}
            </div>
            <div className="text-xs text-gray-100 truncate">{homeLabel}</div>
          </div>

          <div className="text-xs text-white/60">vs</div>

          <div className="flex items-center gap-2 min-w-0">
            <div className="text-xs text-gray-100 truncate">{awayLabel}</div>
            <div className="relative h-10 w-10 shrink-0 rounded-full bg-white/90 border border-white/15">
              {away ? (
                <Image src={away.logoSrc} alt={away.nameJa} fill sizes="40px" className="object-contain p-2" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[10px] text-white/70">{fixture.awayClubId.toUpperCase()}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
