// Premier League 2024-25 Stadium Data
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

export const premierLeagueStadiums: Stadium[] = [
  {
    name: "Emirates Stadium",
    team: "Arsenal",
    coords: { lat: 51.5549, lng: -0.1084 },
    type: "stadium",
    capacity: 60704,
    opened: 2006
  },
  {
    name: "Villa Park",
    team: "Aston Villa",
    coords: { lat: 52.5092, lng: -1.8848 },
    type: "stadium",
    capacity: 42749,
    opened: 1897
  },
  {
    name: "Vitality Stadium",
    team: "AFC Bournemouth",
    coords: { lat: 50.7352, lng: -1.8384 },
    type: "stadium",
    capacity: 11379,
    opened: 1910
  },
  {
    name: "Gtech Community Stadium",
    team: "Brentford",
    coords: { lat: 51.4907, lng: -0.2889 },
    type: "stadium",
    capacity: 17250,
    opened: 2020
  },
  {
    name: "Amex Stadium",
    team: "Brighton & Hove Albion",
    coords: { lat: 50.8609, lng: -0.0834 },
    type: "stadium",
    capacity: 31800,
    opened: 2011
  },
  {
    name: "Stamford Bridge",
    team: "Chelsea",
    coords: { lat: 51.4816, lng: -0.1909 },
    type: "stadium",
    capacity: 40834,
    opened: 1877
  },
  {
    name: "Selhurst Park",
    team: "Crystal Palace",
    coords: { lat: 51.3983, lng: -0.0856 },
    type: "stadium",
    capacity: 25486,
    opened: 1924
  },
  {
    name: "Goodison Park",
    team: "Everton",
    coords: { lat: 53.4386, lng: -2.9663 },
    type: "stadium",
    capacity: 39414,
    opened: 1892
  },
  {
    name: "Craven Cottage",
    team: "Fulham",
    coords: { lat: 51.4749, lng: -0.2217 },
    type: "stadium",
    capacity: 19359,
    opened: 1896
  },
  {
    name: "Portman Road",
    team: "Ipswich Town",
    coords: { lat: 52.0550, lng: 1.1447 },
    type: "stadium",
    capacity: 30311,
    opened: 1884
  },
  {
    name: "King Power Stadium",
    team: "Leicester City",
    coords: { lat: 52.6204, lng: -1.1420 },
    type: "stadium",
    capacity: 32312,
    opened: 2002
  },
  {
    name: "Anfield",
    team: "Liverpool",
    coords: { lat: 53.4308, lng: -2.9609 },
    type: "stadium",
    capacity: 61276,
    opened: 1884
  },
  {
    name: "Etihad Stadium",
    team: "Manchester City",
    coords: { lat: 53.4831, lng: -2.2004 },
    type: "stadium",
    capacity: 55017,
    opened: 2002
  },
  {
    name: "Old Trafford",
    team: "Manchester United",
    coords: { lat: 53.4631, lng: -2.2914 },
    type: "stadium",
    capacity: 74310,
    opened: 1910
  },
  {
    name: "St. James' Park",
    team: "Newcastle United",
    coords: { lat: 54.9756, lng: -1.6217 },
    type: "stadium",
    capacity: 52305,
    opened: 1892
  },
  {
    name: "City Ground",
    team: "Nottingham Forest",
    coords: { lat: 52.9400, lng: -1.1327 },
    type: "stadium",
    capacity: 30445,
    opened: 1898
  },
  {
    name: "St. Mary's Stadium",
    team: "Southampton",
    coords: { lat: 50.9059, lng: -1.3909 },
    type: "stadium",
    capacity: 32384,
    opened: 2001
  },
  {
    name: "Tottenham Hotspur Stadium",
    team: "Tottenham Hotspur",
    coords: { lat: 51.6042, lng: -0.0664 },
    type: "stadium",
    capacity: 62850,
    opened: 2019
  },
  {
    name: "London Stadium",
    team: "West Ham United",
    coords: { lat: 51.5386, lng: -0.0166 },
    type: "stadium",
    capacity: 66000,
    opened: 2016
  },
  {
    name: "Molineux Stadium",
    team: "Wolverhampton Wanderers",
    coords: { lat: 52.5903, lng: -2.1302 },
    type: "stadium",
    capacity: 31700,
    opened: 1889
  }
];

