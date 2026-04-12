import { ImageResponse } from 'next/og';
import { getWc2026CountryBySlug } from '@/lib/worldcup/wc2026Countries';
import type { SquadStatus } from '@/types/worldcup';

export const runtime = 'edge';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

function statusMark(status: SquadStatus) {
  if (status === 'S') return '◎';
  if (status === 'A') return '○';
  if (status === 'B') return '△';
  return '★';
}

export default async function Image({ params }: { params: { country: string; shareId: string } }) {
  const { country: countrySlug, shareId } = params;
  const country = getWc2026CountryBySlug(countrySlug);
  const title = country ? `${country.nameEn.toUpperCase()} WC2026` : 'WC2026';
  const sub = `share:${shareId.slice(0, 8)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, #020617 0%, #0b1533 50%, #070d1f 100%)',
          color: 'white',
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 54, fontWeight: 800, letterSpacing: -0.5 }}>{title}</div>
          <div style={{ marginTop: 12, fontSize: 28, opacity: 0.85 }}>Squad Prediction</div>
          <div style={{ marginTop: 10, fontSize: 22, opacity: 0.65 }}>{sub}</div>
        </div>

        <div style={{ fontSize: 22, opacity: 0.8 }}>footballtop.net</div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
