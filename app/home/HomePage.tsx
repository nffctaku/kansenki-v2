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
import IdeaDrawer from './components/IdeaDrawer';
import HomePinnedClubsSwitcher from './components/HomePinnedClubsSwitcher';
import type { ManualHighlight } from '@/lib/highlights/manualHighlights';
import type { ManualFixture } from '@/lib/fixtures/manualFixtures';
export default function HomePage() {
  const { user, userProfile, loading, updateUserProfile } = useAuth();

  const favoriteClubIds = userProfile?.favoriteClubIds ?? [];
  const hasFavorites = favoriteClubIds.length > 0;

  const hasUclClub = favoriteClubIds.some((id) => ['mc', 'liv', 'tot', 'che', 'new', 'ars'].includes(id));
  const hasUelClub = favoriteClubIds.some((id) => ['avl', 'nfo'].includes(id));

  const uclClubIds = ['mc', 'liv', 'tot', 'che', 'new', 'ars'];
  const uelClubIds = ['avl', 'nfo'];
  const ueclClubIds: string[] = ['cry'];

  const clubNameAliasesJa: Record<string, string[]> = {
    mc: ['マンC', 'マンチェスターC', 'マンチェスター・シティ'],
    mu: ['マンU', 'マンチェスターユナイテッド', 'マンチェスター・ユナイテッド'],
    liv: ['リヴァプール', 'リバプール'],
    ful: ['フラム', 'フルハム'],
    lee: ['リーズ', 'リーズU', 'リーズ・ユナイテッド', 'Leeds', 'Leeds United', 'LUFC'],
    cry: ['クリスタルパレス', 'クリスタル・パレス', 'パレス', 'Crystal Palace', 'CPFC'],
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
  const [plFixtures, setPlFixtures] = useState<ManualFixture[] | null>(null);

  const filteredAutoHighlights = useMemo(() => {
    if (!autoHighlights) return null;
    if (!hasFavorites) return [];
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
  }, [autoHighlights, localSelectedClubId, hasFavorites]);

  useEffect(() => {
    setLocalSelectedClubId(effectiveSelectedClubId);
  }, [effectiveSelectedClubId]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        if (!hasFavorites) {
          if (!cancelled) setAutoHighlights([]);
          return;
        }
        const club = localSelectedClubId ? getPremierLeagueClubById(localSelectedClubId) : null;
        const clubNameJa = club?.nameJa ?? '';
        const aliasesJa = localSelectedClubId ? (clubNameAliasesJa[localSelectedClubId] ?? []) : [];
        const clubQueryJa = clubNameJa.replace(/[・･·]/g, '');
        const clubQueryJaCandidates = [clubQueryJa, ...aliasesJa.map((s) => s.replace(/[・･·]/g, ''))].filter(Boolean);
        const clubQueryJaPrimary = clubQueryJaCandidates[0] ?? '';

        const unextQueryCandidates = Array.from(
          new Set([clubQueryJaPrimary, ...clubQueryJaCandidates, club?.nameEn ?? ''].filter(Boolean))
        );

        const unextQueries = unextQueryCandidates.flatMap((name) => {
          const cleaned = String(name).trim();
          if (!cleaned) return [];
          return [`ショートハイライト ${cleaned}`, `プレミアリーグ ショートハイライト ${cleaned}`];
        });

        const fetchUnext = async () => {
          const base = new URLSearchParams({
            limit: '10',
            fetchMax: '25',
            handle: 'UNEXT_football',
          });

          if (unextQueries.length === 0) {
            const res = await fetch(`/api/unext-football-highlights?${base.toString()}`);
            return res;
          }

          for (const qStr of unextQueries) {
            const qs = new URLSearchParams(base);
            qs.set('q', qStr);
            const res = await fetch(`/api/unext-football-highlights?${qs.toString()}`);
            if (!res.ok) continue;
            const json = await res.clone().json().catch(() => null);
            const count = Array.isArray(json?.items) ? json.items.length : 0;
            if (count > 0) return res;
          }

          const res = await fetch(`/api/unext-football-highlights?${base.toString()}`);
          return res;
        };

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
          fetchUnext(),
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
  }, [localSelectedClubId, hasFavorites]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch('/api/pl-fixtures?v=2');
        if (!res.ok) throw new Error('failed');
        const json = await res.json();
        const items = (json?.items ?? []) as ManualFixture[];
        if (!cancelled) setPlFixtures(items);
      } catch {
        if (!cancelled) setPlFixtures([]);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!effectiveSelectedClubId) return;
    if (homeSelectedClubId) return;
    updateUserProfile({ homeSelectedClubId: effectiveSelectedClubId });
  }, [user, effectiveSelectedClubId, homeSelectedClubId, updateUserProfile]);

  const fixtureTargetClubIds = localSelectedClubId ? [localSelectedClubId] : [];

  const normalizeFixtureClubId = (id: string) => {
    if (id === 'mci') return 'mc';
    if (id === 'mun') return 'mu';
    return id;
  };

  const fixturesForUpcoming = (() => {
    const merged = [...manualFixtures, ...((plFixtures ?? []).filter((f) => f.kickoffAt !== null))];
    const seen = new Set<string>();
    const out: typeof merged = [];

    for (const f of merged) {
      const homeId = normalizeFixtureClubId(f.homeClubId);
      const awayId = normalizeFixtureClubId(f.awayClubId);
      const kickoffKey = f.kickoffAt ? String(f.kickoffAt) : 'tbd';
      const key = `${f.competitionId}|${homeId}|${awayId}|${kickoffKey}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(f);
    }

    return out;
  })();

  const getMatchdayNumber = (fixture: any): number | null => {
    const label: string | undefined = fixture?.roundLabel;
    if (label) {
      const m = label.match(/第(\d+)節/);
      if (m) return Number(m[1]);
    }
    const id: string | undefined = fixture?.id;
    if (id) {
      const m = id.match(/Matchday\s*(\d+)/i);
      if (m) return Number(m[1]);
    }
    return null;
  };

  const lastKnownPlayedMatchday = (() => {
    if (!localSelectedClubId) return null;
    let max = -1;
    for (const f of fixturesForUpcoming) {
      const homeId = normalizeFixtureClubId(f.homeClubId);
      const awayId = normalizeFixtureClubId(f.awayClubId);
      if (homeId !== localSelectedClubId && awayId !== localSelectedClubId) continue;
      if (!f.kickoffAt) continue;
      const d = new Date(f.kickoffAt);
      if (Number.isNaN(d.getTime())) continue;
      if (d.getTime() >= now.getTime()) continue;
      const md = getMatchdayNumber(f);
      if (md !== null) max = Math.max(max, md);
    }
    return max >= 0 ? max : null;
  })();

  const tbdFixturesForUpcoming = (plFixtures ?? [])
    .filter((f) => f.kickoffAt === null)
    .filter((f) => {
      const homeId = normalizeFixtureClubId(f.homeClubId);
      const awayId = normalizeFixtureClubId(f.awayClubId);
      if (!fixtureTargetClubIds.includes(homeId) && !fixtureTargetClubIds.includes(awayId)) return false;
      const md = getMatchdayNumber(f);
      if (md === null) return false;
      if (lastKnownPlayedMatchday === null) return true;
      return md > lastKnownPlayedMatchday;
    });

  const upcomingFixturesAll = (() => {
    const filtered = [...fixturesForUpcoming, ...tbdFixturesForUpcoming].filter((f) => {
      const homeId = normalizeFixtureClubId(f.homeClubId);
      const awayId = normalizeFixtureClubId(f.awayClubId);
      return fixtureTargetClubIds.includes(homeId) || fixtureTargetClubIds.includes(awayId);
    });

    const byKey = new Map<string, (typeof filtered)[number]>();
    for (const f of filtered) {
      const homeId = normalizeFixtureClubId(f.homeClubId);
      const awayId = normalizeFixtureClubId(f.awayClubId);
      const md = getMatchdayNumber(f);
      const key = `${f.competitionId}|${homeId}|${awayId}|${md ?? 'na'}`;
      const existing = byKey.get(key);
      if (!existing) {
        byKey.set(key, f);
        continue;
      }
      const existingHasKickoff = Boolean(existing.kickoffAt);
      const nextHasKickoff = Boolean(f.kickoffAt);
      if (!existingHasKickoff && nextHasKickoff) {
        byKey.set(key, f);
      }
    }

    return Array.from(byKey.values())
      .map((f) => {
        const normalizedFixture = {
          ...f,
          homeClubId: normalizeFixtureClubId(f.homeClubId),
          awayClubId: normalizeFixtureClubId(f.awayClubId),
        };
        return {
          fixture: normalizedFixture,
          kickoffDate: normalizedFixture.kickoffAt ? new Date(normalizedFixture.kickoffAt) : null,
        };
      })
      .filter(({ kickoffDate }) => {
        if (!kickoffDate) return true;
        if (Number.isNaN(kickoffDate.getTime())) return false;
        if (kickoffDate.getTime() <= now.getTime()) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.kickoffDate && b.kickoffDate) return a.kickoffDate.getTime() - b.kickoffDate.getTime();
        if (a.kickoffDate && !b.kickoffDate) return -1;
        if (!a.kickoffDate && b.kickoffDate) return 1;
        const amd = getMatchdayNumber(a.fixture) ?? 999;
        const bmd = getMatchdayNumber(b.fixture) ?? 999;
        return amd - bmd;
      });
  })();

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
