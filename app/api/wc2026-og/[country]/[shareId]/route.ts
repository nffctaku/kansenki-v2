import { ImageResponse } from 'next/og';
import React from 'react';
import { getWc2026CountryBySlug } from '@/lib/worldcup/wc2026Countries';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Context = {
  params: { country: string; shareId: string };
};

export async function GET(_req: Request, context: Context) {
  try {
    const { country: countrySlug, shareId } = context.params;
    const country = getWc2026CountryBySlug(countrySlug);
    const title = country ? `${country.nameEn.toUpperCase()} WC2026` : 'WC2026';
    const sub = `share:${shareId.slice(0, 8)}`;

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
        null,
        React.createElement('div', { style: { fontSize: 54, fontWeight: 800, letterSpacing: -0.5 } }, title),
        React.createElement('div', { style: { marginTop: 12, fontSize: 28, opacity: 0.85 } }, 'Squad Prediction'),
        React.createElement('div', { style: { marginTop: 10, fontSize: 22, opacity: 0.65 } }, sub)
      ),
      React.createElement('div', { style: { fontSize: 22, opacity: 0.8 } }, 'footballtop.net')
    );

    return new ImageResponse(root, {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
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
