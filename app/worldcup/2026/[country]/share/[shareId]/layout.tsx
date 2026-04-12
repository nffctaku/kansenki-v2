import { doc, getDoc } from 'firebase/firestore';
import type { Metadata, ResolvingMetadata } from 'next';
import { db } from '@/lib/firebase';
import { getWc2026CountryBySlug } from '@/lib/worldcup/wc2026Countries';

type Props = {
  params: { country: string; shareId: string };
};

export const runtime = 'nodejs';

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { country: countrySlug, shareId } = params;
  const country = getWc2026CountryBySlug(countrySlug);

  const fallbackTitle = country ? `${country.nameJa}：W杯2026 予想` : 'W杯2026 予想';

  try {
    const ref = doc(db, 'wc2026PredictionShares', shareId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return { title: '共有ページが見つかりません' };
    }

    const title = fallbackTitle;
    const description = 'W杯2026 予想メンバー';
    const baseUrl = 'https://kansenki.footballtop.net';
    const pageUrl = `${baseUrl}/worldcup/2026/${countrySlug}/share/${shareId}`;
    const imageUrl = `${baseUrl}/worldcup/2026/${countrySlug}/share/${shareId}/opengraph-image`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
        type: 'article',
        url: pageUrl,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: fallbackTitle,
    };
  }
}

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
