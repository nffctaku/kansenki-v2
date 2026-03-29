'use client';

import Link from 'next/link';
import AnnouncementBanner from '../components/AnnouncementBanner';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { getPremierLeagueClubById } from '@/lib/clubMaster';
export default function HomePage() {
  const { user, userProfile, loading } = useAuth();

  const favoriteClubIds = userProfile?.favoriteClubIds ?? [];
  const favoritePlayerIds = userProfile?.favoritePlayerIds ?? [];

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

      <div className="px-3 pt-4">
        <div className="mb-3">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">ホーム</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            目的別にコンテンツへショートカット
          </div>
        </div>

        <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">お気に入りクラブ</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">FAVORITES</div>
            </div>

            {loading ? (
              <div className="rounded-xl px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                読み込み中...
              </div>
            ) : !user ? (
              <Link
                href="/login"
                className="block rounded-xl px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                ログインしてお気に入りを使う
              </Link>
            ) : favoriteClubIds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {favoriteClubIds.slice(0, 12).map((id) => (
                  (() => {
                    const club = getPremierLeagueClubById(id);
                    if (!club) {
                      return (
                        <span
                          key={id}
                          className="rounded-full px-3 py-1 text-xs bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                        >
                          {id}
                        </span>
                      );
                    }

                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-2 rounded-full pl-2 pr-3 py-1 text-xs bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                      >
                        <span className="relative w-5 h-5">
                          <Image
                            src={club.logoSrc}
                            alt={club.nameJa}
                            fill
                            sizes="20px"
                            className="object-contain"
                          />
                        </span>
                        <span className="max-w-[9rem] truncate">{club.nameJa}</span>
                      </span>
                    );
                  })()
                ))}
                <Link
                  href="/mypage"
                  className="rounded-full px-3 py-1 text-xs bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  編集
                </Link>
              </div>
            ) : (
              <Link
                href="/mypage"
                className="block rounded-xl px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                お気に入りクラブを設定する
              </Link>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">お気に入り選手</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">FAVORITES</div>
            </div>

            {loading ? (
              <div className="rounded-xl px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                読み込み中...
              </div>
            ) : !user ? (
              <Link
                href="/login"
                className="block rounded-xl px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                ログインしてお気に入りを使う
              </Link>
            ) : favoritePlayerIds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {favoritePlayerIds.slice(0, 12).map((id) => (
                  <span
                    key={id}
                    className="rounded-full px-3 py-1 text-xs bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                  >
                    {id}
                  </span>
                ))}
                <Link
                  href="/mypage"
                  className="rounded-full px-3 py-1 text-xs bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  編集
                </Link>
              </div>
            ) : (
              <div className="rounded-xl px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                準備中
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {widgets.map((widget) => (
            <div
              key={widget.title}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {widget.title}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">MENU</div>
              </div>

              {widget.items.length > 0 ? (
                <div className="space-y-2">
                  {widget.items.map((item) => (
                    item.href ? (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block rounded-xl px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                      >
                        <span className="truncate">{item.label}</span>
                        <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">準備中</span>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <div className="rounded-xl px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  準備中
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