export const championshipStadiums: Stadium[] = [
  {
    name: "The Hawthorns",
    team: "West Bromwich Albion",
    coords: { lat: 52.5089, lng: -1.9639 },
    type: "stadium",
    capacity: 26850,
    opened: 1900
  },
  {
    name: "Carrow Road",
    team: "Norwich City",
    coords: { lat: 52.6220, lng: 1.3081 },
    type: "stadium",
    capacity: 27244,
    opened: 1935
  },
  {
    name: "Elland Road",
    team: "Leeds United",
    coords: { lat: 53.7776, lng: -1.5724 },
    type: "stadium",
    capacity: 37890,
    opened: 1919
  },
  {
    name: "Riverside Stadium",
    team: "Middlesbrough",
    coords: { lat: 54.5781, lng: -1.2169 },
    type: "stadium",
    capacity: 34742,
    opened: 1995
  },
  {
    name: "Bramall Lane",
    team: "Sheffield United",
    coords: { lat: 53.3704, lng: -1.4708 },
    type: "stadium",
    capacity: 32702,
    opened: 1889
  },
  {
    name: "Hillsborough Stadium",
    team: "Sheffield Wednesday",
    coords: { lat: 53.4118, lng: -1.5007 },
    type: "stadium",
    capacity: 39732,
    opened: 1899
  },
  {
    name: "Ashton Gate Stadium",
    team: "Bristol City",
    coords: { lat: 51.4400, lng: -2.6200 },
    type: "stadium",
    capacity: 27000,
    opened: 1904
  },
  {
    name: "Cardiff City Stadium",
    team: "Cardiff City",
    coords: { lat: 51.4728, lng: -3.2034 },
    type: "stadium",
    capacity: 33280,
    opened: 2009
  },
  {
    name: "Swansea.com Stadium",
    team: "Swansea City",
    coords: { lat: 51.6421, lng: -3.9681 },
    type: "stadium",
    capacity: 21088,
    opened: 2005
  },
  {
    name: "Deepdale",
    team: "Preston North End",
    coords: { lat: 53.7722, lng: -2.6889 },
    type: "stadium",
    capacity: 23404,
    opened: 1878
  },
  {
    name: "Ewood Park",
    team: "Blackburn Rovers",
    coords: { lat: 53.7286, lng: -2.4894 },
    type: "stadium",
    capacity: 31367,
    opened: 1890
  },
  {
    name: "Turf Moor",
    team: "Burnley",
    coords: { lat: 53.7890, lng: -2.2300 },
    type: "stadium",
    capacity: 21944,
    opened: 1883
  },
  {
    name: "Oakwell Stadium",
    team: "Barnsley",
    coords: { lat: 53.5522, lng: -1.4678 },
    type: "stadium",
    capacity: 23287,
    opened: 1888
  },
  {
    name: "The Den",
    team: "Millwall",
    coords: { lat: 51.4859, lng: -0.0510 },
    type: "stadium",
    capacity: 20146,
    opened: 1993
  },
  {
    name: "Loftus Road",
    team: "Queens Park Rangers",
    coords: { lat: 51.5093, lng: -0.2319 },
    type: "stadium",
    capacity: 18439,
    opened: 1917
  },
  {
    name: "Kenilworth Road",
    team: "Luton Town",
    coords: { lat: 51.8844, lng: -0.4317 },
    type: "stadium",
    capacity: 10356,
    opened: 1905
  },
  {
    name: "Vicarage Road",
    team: "Watford",
    coords: { lat: 51.6500, lng: -0.4017 },
    type: "stadium",
    capacity: 22220,
    opened: 1922
  },
  {
    name: "Stadium MK",
    team: "Milton Keynes Dons",
    coords: { lat: 52.0089, lng: -0.7333 },
    type: "stadium",
    capacity: 30500,
    opened: 2007
  },
  {
    name: "Fratton Park",
    team: "Portsmouth",
    coords: { lat: 50.7964, lng: -1.0639 },
    type: "stadium",
    capacity: 20899,
    opened: 1898
  },
  {
    name: "Home Park",
    team: "Plymouth Argyle",
    coords: { lat: 50.3881, lng: -4.1506 },
    type: "stadium",
    capacity: 17500,
    opened: 1901
  },
  {
    name: "Kassam Stadium",
    team: "Oxford United",
    coords: { lat: 51.7167, lng: -1.2083 },
    type: "stadium",
    capacity: 12500,
    opened: 2001
  },
  {
    name: "Coventry Building Society Arena",
    team: "Coventry City",
    coords: { lat: 52.4489, lng: -1.5000 },
    type: "stadium",
    capacity: 32609,
    opened: 2005
  },
  {
    name: "The Valley",
    team: "Derby County",
    coords: { lat: 52.9150, lng: -1.4472 },
    type: "stadium",
    capacity: 33597,
    opened: 1895
  },
  {
    name: "Wycombe Wanderers Stadium",
    team: "Wycombe Wanderers",
    coords: { lat: 51.6306, lng: -0.8000 },
    type: "stadium",
    capacity: 10000,
    opened: 1990
  }
];

// All stadiums combined
export const allStadiums = {
  premierLeague: premierLeagueStadiums,
  championship: championshipStadiums
};

// Future expansion: other categories
export interface MapLocation {
  name: string;
  coords: {
    lat: number;
    lng: number;
  };
  type: 'stadium' | 'hotel' | 'spot' | 'station';
  team?: string;
  category?: string;
  description?: string;
}

export const mapCategories = {
  stadium: 'スタジアム',
  hotel: 'ホテル',
  spot: 'おすすめスポット',
  station: '最寄駅'
} as const;

export type MapCategory = keyof typeof mapCategories;
