export type ClubId =
  | 'ars'
  | 'avl'
  | 'bou'
  | 'bre'
  | 'che'
  | 'cry'
  | 'eve'
  | 'ful'
  | 'lee'
  | 'sun'
  | 'bur'
  | 'whu'
  | 'wol'
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
  avl: {
    id: 'avl',
    nameJa: 'アストン・ヴィラ',
    nameEn: 'Aston Villa',
    league: 'premier-league',
    logoSrc: '/チーム/アストン・ヴィラ.webp',
  },
  bou: {
    id: 'bou',
    nameJa: 'ボーンマス',
    nameEn: 'AFC Bournemouth',
    league: 'premier-league',
    logoSrc: '/チーム/ボーンマス.webp',
  },
  bre: {
    id: 'bre',
    nameJa: 'ブレントフォード',
    nameEn: 'Brentford',
    league: 'premier-league',
    logoSrc: '/チーム/ブレントフォード.webp',
  },
  che: {
    id: 'che',
    nameJa: 'チェルシー',
    nameEn: 'Chelsea',
    league: 'premier-league',
    logoSrc: '/チーム/チェルシー.webp',
  },
  cry: {
    id: 'cry',
    nameJa: 'クリスタル・パレス',
    nameEn: 'Crystal Palace',
    league: 'premier-league',
    logoSrc: '/チーム/クリスタルパレス.webp',
  },
  eve: {
    id: 'eve',
    nameJa: 'エバートン',
    nameEn: 'Everton',
    league: 'premier-league',
    logoSrc: '/チーム/エバートン.webp',
  },
  ful: {
    id: 'ful',
    nameJa: 'フルハム',
    nameEn: 'Fulham',
    league: 'premier-league',
    logoSrc: '/チーム/フラム.webp',
  },
  lee: {
    id: 'lee',
    nameJa: 'リーズ',
    nameEn: 'Leeds United',
    league: 'premier-league',
    logoSrc: '/チーム/リーズ.webp',
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
  sun: {
    id: 'sun',
    nameJa: 'サンダーランド',
    nameEn: 'Sunderland',
    league: 'premier-league',
    logoSrc: '/チーム/サンダーランド.webp',
  },
  bur: {
    id: 'bur',
    nameJa: 'バーンリー',
    nameEn: 'Burnley',
    league: 'premier-league',
    logoSrc: '/チーム/バーンリー.webp',
  },
  whu: {
    id: 'whu',
    nameJa: 'ウェストハム',
    nameEn: 'West Ham United',
    league: 'premier-league',
    logoSrc: '/チーム/ウェストハム.webp',
  },
  wol: {
    id: 'wol',
    nameJa: 'ウォルバーハンプトン',
    nameEn: 'Wolverhampton Wanderers',
    league: 'premier-league',
    logoSrc: '/チーム/ウルブス.webp',
  },
};

export function getPremierLeagueClubById(id: string) {
  return (premierLeagueClubs as Record<string, ClubMasterEntry | undefined>)[id];
}
