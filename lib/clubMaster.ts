export type ClubId =
  | 'ars'
  | 'che'
  | 'tot'
  | 'mc'
  | 'mu'
  | 'liv'
  | 'new'
  | 'bha'
  | 'nfo';

export type ClubMasterEntry = {
  id: ClubId;
  nameJa: string;
  nameEn: string;
  league: 'premier-league';
  logoSrc: string;
};

export const premierLeagueClubs: Record<ClubId, ClubMasterEntry> = {
  ars: {
    id: 'ars',
    nameJa: 'アーセナル',
    nameEn: 'Arsenal',
    league: 'premier-league',
    logoSrc: '/チーム/アーセナル.webp',
  },
  che: {
    id: 'che',
    nameJa: 'チェルシー',
    nameEn: 'Chelsea',
    league: 'premier-league',
    logoSrc: '/チーム/チェルシー.webp',
  },
  tot: {
    id: 'tot',
    nameJa: 'トッテナム',
    nameEn: 'Tottenham Hotspur',
    league: 'premier-league',
    logoSrc: '/チーム/トッテナム.webp',
  },
  mc: {
    id: 'mc',
    nameJa: 'マンチェスター・シティ',
    nameEn: 'Manchester City',
    league: 'premier-league',
    logoSrc: '/チーム/マンチェスターシティ.webp',
  },
  mu: {
    id: 'mu',
    nameJa: 'マンチェスター・ユナイテッド',
    nameEn: 'Manchester United',
    league: 'premier-league',
    logoSrc: '/チーム/マンチェスターユナイテッド.webp',
  },
  liv: {
    id: 'liv',
    nameJa: 'リバプール',
    nameEn: 'Liverpool',
    league: 'premier-league',
    logoSrc: '/チーム/リバプール.webp',
  },
  new: {
    id: 'new',
    nameJa: 'ニューカッスル',
    nameEn: 'Newcastle United',
    league: 'premier-league',
    logoSrc: '/チーム/ニューカッスル.webp',
  },
  bha: {
    id: 'bha',
    nameJa: 'ブライトン',
    nameEn: 'Brighton & Hove Albion',
    league: 'premier-league',
    logoSrc: '/チーム/ブライトン.webp',
  },
  nfo: {
    id: 'nfo',
    nameJa: 'ノッティンガム・フォレスト',
    nameEn: 'Nottingham Forest',
    league: 'premier-league',
    logoSrc: '/チーム/N.フォレスト.png',
  },
};

export function getPremierLeagueClubById(id: string) {
  return (premierLeagueClubs as Record<string, ClubMasterEntry | undefined>)[id];
}
