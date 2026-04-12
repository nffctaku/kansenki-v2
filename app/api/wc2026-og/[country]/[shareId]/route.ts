import { ImageResponse } from 'next/og';
import React from 'react';
import { getWc2026CountryBySlug } from '@/lib/worldcup/wc2026Countries';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Context = {
  params: { country: string; shareId: string };
};

type SharePlayer = {
  id?: string;
  name?: string;
  position?: string;
  status?: string;
};

function statusMark(status: string | undefined) {
  if (status === 'S') return '◎';
  if (status === 'A') return '○';
  if (status === 'B') return '△';
  return '★';
}

function safeName(v: unknown) {
  return typeof v === 'string' ? v.trim() : '';
}

export async function GET(_req: Request, context: Context) {
  try {
    const { country: countrySlug, shareId } = context.params;
    const country = getWc2026CountryBySlug(countrySlug);
    const title = country ? `${country.nameEn.toUpperCase()} WC2026` : 'WC2026';
    const sub = `share:${shareId.slice(0, 8)}`;

    const origin = (() => {
      try {
        return new URL(_req.url).origin;
      } catch {
        return 'https://www.footballtop.net';
      }
    })();

    let players: SharePlayer[] = [];
    try {
      const res = await fetch(`${origin}/api/wc2026-share/${encodeURIComponent(shareId)}`, { cache: 'no-store' });
      if (res.ok) {
        const data = (await res.json()) as any;
        players = Array.isArray(data?.players) ? data.players : [];
      }
    } catch {
      players = [];
    }

    const picked = players
      .map((p) => ({
        name: safeName(p?.name),
        status: typeof p?.status === 'string' ? p.status : undefined,
      }))
      .filter((p) => p.name);

    const rank = (s: string | undefined) => (s === 'S' ? 0 : s === 'A' ? 1 : s === 'B' ? 2 : 3);
    const ordered = [...picked]
      .sort((a, b) => {
        const r = rank(a.status) - rank(b.status);
        if (r !== 0) return r;
        return a.name.localeCompare(b.name, 'ja');
      })
      .slice(0, 18);

    const root = React.createElement(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, #020617 0%, #0b1533 50%, #070d1f 100%)',
          color: 'white',
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      },
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
          },
        },
        React.createElement('div', { style: { fontSize: 54, fontWeight: 800, letterSpacing: -0.5 } }, title),
        React.createElement('div', { style: { marginTop: 12, fontSize: 28, opacity: 0.85 } }, 'Squad Prediction'),
        React.createElement('div', { style: { marginTop: 10, fontSize: 22, opacity: 0.65 } }, sub)
      ),
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            padding: 24,
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.06)',
          },
        },
        ordered.length === 0
          ? React.createElement('div', { style: { fontSize: 28, opacity: 0.85, display: 'flex' } }, 'No picks yet')
          : ordered.map((p, idx) =>
              React.createElement(
                'div',
                {
                  key: `${idx}-${p.name}`,
                  style: {
                    width: 350,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 16,
                    background: 'rgba(0,0,0,0.22)',
                    border: '1px solid rgba(255,255,255,0.10)',
                  },
                },
                React.createElement('div', { style: { fontSize: 26, fontWeight: 800, display: 'flex' } }, p.name),
                React.createElement('div', { style: { fontSize: 26, fontWeight: 800, opacity: 0.9, display: 'flex' } }, statusMark(p.status))
              )
            )
      ),
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        },
        React.createElement('div', { style: { fontSize: 22, opacity: 0.8, display: 'flex' } }, 'footballtop.net'),
        React.createElement('div', { style: { fontSize: 22, opacity: 0.8, display: 'flex' } }, 'S:◎ A:○ B:△ ?:★')
      )
    );

    const image = new ImageResponse(root, {
      width: 1200,
      height: 630,
    });

    const buf = await image.arrayBuffer();
    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store, max-age=0',
        'Content-Length': String(buf.byteLength),
      },
    });
  } catch (e: any) {
    return new Response(typeof e?.stack === 'string' ? e.stack : 'failed', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
}
