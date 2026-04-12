import Link from 'next/link';
import { headers } from 'next/headers';
import { doc, getDoc } from 'firebase/firestore';
import { getServerDb } from '@/lib/firebaseServer';
import { getWc2026CountryBySlug } from '@/lib/worldcup/wc2026Countries';
import ShareImage from './ShareImage';

export const runtime = 'nodejs';

function getBaseUrlFromHeaders() {
  try {
    const h = headers();
    const host = h.get('x-forwarded-host') ?? h.get('host');
    const proto = h.get('x-forwarded-proto') ?? 'https';
    if (host) return `${proto}://${host}`;
  } catch {
    // ignore
  }
  return 'https://kansenki.footballtop.net';
}

type Props = {
  params: { country: string; shareId: string };
};

export default async function Wc2026SharePage({ params }: Props) {
  const { country: countrySlug, shareId } = params;
  const country = getWc2026CountryBySlug(countrySlug);

  const db = getServerDb();
  const baseUrl = getBaseUrlFromHeaders();
  const imageUrl = `${baseUrl}/worldcup/2026/${countrySlug}/share/${shareId}/opengraph-image?v=${shareId}`;

  const snap = db ? await getDoc(doc(db, 'wc2026PredictionShares', shareId)) : null;

  if (!snap || !snap.exists()) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950">
        <div className="px-3 pt-4 pb-24">
          <div className="text-sm text-white">共有ページが見つかりません</div>
          <div className="mt-3">
            <Link href="/worldcup/2026" className="text-sm text-white/80 underline">
              国一覧へ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950">
      <div className="px-3 pt-4 pb-24">
        <div className="px-1 pb-3 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-white">{country?.nameJa ?? 'W杯 2026'}：予想</h1>
            <div className="mt-1 text-xs text-white/60">共有用ページ</div>
          </div>
          <Link href="/worldcup/2026" className="text-xs text-white/70 underline shrink-0">
            国一覧
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 overflow-hidden">
          <div className="p-4">
            <div className="text-sm text-gray-100 font-semibold">予想画像</div>
            <ShareImage imageUrl={imageUrl} />

            <div className="mt-4">
              <Link
                href={`/worldcup/2026/${countrySlug}`}
                className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm bg-white text-slate-950 font-semibold"
              >
                予想する
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
