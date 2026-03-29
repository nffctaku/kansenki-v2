export type ManualNationalMatch = {
  id: string;
  kickoffLabel: string;
  competitionLabel: string;
  venue: string;
  broadcasterLabel: string;
  homeCountryNameJa: string;
  awayCountryNameJa: string;
  homeFlagSrc?: string;
  awayFlagSrc?: string;
  homeCountryCode?: string;
  awayCountryCode?: string;
  featured?: boolean;
  watchUrl?: string;
  predictUrl?: string;
  comment?: string;
};

export const manualNationalMatches: ManualNationalMatch[] = [
  {
    id: 'friendly-eng-jpn-2026-04-01',
    kickoffLabel: '4/1(水) 3:45',
    competitionLabel: '親善試合',
    venue: 'ウェンブリースタジアム',
    broadcasterLabel: 'U-NEXT',
    homeCountryNameJa: 'イングランド',
    awayCountryNameJa: '日本',
    homeFlagSrc: '/国旗更新/ENG.png',
    awayFlagSrc: '/国旗更新/JPN.png',
    homeCountryCode: 'ENG',
    awayCountryCode: 'JPN',
    featured: true,
    watchUrl: 'https://video.unext.jp/',
    predictUrl: '/posts',
    comment: 'W杯優勝候補のイングランドと16年ぶりの激突',
  },
  {
    id: 'kirin-jpn-isl-2026-05-31',
    kickoffLabel: '5/31(日) 時間未定',
    competitionLabel: 'キリンチャレンジカップ2026',
    venue: 'MUFGスタジアム(国立競技場)',
    broadcasterLabel: '未定',
    homeCountryNameJa: '日本',
    awayCountryNameJa: 'アイスランド',
    homeFlagSrc: '/国旗更新/JPN.png',
    homeCountryCode: 'JPN',
    awayFlagSrc: '/国旗更新/Flag_of_Iceland.svg.png',
    awayCountryCode: 'ISL',
  },
  {
    id: 'wc-gf1-ned-jpn-2026-06-15',
    kickoffLabel: '6/15 5:00',
    competitionLabel: 'W杯グループF GS第1節',
    venue: 'AT&Tスタジアム',
    broadcasterLabel: 'DAZN',
    homeCountryNameJa: 'オランダ',
    awayCountryNameJa: '日本',
    homeFlagSrc: '/国旗更新/NED.png',
    awayFlagSrc: '/国旗更新/JPN.png',
    homeCountryCode: 'NED',
    awayCountryCode: 'JPN',
  },
];
