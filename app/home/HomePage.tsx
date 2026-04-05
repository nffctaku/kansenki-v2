'use client';

import Link from 'next/link';
import AnnouncementBanner from '../components/AnnouncementBanner';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { getPremierLeagueClubById } from '@/lib/clubMaster';
import { manualFixtures } from '@/lib/fixtures/manualFixtures';
import { manualNationalMatches } from '@/lib/national/manualNationalMatches';
import FeaturedNationalMatchHeroCarousel from './components/FeaturedNationalMatchHeroCarousel';
import FavoriteUpcomingFixturesSection from './components/FavoriteUpcomingFixturesSection';
import ManualHighlightsRow from './components/ManualHighlightsRow';
import ManualNationalMatchesRow from './components/ManualNationalMatchesRow';
import IdeaDrawer from './components/IdeaDrawer';
import HomePinnedClubsSwitcher from './components/HomePinnedClubsSwitcher';
import type { ManualHighlight } from '@/lib/highlights/manualHighlights';
export default function HomePage() {
  const { user, userProfile, loading, updateUserProfile } = useAuth();

  const favoriteClubIds = userProfile?.favoriteClubIds ?? [];

  const hasUclClub = favoriteClubIds.some((id) => ['mc', 'liv', 'tot', 'che', 'new', 'ars'].includes(id));
  const hasUelClub = favoriteClubIds.some((id) => ['avl', 'nfo'].includes(id));

  const uclClubIds = ['mc', 'liv', 'tot', 'che', 'new', 'ars'];
  const uelClubIds = ['avl', 'nfo'];
  const ueclClubIds: string[] = ['cry'];

  const clubNameAliasesJa: Record<string, string[]> = {
    mc: ['マンチェスターC', 'マンチェスター・シティ'],
    liv: ['リヴァプール', 'リバプール'],
    ful: ['フラム', 'フルハム'],
  };

  const competitionLogoSrc: Record<string, string> = {
    PL: '/大会ロゴ/PL.png',
    CL: '/大会ロゴ/CL.png',
    EL: '/大会ロゴ/EL.png',
    FA: '/大会ロゴ/FA_Cup_logo_(2020).svg.png',
    CARABAO: '/大会ロゴ/Carabao.png',
  };

  const broadcasterByCompetition: Record<string, string> = {
    CL: 'WOWOW',
    EL: 'WOWOW',
    PL: 'U-NEXT',
    FA: 'U-NEXT',
    CARABAO: 'DAZN',
  };

  const now = new Date();

  const featuredNationalMatches = manualNationalMatches.filter((m) => m.featured).slice(0, 3);
  const featuredNationalMatchIds = new Set(featuredNationalMatches.map((m) => m.id));
  const nationalMatchesForList = manualNationalMatches.filter((m) => !featuredNationalMatchIds.has(m.id));

  const homePinnedClubIds = (userProfile?.homePinnedClubIds ?? []).slice(0, 3);
  const homeSelectedClubId = userProfile?.homeSelectedClubId ? userProfile.homeSelectedClubId : null;

  const effectiveSelectedClubId = homeSelectedClubId ?? homePinnedClubIds[0] ?? favoriteClubIds[0] ?? null;

  const [localSelectedClubId, setLocalSelectedClubId] = useState<string | null>(null);

  const [autoHighlights, setAutoHighlights] = useState<ManualHighlight[] | null>(null);

  const filteredAutoHighlights = useMemo(() => {
    if (!autoHighlights) return null;
    if (!localSelectedClubId) return autoHighlights;
    const club = getPremierLeagueClubById(localSelectedClubId);
    if (!club) return autoHighlights;

    const normalize = (s: string) =>
      s
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[・･·\-‐‑–—ー－＿_.,/\\|:;!?()\[\]{}'"”“’‘＆&]/g, '');

    const aliasesJa = clubNameAliasesJa[localSelectedClubId] ?? [];
    const keywords = [club.nameJa, club.nameEn, ...aliasesJa]
      .filter(Boolean)
      .flatMap((name) => {
        const base = normalize(name);
        const parts = base.split(/(?<=.)(?=[a-z])|(?<=[a-z])(?=\d)/i);
        return [base, ...parts].filter(Boolean);
      })
      .filter((k) => k.length >= 2);
    if (keywords.length === 0) return autoHighlights;

    const matched = autoHighlights.filter((h: any) => {
      const title = normalize(h.label ?? '');
      const desc = normalize(typeof h.description === 'string' ? h.description : '');
      return keywords.some((k) => k && (title.includes(k) || desc.includes(k)));
    });

    return matched.slice(0, 5);
  }, [autoHighlights, localSelectedClubId]);

  useEffect(() => {
    setLocalSelectedClubId(effectiveSelectedClubId);
  }, [effectiveSelectedClubId]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const club = localSelectedClubId ? getPremierLeagueClubById(localSelectedClubId) : null;
        const clubNameJa = club?.nameJa ?? '';
        const aliasesJa = localSelectedClubId ? (clubNameAliasesJa[localSelectedClubId] ?? []) : [];
        const clubQueryJa = clubNameJa.replace(/[・･·]/g, '');
        const clubQueryJaCandidates = [clubQueryJa, ...aliasesJa.map((s) => s.replace(/[・･·]/g, ''))].filter(Boolean);
        const clubQueryJaPrimary = clubQueryJaCandidates[0] ?? '';

        const qsUnext = new URLSearchParams({
          limit: '10',
          fetchMax: '25',
          handle: 'UNEXT_football',
        });
        if (clubQueryJaPrimary) qsUnext.set('q', `プレミアリーグ ショートハイライト ${clubQueryJaPrimary}`);

        const qsWowow = new URLSearchParams({
          limit: '10',
          fetchMax: '25',
          handle: 'wowowsoccer',
        });
        const wowowQuery = (() => {
          if (!localSelectedClubId) return '';
          if (!clubQueryJaPrimary) return '';
          if (uclClubIds.includes(localSelectedClubId)) {
            return `UEFAチャンピオンズリーグ MATCH HIGHLIGHT ${clubQueryJaPrimary}`;
          }
          if (uelClubIds.includes(localSelectedClubId)) {
            return `UEFAヨーロッパリーグ MATCH HIGHLIGHT ${clubQueryJaPrimary}`;
          }
          if (ueclClubIds.includes(localSelectedClubId)) {
            return `UEFAカンファレンスリーグ MATCH HIGHLIGHT ${clubQueryJaPrimary}`;
          }
          return '';
        })();
        if (wowowQuery) qsWowow.set('q', wowowQuery);

        const [resUnext, resWowow] = await Promise.all([
          fetch(`/api/unext-football-highlights?${qsUnext.toString()}`),
          wowowQuery ? fetch(`/api/unext-football-highlights?${qsWowow.toString()}`) : Promise.resolve(null),
        ]);

        const items: any[] = [];

        if (resUnext.ok) {
          const json = await resUnext.json();
          items.push(...(json?.items ?? []));
        }
        if (resWowow && resWowow.ok) {
          const json = await resWowow.json();
          items.push(...(json?.items ?? []));
        }

        if (!cancelled) setAutoHighlights(items);
      } catch {
        if (!cancelled) setAutoHighlights([]);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [localSelectedClubId]);

  useEffect(() => {
    if (!user) return;
    if (!effectiveSelectedClubId) return;
    if (homeSelectedClubId) return;
    updateUserProfile({ homeSelectedClubId: effectiveSelectedClubId });
  }, [user, effectiveSelectedClubId, homeSelectedClubId, updateUserProfile]);

  const fixtureTargetClubIds = localSelectedClubId ? [localSelectedClubId] : [];

  const upcomingFixturesAll = manualFixtures
    .filter((f) =>
      fixtureTargetClubIds.includes(f.homeClubId) || fixtureTargetClubIds.includes(f.awayClubId)
    )
    .map((f) => ({
      fixture: f,
      kickoffDate: f.kickoffAt ? new Date(f.kickoffAt) : null,
    }))
    .filter(({ kickoffDate }) => kickoffDate && kickoffDate.getTime() > now.getTime())
    .sort((a, b) => (a.kickoffDate!.getTime() - b.kickoffDate!.getTime()));

  const featuredUpcomingFixture =
    upcomingFixturesAll.find(({ fixture }) => fixture.featured) ?? upcomingFixturesAll[0] ?? null;

  const upcomingFixtures = upcomingFixturesAll
    .filter(({ fixture }) => fixture.id !== featuredUpcomingFixture?.fixture.id)
    .slice(0, 4);

  const formatKickoff = (date: Date) => {
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${m}/${d} ${hh}:${mm}`;
  };

  const widgets: {
    title: string;
    items: { label: string; href?: string }[];
  }[] = [
    {
      title: '時事ネタ',
      items: [
        { label: 'チーム情報' },
        { label: '選手情報' },
        { label: '大会情報' },
      ],
    },
    {
      title: '現地観戦に行こう',
      items: [
        { label: '現地観戦記事' },
        { label: 'みんなの観戦記' },
      ],
    },
    {
      title: '注目マッチ',
      items: [
        { label: '各国各節注目マッチプレビュー' },
        { label: '試合予想' },
      ],
    },
    {
      title: 'みんなで観戦会',
      items: [
        { label: '観戦会情報' },
        { label: '観戦会ガイド' },
        { label: '大型パブリックビューイング' },
        { label: 'HISツアー' },
      ],
    },
    {
      title: '試合を観よう',
      items: [
        { label: '視聴方法' },
      ],
    },
    {
      title: 'サポクラ',
      items: [
        { label: 'サポクラとは' },
        { label: '各サポクラページ' },
      ],
    },
    {
      title: 'ユニフォームを買う',
      items: [
        { label: '各クラブショップサイト' },
        { label: '海外ショップ関連記事 ※関税とは' },
        { label: '国内ユニフォーム店紹介' },
      ],
    },
    {
      title: 'W杯',
      items: [
        { label: '関連記事' },
        { label: '予想' },
      ],
    },
    {
      title: 'スポーツバー',
      items: [
        { label: 'HUBなど紹介' },
        { label: 'Googleマップ化' },
      ],
    },
    {
      title: 'EVENT情報',
      items: [
        { label: '観戦会' },
        { label: 'サッカー／フットサル' },
        { label: '交流会' },
      ],
    },
    {
      title: 'メディア紹介',
      items: [],
    },
    {
      title: 'スポカレライター',
      items: [],
    },
  ];

  const [isIdeaDrawerOpen, setIsIdeaDrawerOpen] = useState(false);

  return (
    <>
      <AnnouncementBanner />

      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950">
        <div className="px-3 pt-4">
          <FeaturedNationalMatchHeroCarousel matches={featuredNationalMatches} intervalMs={4000} />

          {user && favoriteClubIds.length > 0 && (
            <HomePinnedClubsSwitcher
              favoriteClubIds={favoriteClubIds}
              pinnedClubIds={homePinnedClubIds}
              selectedClubId={localSelectedClubId}
              onSelect={async (clubId) => {
                if (!clubId) return;
                setLocalSelectedClubId(clubId);
                await updateUserProfile({ homeSelectedClubId: clubId });
              }}
              onPin={async (clubId) => {
                if (homePinnedClubIds.includes(clubId)) return;
                const next = [...homePinnedClubIds, clubId].slice(0, 3);
                const shouldSelect = localSelectedClubId ? localSelectedClubId : clubId;
                setLocalSelectedClubId(shouldSelect);
                await updateUserProfile({
                  homePinnedClubIds: next,
                  homeSelectedClubId: shouldSelect,
                });
              }}
              onUnpin={async (clubId) => {
                const next = homePinnedClubIds.filter((id) => id !== clubId);
                const nextSelected = localSelectedClubId === clubId ? (next[0] ?? favoriteClubIds[0] ?? '') : (localSelectedClubId ?? '');
                setLocalSelectedClubId(nextSelected || null);
                await updateUserProfile({ homePinnedClubIds: next, homeSelectedClubId: nextSelected });
              }}
            />
          )}

          <div className="mb-4">
            {loading ? (
              <div className="flex justify-center">
                <div className="rounded-full px-4 py-2 text-xs bg-white/10 text-gray-200 border border-white/10">
                  読み込み中...
                </div>
              </div>
            ) : !user ? (
              <div className="flex justify-center">
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-xs bg-white/90 text-slate-900 hover:bg-white transition-colors"
                >
                  ログインしてお気に入りを使う
                </Link>
              </div>
            ) : favoriteClubIds.length > 0 ? (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 overflow-x-auto max-w-full px-1">
                  {favoriteClubIds.slice(0, 8).map((id) => {
                    const club = getPremierLeagueClubById(id);
                    if (!club) return null;
                    const active = localSelectedClubId === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={async () => {
                          setLocalSelectedClubId(id);
                          await updateUserProfile({ homeSelectedClubId: id });
                        }}
                        className={
                          `relative w-14 h-14 rounded-full shadow-sm shrink-0 transition-colors ` +
                          (active
                            ? 'bg-white/95 border-amber-300/60 border-2'
                            : 'bg-white/90 border border-white/15 hover:bg-white')
                        }
                        title={club.nameJa}
                      >
                        <Image
                          src={club.logoSrc}
                          alt={club.nameJa}
                          fill
                          sizes="56px"
                          className="object-contain p-2.5"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Link
                  href="/mypage"
                  className="rounded-full px-4 py-2 text-xs bg-white/90 text-slate-900 hover:bg-white transition-colors"
                >
                  お気に入りクラブを設定する
                </Link>
              </div>
            )}
          </div>

          {user && favoriteClubIds.length > 0 && (
            !featuredUpcomingFixture ? (
              <div className="mb-5 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/70">
                手入力データがまだ無いか、直近の試合が登録されていません
              </div>
            ) : (
              <FavoriteUpcomingFixturesSection
                featured={featuredUpcomingFixture}
                others={upcomingFixtures}
                formatKickoff={formatKickoff}
                competitionLogoSrc={competitionLogoSrc}
                broadcasterByCompetition={broadcasterByCompetition}
              />
            )
          )}

          <ManualHighlightsRow
            highlights={(filteredAutoHighlights ?? [])}
            loading={autoHighlights === null}
          />

          <ManualNationalMatchesRow matches={nationalMatchesForList} />

          <IdeaDrawer
            widgets={widgets}
            isOpen={isIdeaDrawerOpen}
            onToggle={() => setIsIdeaDrawerOpen((v) => !v)}
          />
        </div>
      </div>
    </>
  );
}
