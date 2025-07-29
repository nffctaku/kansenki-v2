export interface Spot {
  id: string;
  name: string;
  category: string; //例: 'Restaurant', 'Museum', 'Park'
  coords: {
    lat: number;
    lng: number;
  };
  description: string;
  imageUrl?: string;
  type: 'spot';
}

export const recommendedSpots: Spot[] = [
  {
    id: 'spot-1',
    name: 'The Churchill Arms',
    category: 'Pub',
    coords: { lat: 51.5073, lng: -0.187  },
    description: '花で覆われた外観が有名な、本格的なタイ料理が楽しめるロンドンのパブ。',
    imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipO-m5tACf2t_g3ssoiM7p-QYh_2qI4o5p3xCj6g=s1360-w1360-h1020',
    type: 'spot',
  },
  {
    id: 'spot-2',
    name: 'Museo Nacional del Prado',
    category: 'Museum',
    coords: { lat: 40.4138, lng: -3.6921 },
    description: 'ベラスケス、ゴヤ、エル・グレコなど、スペイン絵画の巨匠たちの作品を収蔵するマドリードの国立美術館。',
    type: 'spot',
  },
  {
    id: 'spot-3',
    name: 'Tempio di Adriano',
    category: 'Historic Site',
    coords: { lat: 41.8996, lng: 12.4797 },
    description: '古代ローマのハドリアヌス帝に捧げられた神殿。現在はローマ証券取引所の一部として利用されている。',
    type: 'spot',
  },
  {
    id: 'spot-4',
    name: 'Hofbräuhaus München',
    category: 'Restaurant',
    coords: { lat: 48.1376, lng: 11.5798 },
    description: '世界で最も有名なビアホールの一つ。伝統的なバイエルン料理とビールが楽しめる。',
    type: 'spot',
  },
];
