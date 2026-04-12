import { ImageResponse } from 'next/og';
import { headers } from 'next/headers';
import { getWc2026CountryBySlug } from '@/lib/worldcup/wc2026Countries';
import type { SquadPlayerPrediction, SquadStatus } from '@/types/worldcup';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

function getBaseUrlFromHeaders() {
  try {
    const h = headers();
    const host = h.get('x-forwarded-host') ?? h.get('host');
    const proto = h.get('x-forwarded-proto') ?? 'https';
    if (host) return `${proto}://${host}`;
  } catch {
    // ignore
  }
  return 'https://www.footballtop.net';
}

function statusMark(status: SquadStatus) {
  if (status === 'S') return '◎';
  if (status === 'A') return '○';
  if (status === 'B') return '△';
  return '★';
}

export default async function Image({ params }: { params: { country: string; shareId: string } }) {
  const { country: countrySlug, shareId } = params;

  const finalFallback = () =>
    new ImageResponse(
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
            <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -0.5 }}>WC2026 Squad</div>
            <div style={{ marginTop: 10, fontSize: 24, opacity: 0.8 }}>Share Image</div>
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

  try {
    const country = getWc2026CountryBySlug(countrySlug);

    let players: SquadPlayerPrediction[] = [];
    try {
      const baseUrl = getBaseUrlFromHeaders();
      const res = await fetch(`${baseUrl}/api/wc2026-share/${shareId}`, { cache: 'no-store' });
      if (res.ok) {
        const data = (await res.json()) as any;
        const loaded = Array.isArray(data?.players) ? data.players : [];
        players = loaded
          .filter((p: any) => p && typeof p.name === 'string' && typeof p.status === 'string')
          .map((p: any) => ({
            id: typeof p.id === 'string' ? p.id : '',
            name: p.name,
            position: p.position,
            status: p.status,
            note: typeof p.note === 'string' ? p.note : undefined,
          }));
      }
    } catch {
      players = [];
    }

    const picked = players.filter((p) => p.status === 'S' || p.status === 'A' || p.status === 'B' || p.status === '!?');
    const sortRank = (s: SquadStatus) => (s === 'S' ? 0 : s === 'A' ? 1 : s === 'B' ? 2 : 3);
    const ordered = [...picked].sort((a, b) => {
      const r = sortRank(a.status) - sortRank(b.status);
      if (r !== 0) return r;
      return a.name.localeCompare(b.name, 'ja');
    });

    const top = ordered.slice(0, 18);

    const title = country ? `${country.nameEn.toUpperCase()} WC2026` : 'WC2026';

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
            <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -0.5 }}>{title}</div>
            <div style={{ marginTop: 10, fontSize: 24, opacity: 0.8 }}>Squad Prediction</div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 18,
              padding: 24,
              borderRadius: 24,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.06)',
            }}
          >
            {top.length === 0 ? (
              <div style={{ fontSize: 28, opacity: 0.8 }}>No picks yet</div>
            ) : (
              top.map((p) => (
                <div
                  key={`${p.id}-${p.name}`}
                  style={{
                    width: 360,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 16,
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}
                >
                  <div style={{ fontSize: 26, fontWeight: 800 }}>{p.name}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, opacity: 0.9 }}>{statusMark(p.status)}</div>
                </div>
              ))
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 22, opacity: 0.8 }}>footballtop.net</div>
            <div style={{ fontSize: 22, opacity: 0.8 }}>S:◎ A:○ B:△ ?:★</div>
          </div>
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
  } catch {
    return finalFallback();
  }
}
