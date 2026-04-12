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
  // NOTE: Next.js special opengraph-image route can return 200 with 0-byte body on some deployments.
  // Use stable nodejs API route for actual PNG generation.
  const url = `/api/wc2026-og/${encodeURIComponent(countrySlug)}/${encodeURIComponent(shareId)}`;
  return Response.redirect(url, 307);
}
