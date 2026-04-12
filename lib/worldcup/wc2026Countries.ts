export type Wc2026CountryCode = 'jpn' | 'eng' | 'bra' | 'ger' | 'fra' | 'esp';

export type Wc2026Country = {
  code: Wc2026CountryCode;
  nameJa: string;
  nameEn: string;
  slug: string;
  flagEmoji: string;
};

export const WC2026_COUNTRIES: Wc2026Country[] = [
  { code: 'jpn', nameJa: '日本', nameEn: 'Japan', slug: 'japan', flagEmoji: '🇯🇵' },
  { code: 'eng', nameJa: 'イングランド', nameEn: 'England', slug: 'england', flagEmoji: '🏴' },
  { code: 'bra', nameJa: 'ブラジル', nameEn: 'Brazil', slug: 'brazil', flagEmoji: '🇧🇷' },
  { code: 'ger', nameJa: 'ドイツ', nameEn: 'Germany', slug: 'germany', flagEmoji: '🇩🇪' },
  { code: 'fra', nameJa: 'フランス', nameEn: 'France', slug: 'france', flagEmoji: '🇫🇷' },
  { code: 'esp', nameJa: 'スペイン', nameEn: 'Spain', slug: 'spain', flagEmoji: '🇪🇸' },
];

export function getWc2026CountryBySlug(slug: string) {
  return WC2026_COUNTRIES.find((c) => c.slug === slug) ?? null;
}
