'use client';

import Link from 'next/link';
import AnnouncementBanner from '../components/AnnouncementBanner';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { getPremierLeagueClubById } from '@/lib/clubMaster';
import { manualFixtures } from '@/lib/fixtures/manualFixtures';
import { manualHighlights } from '@/lib/highlights/manualHighlights';
import { manualNationalMatches } from '@/lib/national/manualNationalMatches';
export default function HomePage() {
  const { user, userProfile, loading } = useAuth();

  const favoriteClubIds = userProfile?.favoriteClubIds ?? [];
  const favoritePlayerIds = userProfile?.favoritePlayerIds ?? [];

  const hasUclClub = favoriteClubIds.some((id) => ['mc', 'liv', 'tot', 'che', 'new', 'ars'].includes(id));
  const hasUelClub = favoriteClubIds.some((id) => ['avl', 'nfo'].includes(id));

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

  const upcomingFixtures = manualFixtures
    .filter((f) =>
      favoriteClubIds.includes(f.homeClubId) || favoriteClubIds.includes(f.awayClubId)
    )
    .map((f) => ({
      fixture: f,
      kickoffDate: f.kickoffAt ? new Date(f.kickoffAt) : null,
    }))
    .filter(({ kickoffDate }) => kickoffDate && kickoffDate.getTime() > now.getTime())
    .sort((a, b) => (a.kickoffDate!.getTime() - b.kickoffDate!.getTime()))
    .slice(0, 5);

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

  return (
    <>
      <AnnouncementBanner />

      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950">
        <div className="px-3 pt-4">
          <div className="mb-3">
            <h1 className="text-lg font-bold text-gray-100">ホーム</h1>
            <div className="text-sm text-gray-300">目的別にコンテンツへショートカット</div>
          </div>

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
                    return (
                      <div
                        key={id}
                        className="relative w-14 h-14 rounded-full bg-white/90 border border-white/15 shadow-sm shrink-0"
                        title={club.nameJa}
                      >
                        <Image
                          src={club.logoSrc}
                          alt={club.nameJa}
                          fill
                          sizes="56px"
                          className="object-contain p-2.5"
                        />
                      </div>
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

          <div className="mb-4">
            <div className="mb-2 text-sm font-bold text-gray-100">参加中の大会</div>
            <div className="flex items-center gap-3 overflow-x-auto max-w-full py-1">
              <div className="relative w-12 h-12 rounded-full bg-white/90 border border-white/15 shadow-sm shrink-0">
                <Image src="/大会ロゴ/PL.png" alt="Premier League" fill sizes="48px" className="object-contain p-2" />
              </div>
              <div className="relative w-12 h-12 rounded-full bg-white/90 border border-white/15 shadow-sm shrink-0">
                <Image src="/大会ロゴ/FA_Cup_logo_(2020).svg.png" alt="FA Cup" fill sizes="48px" className="object-contain p-2" />
              </div>
              {hasUclClub && (
                <div className="relative w-12 h-12 rounded-full bg-white/90 border border-white/15 shadow-sm shrink-0">
                  <Image src="/大会ロゴ/CL.png" alt="UEFA Champions League" fill sizes="48px" className="object-contain p-2" />
                </div>
              )}
              {hasUelClub && (
                <div className="relative w-12 h-12 rounded-full bg-white/90 border border-white/15 shadow-sm shrink-0">
                  <Image src="/大会ロゴ/EL.png" alt="UEFA Europa League" fill sizes="48px" className="object-contain p-2" />
                </div>
              )}
              <div className="relative w-12 h-12 rounded-full bg-white/90 border border-white/15 shadow-sm shrink-0">
                <Image src="/大会ロゴ/Carabao.png" alt="Carabao Cup" fill sizes="48px" className="object-contain p-2" />
              </div>
            </div>
          </div>

          {user && favoriteClubIds.length > 0 && (
            <div className="mb-5">
              <div className="mb-2 text-sm font-bold text-gray-100">お気に入りの今後の試合（手入力）</div>

              {upcomingFixtures.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/70">
                  手入力データがまだ無いか、直近の試合が登録されていません
                </div>
              ) : (
                <div className="flex items-stretch gap-3 overflow-x-auto max-w-full pb-1">
                  {upcomingFixtures.map(({ fixture, kickoffDate }) => {
                    const home = getPremierLeagueClubById(fixture.homeClubId);
                    const away = getPremierLeagueClubById(fixture.awayClubId);
                    const logoSrc = competitionLogoSrc[fixture.competitionId];
                    const broadcaster = broadcasterByCompetition[fixture.competitionId] ?? '';
                    const homeLabel = home?.nameJa ?? fixture.homeClubId.toUpperCase();
                    const awayLabel = away?.nameJa ?? fixture.awayClubId.toUpperCase();

                    return (
                      <div
                        key={fixture.id}
                        className="relative w-[260px] shrink-0 rounded-2xl border border-white/10 bg-white/10 px-3 py-3"
                      >
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
                  })}
                </div>
              )}
            </div>
          )}

          <div className="mb-6">
            <div className="mb-2 text-sm font-bold text-gray-100">MATCH HIGHLIGHT</div>
            <div className="flex items-stretch gap-3 overflow-x-auto max-w-full pb-1">
              {manualHighlights.map((h) => (
                <Link
                  key={h.id}
                  href={`https://www.youtube.com/watch?v=${h.youtubeVideoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block shrink-0"
                >
                  <div className="w-[190px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                    <div className="relative aspect-video w-full">
                      <Image
                        src={`https://i.ytimg.com/vi/${h.youtubeVideoId}/hqdefault.jpg`}
                        alt={h.label}
                        fill
                        sizes="190px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 px-2 py-2">
                      <div className="text-xs font-semibold text-gray-100 truncate">{h.label}</div>
                      {h.competitionId && (
                        <div className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                          {h.competitionId}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-2 text-sm font-bold text-gray-100">対戦カード</div>
            <div className="flex items-stretch gap-3 overflow-x-auto max-w-full pb-1">
              {manualNationalMatches.map((m) => (
                <div
                  key={m.id}
                  className="w-[320px] shrink-0 rounded-2xl border border-white/10 bg-white/10 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white/70">{m.competitionLabel}</div>
                      <div className="mt-1 text-sm font-bold text-gray-100">{m.kickoffLabel}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                        {m.broadcasterLabel}
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                        {m.venue}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/90">
                        {m.homeFlagSrc ? (
                          <Image src={m.homeFlagSrc} alt={m.homeCountryNameJa} fill sizes="40px" className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[10px] font-semibold text-slate-800">
                            {(m.homeCountryCode ?? '').toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-gray-100 truncate">{m.homeCountryNameJa}</div>
                    </div>

                    <div className="text-xs font-semibold text-white/60">vs</div>

                    <div className="flex items-center gap-2 min-w-0">
                      <div className="text-sm font-semibold text-gray-100 truncate">{m.awayCountryNameJa}</div>
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/90">
                        {m.awayFlagSrc ? (
                          <Image src={m.awayFlagSrc} alt={m.awayCountryNameJa} fill sizes="40px" className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[10px] font-semibold text-slate-800">
                            {(m.awayCountryCode ?? '').toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {widgets.map((widget) => (
              <div
                key={widget.title}
                className="bg-white/10 rounded-2xl shadow p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-bold text-gray-100">{widget.title}</div>
                  <div className="text-xs text-white/60">MENU</div>
                </div>

                {widget.items.length > 0 ? (
                  <div className="space-y-2">
                    {widget.items.map((item) => (
                      item.href ? (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="block rounded-xl px-3 py-2 text-sm bg-white/10 text-gray-100 hover:bg-white/15 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <div
                          key={item.label}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-sm bg-white/10 text-gray-200"
                        >
                          <span className="truncate">{item.label}</span>
                          <span className="ml-2 text-xs text-white/60">準備中</span>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl px-3 py-2 text-sm bg-white/10 text-white/70">準備中</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
