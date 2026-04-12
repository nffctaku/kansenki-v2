'use client';

import Link from 'next/link';

export default function JapanNationalXSection() {
  const curatedTweets: Array<{ id: string; label: string; excerpt?: string; publishedAt?: string }> = [
    {
      id: '2039042166862004322',
      label: 'SAMURAI BLUE',
      excerpt: undefined,
      publishedAt: undefined,
    },
  ];

  const profileUrl = 'https://x.com/jfa_samuraiblue?s=20';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-gray-100">日本代表 公式X</div>
            <div className="text-xs text-gray-300">@jfa_samuraiblue</div>
          </div>
          <Link
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-3 py-2 text-xs bg-white/10 text-gray-100 border border-white/10 hover:bg-white/15 transition-colors shrink-0"
          >
            プロフィール
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {curatedTweets.map((t) => (
            <div key={t.id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-sm text-gray-100 font-semibold">X</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm text-gray-100 truncate">{t.label}</div>
                      {t.publishedAt && <div className="text-xs text-gray-400 shrink-0">{t.publishedAt}</div>}
                    </div>
                    {t.excerpt ? (
                      <div className="mt-1 text-xs text-gray-200 leading-relaxed line-clamp-3">{t.excerpt}</div>
                    ) : (
                      <div className="mt-1 text-xs text-gray-300">ここに本文の抜粋を入れると、アプリ内で内容が見やすくなります。</div>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <Link
                        href={`https://x.com/jfa_samuraiblue/status/${t.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full px-3 py-2 text-xs bg-white/90 text-slate-900 hover:bg-white transition-colors"
                      >
                        ツイートを開く
                      </Link>
                      <Link
                        href={profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full px-3 py-2 text-xs bg-white/10 text-gray-100 border border-white/10 hover:bg-white/15 transition-colors"
                      >
                        公式Xへ
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
