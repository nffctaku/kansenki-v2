// スタジアムデータ型定義
export interface Stadium {
  name: string;
  team: string;
  coords: {
    lat: number;
    lng: number;
  };
  type: 'stadium';
  capacity?: number;
  opened?: number;
}

// プレミアリーグ例
export const premierLeagueStadiums: Stadium[] = [
  {
    name: 'Old Trafford',
    team: 'Manchester United',
    coords: { lat: 53.4631, lng: -2.2913 },
    type: 'stadium',
    capacity: 74879,
    opened: 1910,
  },
  // 必要に応じて他のスタジアムも追加
];

export const championshipStadiums: Stadium[] = [];
export const serieAStadiums: Stadium[] = [];
export const serieBStadiums: Stadium[] = [];
export const ligue1Stadiums: Stadium[] = [];
export const ligue2Stadiums: Stadium[] = [];
export const laLigaStadiums: Stadium[] = [];
export const segundaStadiums: Stadium[] = [];

export const mapCategories = {
  stadium: 'スタジアム',
  hotel: 'ホテル',
};

export type MapCategory = keyof typeof mapCategories;
