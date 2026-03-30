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
  heroImageSrc?: string;
  heroKickerLabel?: string;
  heroTitle?: string;
  heroDescription?: string;
  detailUrl?: string;
  ctaLabel?: string;
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
    heroKickerLabel: '親善試合',
    heroTitle: 'W杯優勝候補のイングランドと16年ぶりの激突',
    heroDescription: '世界最強選手たちを相手にどう戦うか！？\n注目の一戦は4月1日(水)3:15頃開始',
    heroImageSrc: '/名称未設定のデザイン (29).png',
    ctaLabel: '詳細を見る',
    detailUrl: '/timeline',
  },
  {
    id: 'friendly-jpn-bra-2026-06-12',
    kickoffLabel: '4/1(金) 3:45',
    competitionLabel: 'W杯プレーオフ決勝パスA',
    venue: 'Stadion Bilino Polji',
    broadcasterLabel: '未定',
    homeCountryNameJa: 'ボスニアヘルツェゴビナ',
    awayCountryNameJa: 'イタリア',
    homeFlagSrc: '/国旗更新/JPN.png',
    awayFlagSrc: '/国旗更新/BRA.png',
    homeCountryCode: 'JPN',
    awayCountryCode: 'BRA',
    featured: true,
    watchUrl: 'https://video.unext.jp/',
    predictUrl: '/posts',
    comment: '南米王者とガチンコ',
    heroKickerLabel: 'W杯プレーオフ決勝パスA',
    heroTitle: '最後の切符を懸けた戦い',
    heroDescription: 'アズーリは再び世界の舞台へもどれるのか。\n注目の一戦は4月1日(金)3:45キックオフ。',
    heroImageSrc: '/名称未設定のデザイン (30).png',
    ctaLabel: '詳細を見る',
    detailUrl: '/timeline',
  },
  {
    id: 'kirin-jpn-fra-2026-06-16',
    kickoffLabel: '6/16(火) 19:30',
    competitionLabel: 'キリンチャレンジカップ2026',
    venue: 'Strawberry Arena',
    broadcasterLabel: '未定',
    homeCountryNameJa: '日本',
    awayCountryNameJa: 'フランス',
    homeFlagSrc: '/国旗更新/JPN.png',
    awayFlagSrc: '/国旗更新/FRA.png',
    homeCountryCode: 'JPN',
    awayCountryCode: 'FRA',
    featured: true,
    watchUrl: 'https://video.unext.jp/',
    predictUrl: '/posts',
    comment: '最強クラスとの連戦',
    heroKickerLabel: 'W杯プレーオフ決勝パスB',
    heroTitle: '日本の対戦相手が決まる注目のカード',
    heroDescription: '世界トップレベルのストライカーが激突。\n6月16日(火)19:30キックオフ。',
    heroImageSrc: '/名称未設定のデザイン (31).png',
    ctaLabel: '詳細を見る',
    detailUrl: '/timeline',
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
