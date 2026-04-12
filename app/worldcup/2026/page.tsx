import Link from 'next/link';
import { WC2026_COUNTRIES } from '@/lib/worldcup/wc2026Countries';

export default function Wc2026IndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950">
      <div className="px-3 pt-4 pb-24">
        <div className="px-1 pb-3">
          <h1 className="text-lg font-bold text-white">W杯 2026 メンバー予想</h1>
          <div className="mt-1 text-xs text-white/60">ログインして国別に自分の予想を作成できます</div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {WC2026_COUNTRIES.map((c) => (
            <Link
              key={c.slug}
              href={`/worldcup/2026/${c.slug}`}
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-2xl">{c.flagEmoji}</div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-100 truncate">{c.nameJa}</div>
                    <div className="text-xs text-white/60 truncate">{c.nameEn}</div>
                  </div>
                </div>
                <div className="text-xs text-white/60">見る</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
