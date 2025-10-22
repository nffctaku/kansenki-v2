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
  league?: string;
}

// プレミアリーグ
export const premierLeagueStadiums: Stadium[] = [
  { name: 'Arsenal - Emirates Stadium', team: 'Arsenal', coords: { lat: 51.5549, lng: -0.1084 }, type: 'stadium', capacity: 60704, opened: 2006, league: 'プレミアリーグ' },
  { name: 'Aston Villa - Villa Park', team: 'Aston Villa', coords: { lat: 52.5092, lng: -1.8840 }, type: 'stadium', capacity: 42682, opened: 1897, league: 'プレミアリーグ' },
  { name: 'Bournemouth - Vitality Stadium', team: 'AFC Bournemouth', coords: { lat: 50.7352, lng: -1.8380 }, type: 'stadium', capacity: 11329, opened: 1910, league: 'プレミアリーグ' },
  { name: 'Brentford - Gtech Community Stadium', team: 'Brentford', coords: { lat: 51.4906, lng: -0.2889 }, type: 'stadium', capacity: 17250, opened: 2020, league: 'プレミアリーグ' },
  { name: 'Brighton - Falmer Stadium', team: 'Brighton & Hove Albion', coords: { lat: 50.8616, lng: -0.0837 }, type: 'stadium', capacity: 31800, opened: 2011, league: 'プレミアリーグ' },
  { name: 'Burnley - Turf Moor', team: 'Burnley', coords: { lat: 53.7890, lng: -2.2300 }, type: 'stadium', capacity: 21944, opened: 1883, league: 'プレミアリーグ' },
  { name: 'Chelsea - Stamford Bridge', team: 'Chelsea', coords: { lat: 51.4816, lng: -0.1910 }, type: 'stadium', capacity: 40343, opened: 1877, league: 'プレミアリーグ' },
  { name: 'Crystal Palace - Selhurst Park', team: 'Crystal Palace', coords: { lat: 51.3983, lng: -0.0856 }, type: 'stadium', capacity: 25486, opened: 1924, league: 'プレミアリーグ' },
  { name: 'Everton - Goodison Park', team: 'Everton', coords: { lat: 53.4388, lng: -2.9664 }, type: 'stadium', capacity: 39414, opened: 1892, league: 'プレミアリーグ' },
  { name: 'Fulham - Craven Cottage', team: 'Fulham', coords: { lat: 51.4746, lng: -0.2216 }, type: 'stadium', capacity: 25700, opened: 1896, league: 'プレミアリーグ' },
  { name: 'Liverpool - Anfield', team: 'Liverpool', coords: { lat: 53.4308, lng: -2.9608 }, type: 'stadium', capacity: 54074, opened: 1884, league: 'プレミアリーグ' },
  { name: 'Leeds United - Elland Road', team: 'Leeds United', coords: { lat: 53.7778, lng: -1.5721 }, type: 'stadium', capacity: 37892, opened: 1897, league: 'プレミアリーグ' },
  { name: 'Man City - Etihad Stadium', team: 'Manchester City', coords: { lat: 53.4831, lng: -2.2004 }, type: 'stadium', capacity: 53400, opened: 2003, league: 'プレミアリーグ' },
  { name: 'Man United - Old Trafford', team: 'Manchester United', coords: { lat: 53.4631, lng: -2.2913 }, type: 'stadium', capacity: 74879, opened: 1910, league: 'プレミアリーグ' },
  { name: 'Newcastle - St James\' Park', team: 'Newcastle United', coords: { lat: 54.9756, lng: -1.6216 }, type: 'stadium', capacity: 52305, opened: 1892, league: 'プレミアリーグ' },
  { name: 'Nottingham Forest - City Ground', team: 'Nottingham Forest', coords: { lat: 52.9390, lng: -1.1321 }, type: 'stadium', capacity: 30445, opened: 1898, league: 'プレミアリーグ' },
  { name: 'Sunderland - Stadium of Light', team: 'Sunderland', coords: { lat: 54.9144, lng: -1.3880 }, type: 'stadium', capacity: 49000, opened: 1997, league: 'プレミアリーグ' },
  { name: 'Tottenham - Tottenham Hotspur Stadium', team: 'Tottenham Hotspur', coords: { lat: 51.6043, lng: -0.0665 }, type: 'stadium', capacity: 62850, opened: 2019, league: 'プレミアリーグ' },
  { name: 'West Ham - London Stadium', team: 'West Ham United', coords: { lat: 51.5386, lng: -0.0166 }, type: 'stadium', capacity: 62500, opened: 2012, league: 'プレミアリーグ' },
  { name: 'Wolves - Molineux Stadium', team: 'Wolverhampton Wanderers', coords: { lat: 52.5901, lng: -2.1300 }, type: 'stadium', capacity: 32050, opened: 1889, league: 'プレミアリーグ' },
];

// チャンピオンシップ（2025–26）
export const championshipStadiums: Stadium[] = [
  { name: 'Birmingham City - St Andrew\'s', team: 'Birmingham City', coords: { lat: 52.4751, lng: -1.8684 }, type: 'stadium', capacity: 29409, opened: 1906, league: 'チャンピオンシップ' },
  { name: 'Blackburn Rovers - Ewood Park', team: 'Blackburn Rovers', coords: { lat: 53.7286, lng: -2.4892 }, type: 'stadium', capacity: 31367, opened: 1890, league: 'チャンピオンシップ' },
  { name: 'Bristol City - Ashton Gate', team: 'Bristol City', coords: { lat: 51.4407, lng: -2.6203 }, type: 'stadium', capacity: 26462, opened: 1887, league: 'チャンピオンシップ' },
  { name: 'Charlton Athletic - The Valley', team: 'Charlton Athletic', coords: { lat: 51.4863, lng: 0.0361 }, type: 'stadium', capacity: 27111, opened: 1919, league: 'チャンピオンシップ' },
  { name: 'Coventry City - Coventry Building Society Arena', team: 'Coventry City', coords: { lat: 52.4481, lng: -1.4925 }, type: 'stadium', capacity: 32609, opened: 2005, league: 'チャンピオンシップ' },
  { name: 'Derby County - Pride Park Stadium', team: 'Derby County', coords: { lat: 52.9142, lng: -1.4472 }, type: 'stadium', capacity: 32926, opened: 1997, league: 'チャンピオンシップ' },
  { name: 'Hull City - MKM Stadium', team: 'Hull City', coords: { lat: 53.7460, lng: -0.3677 }, type: 'stadium', capacity: 25586, opened: 2002, league: 'チャンピオンシップ' },
  { name: 'Ipswich Town - Portman Road', team: 'Ipswich Town', coords: { lat: 52.0558, lng: 1.1440 }, type: 'stadium', capacity: 30056, opened: 1884, league: 'チャンピオンシップ' },
  { name: 'Leicester City - King Power Stadium', team: 'Leicester City', coords: { lat: 52.6204, lng: -1.1422 }, type: 'stadium', capacity: 32259, opened: 2002, league: 'チャンピオンシップ' },
  { name: 'Middlesbrough - Riverside Stadium', team: 'Middlesbrough', coords: { lat: 54.5781, lng: -1.2167 }, type: 'stadium', capacity: 34742, opened: 1995, league: 'チャンピオンシップ' },
  { name: 'Millwall - The Den', team: 'Millwall', coords: { lat: 51.4852, lng: -0.0504 }, type: 'stadium', capacity: 20146, opened: 1993, league: 'チャンピオンシップ' },
  { name: 'Norwich City - Carrow Road', team: 'Norwich City', coords: { lat: 52.6220, lng: 1.3092 }, type: 'stadium', capacity: 27359, opened: 1935, league: 'チャンピオンシップ' },
  { name: 'Oxford United - Kassam Stadium', team: 'Oxford United', coords: { lat: 51.7162, lng: -1.2076 }, type: 'stadium', capacity: 12500, opened: 2001, league: 'チャンピオンシップ' },
  { name: 'Portsmouth - Fratton Park', team: 'Portsmouth', coords: { lat: 50.7964, lng: -1.0632 }, type: 'stadium', capacity: 20899, opened: 1899, league: 'チャンピオンシップ' },
  { name: 'Preston North End - Deepdale', team: 'Preston North End', coords: { lat: 53.7727, lng: -2.6889 }, type: 'stadium', capacity: 23408, opened: 1875, league: 'チャンピオンシップ' },
  { name: 'Queens Park Rangers - Loftus Road', team: 'Queens Park Rangers', coords: { lat: 51.5090, lng: -0.2321 }, type: 'stadium', capacity: 18439, opened: 1904, league: 'チャンピオンシップ' },
  { name: 'Sheffield United - Bramall Lane', team: 'Sheffield United', coords: { lat: 53.3703, lng: -1.4715 }, type: 'stadium', capacity: 32050, opened: 1855, league: 'チャンピオンシップ' },
  { name: 'Sheffield Wednesday - Hillsborough Stadium', team: 'Sheffield Wednesday', coords: { lat: 53.4115, lng: -1.5007 }, type: 'stadium', capacity: 39732, opened: 1899, league: 'チャンピオンシップ' },
  { name: 'Southampton - St Mary\'s Stadium', team: 'Southampton', coords: { lat: 50.9059, lng: -1.3910 }, type: 'stadium', capacity: 32384, opened: 2001, league: 'チャンピオンシップ' },
  { name: 'Stoke City - bet365 Stadium', team: 'Stoke City', coords: { lat: 52.9886, lng: -2.1754 }, type: 'stadium', capacity: 30089, opened: 1997, league: 'チャンピオンシップ' },
  { name: 'Swansea City - Swansea.com Stadium', team: 'Swansea City', coords: { lat: 51.6422, lng: -3.9341 }, type: 'stadium', capacity: 21088, opened: 2005, league: 'チャンピオンシップ' },
  { name: 'Watford - Vicarage Road', team: 'Watford', coords: { lat: 51.6498, lng: -0.4015 }, type: 'stadium', capacity: 22200, opened: 1922, league: 'チャンピオンシップ' },
  { name: 'West Bromwich Albion - The Hawthorns', team: 'West Bromwich Albion', coords: { lat: 52.5092, lng: -1.9632 }, type: 'stadium', capacity: 26850, opened: 1900, league: 'チャンピオンシップ' },
  { name: 'Wrexham - Racecourse Ground', team: 'Wrexham', coords: { lat: 53.0470, lng: -2.9970 }, type: 'stadium', capacity: 10771, opened: 1864, league: 'チャンピオンシップ' },
];

// リーグ・ワン（2025–26）
export const leagueOneStadiums: Stadium[] = [
  { name: 'AFC Wimbledon - Plough Lane', team: 'AFC Wimbledon', coords: { lat: 51.4358, lng: -0.1882 }, type: 'stadium', capacity: 9315, opened: 2020, league: 'リーグ・ワン' },
  { name: 'Barnsley - Oakwell', team: 'Barnsley', coords: { lat: 53.5526, lng: -1.4676 }, type: 'stadium', capacity: 23287, opened: 1888, league: 'リーグ・ワン' },
  { name: 'Blackpool - Bloomfield Road', team: 'Blackpool', coords: { lat: 53.8047, lng: -3.0486 }, type: 'stadium', capacity: 16500, opened: 1899, league: 'リーグ・ワン' },
  { name: 'Bolton Wanderers - Toughsheet Community Stadium', team: 'Bolton Wanderers', coords: { lat: 53.5802, lng: -2.5353 }, type: 'stadium', capacity: 28723, opened: 1997, league: 'リーグ・ワン' },
  { name: 'Bradford City - Valley Parade', team: 'Bradford City', coords: { lat: 53.7956, lng: -1.7593 }, type: 'stadium', capacity: 24840, opened: 1908, league: 'リーグ・ワン' },
  { name: 'Burton Albion - Pirelli Stadium', team: 'Burton Albion', coords: { lat: 52.8065, lng: -1.6302 }, type: 'stadium', capacity: 6912, opened: 2005, league: 'リーグ・ワン' },
  { name: 'Cardiff City - Cardiff City Stadium', team: 'Cardiff City', coords: { lat: 51.4739, lng: -3.2031 }, type: 'stadium', capacity: 33280, opened: 2009, league: 'リーグ・ワン' },
  { name: 'Doncaster Rovers - Eco‑Power Stadium', team: 'Doncaster Rovers', coords: { lat: 53.5092, lng: -1.1139 }, type: 'stadium', capacity: 15231, opened: 2007, league: 'リーグ・ワン' },
  { name: 'Exeter City - St James Park', team: 'Exeter City', coords: { lat: 50.7184, lng: -3.5339 }, type: 'stadium', capacity: 8720, opened: 1904, league: 'リーグ・ワン' },
  { name: 'Huddersfield Town - Kirklees Stadium', team: 'Huddersfield Town', coords: { lat: 53.6543, lng: -1.7682 }, type: 'stadium', capacity: 24121, opened: 1994, league: 'リーグ・ワン' },
  { name: 'Leyton Orient - Brisbane Road', team: 'Leyton Orient', coords: { lat: 51.5607, lng: -0.0467 }, type: 'stadium', capacity: 9271, opened: 1930, league: 'リーグ・ワン' },
  { name: 'Lincoln City - LNER Stadium', team: 'Lincoln City', coords: { lat: 53.2266, lng: -0.5552 }, type: 'stadium', capacity: 10669, opened: 1895, league: 'リーグ・ワン' },
  { name: 'Luton Town - Kenilworth Road', team: 'Luton Town', coords: { lat: 51.8846, lng: -0.4316 }, type: 'stadium', capacity: 12056, opened: 1905, league: 'リーグ・ワン' },
  { name: 'Mansfield Town - Field Mill', team: 'Mansfield Town', coords: { lat: 53.1500, lng: -1.2000 }, type: 'stadium', capacity: 9186, opened: 1861, league: 'リーグ・ワン' },
  { name: 'Northampton Town - Sixfields Stadium', team: 'Northampton Town', coords: { lat: 52.2125, lng: -0.8991 }, type: 'stadium', capacity: 8200, opened: 1994, league: 'リーグ・ワン' },
  { name: 'Peterborough United - Weston Homes Stadium', team: 'Peterborough United', coords: { lat: 52.5741, lng: -0.2497 }, type: 'stadium', capacity: 13511, opened: 1934, league: 'リーグ・ワン' },
  { name: 'Port Vale - Vale Park', team: 'Port Vale', coords: { lat: 53.1040, lng: -2.1304 }, type: 'stadium', capacity: 15036, opened: 1950, league: 'リーグ・ワン' },
  { name: 'Plymouth Argyle - Home Park', team: 'Plymouth Argyle', coords: { lat: 50.3886, lng: -4.1516 }, type: 'stadium', capacity: 17900, opened: 1901, league: 'リーグ・ワン' },
  { name: 'Reading - Madejski Stadium', team: 'Reading', coords: { lat: 51.4222, lng: -0.9822 }, type: 'stadium', capacity: 24161, opened: 1998, league: 'リーグ・ワン' },
  { name: 'Rotherham United - New York Stadium', team: 'Rotherham United', coords: { lat: 53.4283, lng: -1.3626 }, type: 'stadium', capacity: 12021, opened: 2012, league: 'リーグ・ワン' },
  { name: 'Stevenage - Broadhall Way', team: 'Stevenage', coords: { lat: 51.9048, lng: -0.2095 }, type: 'stadium', capacity: 7800, opened: 1961, league: 'リーグ・ワン' },
  { name: 'Stockport County - Edgeley Park', team: 'Stockport County', coords: { lat: 53.4074, lng: -2.1600 }, type: 'stadium', capacity: 10852, opened: 1890, league: 'リーグ・ワン' },
  { name: 'Wigan Athletic - Brick Community Stadium', team: 'Wigan Athletic', coords: { lat: 53.5471, lng: -2.6535 }, type: 'stadium', capacity: 25138, opened: 1999, league: 'リーグ・ワン' },
  { name: 'Wycombe Wanderers - Adams Park', team: 'Wycombe Wanderers', coords: { lat: 51.6307, lng: -0.7749 }, type: 'stadium', capacity: 10237, opened: 1990, league: 'リーグ・ワン' },
];


// セリエA（例: 5件のみ記載、全件必要なら追加可能）
export const serieAStadiums: Stadium[] = [
  { name: "Gewiss Stadium", team: "Atalanta", coords: { lat: 45.7087, lng: 9.6785 }, type: "stadium", capacity: 21447, opened: 1928, league: 'セリエA' },
  { name: "Stadio Renato Dall'Ara", team: "Bologna", coords: { lat: 44.4939, lng: 11.3097 }, type: "stadium", capacity: 38279, opened: 1927, league: 'セリエA' },
  { name: "Unipol Domus", team: "Cagliari", coords: { lat: 39.2231, lng: 9.1044 }, type: "stadium", capacity: 16416, opened: 2017, league: 'セリエA' },
  { name: "Stadio Giuseppe Sinigaglia", team: "Como", coords: { lat: 45.8122, lng: 9.0807 }, type: "stadium", capacity: 13602, opened: 1927, league: 'セリエA' },
  { name: "Stadio Giovanni Zini", team: "Cremonese", coords: { lat: 45.1406, lng: 10.0347 }, type: "stadium", capacity: 20641, opened: 1919, league: 'セリエA' },
  { name: "Stadio Artemio Franchi", team: "Fiorentina", coords: { lat: 43.7808, lng: 11.2826 }, type: "stadium", capacity: 43147, opened: 1931, league: 'セリエA' },
  { name: "Stadio Luigi Ferraris", team: "Genoa", coords: { lat: 44.4164, lng: 8.9525 }, type: "stadium", capacity: 36599, opened: 1911, league: 'セリエA' },
  { name: "Stadio Giuseppe Meazza", team: "Inter", coords: { lat: 45.4781, lng: 9.1240 }, type: "stadium", capacity: 80018, opened: 1926, league: 'セリエA' },
  { name: "Allianz Stadium", team: "Juventus", coords: { lat: 45.1096, lng: 7.6413 }, type: "stadium", capacity: 41507, opened: 2011, league: 'セリエA' },
  { name: "Stadio Olimpico", team: "Lazio", coords: { lat: 41.9339, lng: 12.4545 }, type: "stadium", capacity: 72698, opened: 1953, league: 'セリエA' },
  { name: "Stadio Via del Mare", team: "Lecce", coords: { lat: 40.3548, lng: 18.2087 }, type: "stadium", capacity: 33876, opened: 1966, league: 'セリエA' },
  { name: "Stadio Giuseppe Meazza", team: "Milan", coords: { lat: 45.4781, lng: 9.1240 }, type: "stadium", capacity: 80018, opened: 1926, league: 'セリエA' },
  { name: "Stadio Diego Armando Maradona", team: "Napoli", coords: { lat: 40.8276, lng: 14.1930 }, type: "stadium", capacity: 54726, opened: 1959, league: 'セリエA' },
  { name: "Stadio Ennio Tardini", team: "Parma", coords: { lat: 44.7951, lng: 10.3417 }, type: "stadium", capacity: 22852, opened: 1923, league: 'セリエA' },
  { name: "Arena Garibaldi-Romeo Anconetani", team: "Pisa", coords: { lat: 43.7192, lng: 10.4032 }, type: "stadium", capacity: 14869, opened: 1919, league: 'セリエA' },
  { name: "Stadio Olimpico", team: "Roma", coords: { lat: 41.9339, lng: 12.4545 }, type: "stadium", capacity: 72698, opened: 1953, league: 'セリエA' },
  { name: "Mapei Stadium – Città del Tricolore", team: "Sassuolo", coords: { lat: 44.6984, lng: 10.6663 }, type: "stadium", capacity: 21584, opened: 1995, league: 'セリエA' },
  { name: "Stadio Olimpico Grande Torino", team: "Torino", coords: { lat: 45.0418, lng: 7.6501 }, type: "stadium", capacity: 27958, opened: 1933, league: 'セリエA' },
  { name: "Stadio Friuli", team: "Udinese", coords: { lat: 46.0809, lng: 13.2007 }, type: "stadium", capacity: 25144, opened: 1976, league: 'セリエA' },
  { name: "Stadio Marcantonio Bentegodi", team: "Verona", coords: { lat: 45.4351, lng: 10.9681 }, type: "stadium", capacity: 39211, opened: 1963, league: 'セリエA' },
];

// セリエB（例: 3件のみ記載）
export const serieBStadiums: Stadium[] = [
  { name: "Stadio Partenio-Adriano Lombardi", team: "Avellino", coords: { lat: 40.9369, lng: 14.7925 }, type: "stadium", capacity: 26308, opened: 1970, league: 'セリエB' },
  { name: "Stadio San Nicola", team: "Bari", coords: { lat: 41.0705, lng: 16.8267 }, type: "stadium", capacity: 58270, opened: 1990, league: 'セリエB' },
  { name: "Stadio dei Marmi", team: "Carrarese", coords: { lat: 44.0657, lng: 10.1013 }, type: "stadium", capacity: 9000, opened: 1938, league: 'セリエB' },
  { name: "Stadio Nicola Ceravolo", team: "Catanzaro", coords: { lat: 38.9026, lng: 16.5946 }, type: "stadium", capacity: 14250, opened: 1919, league: 'セリエB' },
  { name: "Orogel Stadium-Dino Manuzzi", team: "Cesena", coords: { lat: 44.1459, lng: 12.2632 }, type: "stadium", capacity: 23586, opened: 1957, league: 'セリエB' },
  { name: "Stadio Carlo Castellani", team: "Empoli", coords: { lat: 43.7167, lng: 10.9542 }, type: "stadium", capacity: 19847, opened: 1965, league: 'セリエB' },
  { name: "Stadio Benito Stirpe", team: "Frosinone", coords: { lat: 41.6525, lng: 13.3272 }, type: "stadium", capacity: 16227, opened: 2017, league: 'セリエB' },
  { name: "Stadio Romeo Menti", team: "Juve Stabia", coords: { lat: 40.7057, lng: 14.4843 }, type: "stadium", capacity: 12800, opened: 1984, league: 'セリエB' },
  { name: "Stadio Alberto Braglia", team: "Modena", coords: { lat: 44.6373, lng: 10.9252 }, type: "stadium", capacity: 21092, opened: 1936, league: 'セリエB' },
  { name: "Stadio Danilo Martelli", team: "Mantova", coords: { lat: 45.1477, lng: 10.7922 }, type: "stadium", capacity: 14370, opened: 1983, league: 'セリエB' },
  { name: "Stadio Brianteo", team: "Monza", coords: { lat: 45.5832, lng: 9.3086 }, type: "stadium", capacity: 15580, opened: 1988, league: 'セリエB' },
  { name: "Stadio Euganeo", team: "Padova", coords: { lat: 45.4064, lng: 11.8506 }, type: "stadium", capacity: 32420, opened: 1994, league: 'セリエB' },
  { name: "Stadio Renzo Barbera", team: "Palermo", coords: { lat: 38.1605, lng: 13.3253 }, type: "stadium", capacity: 36349, opened: 1932, league: 'セリエB' },
  { name: "Stadio Adriatico-Giovanni Cornacchia", team: "Pescara", coords: { lat: 42.4647, lng: 14.2163 }, type: "stadium", capacity: 20515, opened: 1955, league: 'セリエB' },
  { name: "Mapei Stadium – Città del Tricolore", team: "Reggiana", coords: { lat: 44.6984, lng: 10.6663 }, type: "stadium", capacity: 21584, opened: 1995, league: 'セリエB' },
  { name: "Stadio Luigi Ferraris", team: "Sampdoria", coords: { lat: 44.4164, lng: 8.9525 }, type: "stadium", capacity: 36599, opened: 1911, league: 'セリエB' },
  { name: "Stadio Alberto Picco", team: "Spezia", coords: { lat: 44.1122, lng: 9.8281 }, type: "stadium", capacity: 11388, opened: 1919, league: 'セリエB' },
  { name: "Stadio Druso", team: "Südtirol", coords: { lat: 46.4956, lng: 11.3442 }, type: "stadium", capacity: 5539, opened: 1936, league: 'セリエB' },
  { name: "Stadio Pier Luigi Penzo", team: "Venezia", coords: { lat: 45.4297, lng: 12.3678 }, type: "stadium", capacity: 11050, opened: 1913, league: 'セリエB' },
  { name: "Stadio Comunale", team: "Virtus Entella", coords: { lat: 44.3167, lng: 9.3328 }, type: "stadium", capacity: 5535, opened: 1933, league: 'セリエB' },
];

// リーグ・アン（例: 3件のみ記載）
export const ligue1Stadiums: Stadium[] = [
  { name: "Stade Raymond Kopa", team: "Angers", coords: { lat: 47.4781, lng: -0.5415 }, type: "stadium", capacity: 18452, opened: 1912, league: 'リーグ・アン' },
  { name: "Stade de l'Abbé-Deschamps", team: "Auxerre", coords: { lat: 47.8009, lng: 3.5731 }, type: "stadium", capacity: 18254, opened: 1918, league: 'リーグ・アン' },
  { name: "Stade Francis-Le Blé", team: "Brest", coords: { lat: 48.4061, lng: -4.4745 }, type: "stadium", capacity: 15331, opened: 1922, league: 'リーグ・アン' },
  { name: "Stade Océane", team: "Le Havre", coords: { lat: 49.5078, lng: 0.1864 }, type: "stadium", capacity: 25181, opened: 2012, league: 'リーグ・アン' },
  { name: "Stade Bollaert-Delelis", team: "Lens", coords: { lat: 50.4319, lng: 2.8311 }, type: "stadium", capacity: 38223, opened: 1933, league: 'リーグ・アン' },
  { name: "Stade Pierre-Mauroy", team: "Lille", coords: { lat: 50.6119, lng: 3.1306 }, type: "stadium", capacity: 50083, opened: 2012, league: 'リーグ・アン' },
  { name: "Stade du Moustoir", team: "Lorient", coords: { lat: 47.7485, lng: -3.3667 }, type: "stadium", capacity: 18210, opened: 1959, league: 'リーグ・アン' },
  { name: "Groupama Stadium", team: "Lyon", coords: { lat: 45.7652, lng: 4.9828 }, type: "stadium", capacity: 59186, opened: 2016, league: 'リーグ・アン' },
  { name: "Stade Vélodrome", team: "Marseille", coords: { lat: 43.2697, lng: 5.3957 }, type: "stadium", capacity: 67394, opened: 1937, league: 'リーグ・アン' },
  { name: "Stade Saint-Symphorien", team: "Metz", coords: { lat: 49.1066, lng: 6.1667 }, type: "stadium", capacity: 30500, opened: 1923, league: 'リーグ・アン' },
  { name: "Stade Louis II", team: "Monaco", coords: { lat: 43.7277, lng: 7.4197 }, type: "stadium", capacity: 18523, opened: 1985, league: 'リーグ・アン' },
  { name: "Stade de la Beaujoire", team: "Nantes", coords: { lat: 47.2560, lng: -1.5244 }, type: "stadium", capacity: 37473, opened: 1984, league: 'リーグ・アン' },
  { name: "Allianz Riviera", team: "Nice", coords: { lat: 43.7055, lng: 7.1925 }, type: "stadium", capacity: 35624, opened: 2013, league: 'リーグ・アン' },
  { name: "Stade Charléty", team: "Paris FC", coords: { lat: 48.8218, lng: 2.3458 }, type: "stadium", capacity: 19994, opened: 1939, league: 'リーグ・アン' },
  { name: "Parc des Princes", team: "Paris Saint-Germain", coords: { lat: 48.8414, lng: 2.2530 }, type: "stadium", capacity: 47929, opened: 1972, league: 'リーグ・アン' },
  { name: "Roazhon Park", team: "Rennes", coords: { lat: 48.1147, lng: -1.7017 }, type: "stadium", capacity: 29778, opened: 1912, league: 'リーグ・アン' },
  { name: "Stade de la Meinau", team: "Strasbourg", coords: { lat: 48.5603, lng: 7.7346 }, type: "stadium", capacity: 26109, opened: 1914, league: 'リーグ・アン' },
  { name: "Stadium de Toulouse", team: "Toulouse", coords: { lat: 43.5820, lng: 1.4348 }, type: "stadium", capacity: 33150, opened: 1637, league: 'リーグ・アン' },
];

// リーグ・ドゥ（例: 2件のみ記載）
export const ligue2Stadiums: Stadium[] = [
  { name: "Stade Auguste-Delaune", team: "Stade Reims", coords: { lat: 49.2460, lng: 4.0175 }, type: "stadium", capacity: 21684, opened: 1935, league: 'リーグ・ドゥ' },
  { name: "Stade Geoffroy-Guichard", team: "AS Saint-Étienne", coords: { lat: 45.4606, lng: 4.3908 }, type: "stadium", capacity: 41965, opened: 1931, league: 'リーグ・ドゥ' },
  { name: "Stade de la Mosson", team: "Montpellier HSC", coords: { lat: 43.6184, lng: 3.8189 }, type: "stadium", capacity: 22000, opened: 1972, league: 'リーグ・ドゥ' },
  { name: "Stade de l'Aube", team: "ESTAC Troyes", coords: { lat: 48.3007, lng: 4.0903 }, type: "stadium", capacity: 20400, opened: 1924, league: 'リーグ・ドゥ' },
  { name: "Stade du Roudourou", team: "EA Guingamp", coords: { lat: 48.5655, lng: -3.1469 }, type: "stadium", capacity: 18196, opened: 1990, league: 'リーグ・ドゥ' },
  { name: "Stade Armand-Cesari", team: "SC Bastia", coords: { lat: 42.6625, lng: 9.4331 }, type: "stadium", capacity: 16800, opened: 1932, league: 'リーグ・ドゥ' },
  { name: "Stade Gabriel-Montpied", team: "Clermont Foot 63", coords: { lat: 45.8009, lng: 3.1021 }, type: "stadium", capacity: 11980, opened: 1995, league: 'リーグ・ドゥ' },
  { name: "Stade Marcel-Tribut", team: "USL Dunkerque", coords: { lat: 51.0342, lng: 2.3669 }, type: "stadium", capacity: 4200, opened: 1933, league: 'リーグ・ドゥ' },
  { name: "Stade des Alpes", team: "Grenoble Foot 38", coords: { lat: 45.1881, lng: 5.7496 }, type: "stadium", capacity: 20068, opened: 2008, league: 'リーグ・ドゥ' },
  { name: "Nouste Camp", team: "Pau FC", coords: { lat: 43.3186, lng: -0.3781 }, type: "stadium", capacity: 4200, opened: 2018, league: 'リーグ・ドゥ' },
  { name: "Stade Paul-Lignon", team: "Rodez AF", coords: { lat: 44.3531, lng: 2.5747 }, type: "stadium", capacity: 5855, opened: 1948, league: 'リーグ・ドゥ' },
  { name: "Stade Francis Le Basser", team: "Stade Lavallois", coords: { lat: 48.0737, lng: -0.7739 }, type: "stadium", capacity: 18397, opened: 1971, league: 'リーグ・ドゥ' },
  { name: "Stade de la Licorne", team: "Amiens SC", coords: { lat: 49.9065, lng: 2.2747 }, type: "stadium", capacity: 12097, opened: 1999, league: 'リーグ・ドゥ' },
  { name: "Stade Bauer", team: "Red Star FC", coords: { lat: 48.9125, lng: 2.3453 }, type: "stadium", capacity: 9900, opened: 1909, league: 'リーグ・ドゥ' },
  { name: "Parc des Sports", team: "FC Annecy", coords: { lat: 45.9195, lng: 6.1287 }, type: "stadium", capacity: 15860, opened: 1964, league: 'リーグ・ドゥ' },
  { name: "Stade Marcel-Picot", team: "AS Nancy-Lorraine", coords: { lat: 48.6844, lng: 6.1847 }, type: "stadium", capacity: 20087, opened: 1926, league: 'リーグ・ドゥ' },
  { name: "Stade Marie-Marvingt", team: "Le Mans FC", coords: { lat: 47.9631, lng: 0.1778 }, type: "stadium", capacity: 25064, opened: 2011, league: 'リーグ・ドゥ' },
  { name: "Stade de la Libération", team: "US Boulogne", coords: { lat: 50.7261, lng: 1.6032 }, type: "stadium", capacity: 9000, opened: 1956, league: 'リーグ・ドゥ' },
];

// ラ・リーガ（例: 5件のみ記載）
export const laLigaStadiums: Stadium[] = [
  { name: 'Santiago Bernabéu', team: 'Real Madrid', coords: { lat: 40.4531, lng: -3.6883 }, type: 'stadium', capacity: 81044, opened: 1947, league: 'ラ・リーガ' },
  { name: 'Spotify Camp Nou', team: 'Barcelona', coords: { lat: 41.3809, lng: 2.1228 }, type: 'stadium', capacity: 99354, opened: 1957, league: 'ラ・リーガ' },
  { name: 'Cívitas Metropolitano', team: 'Atlético Madrid', coords: { lat: 40.4362, lng: -3.5995 }, type: 'stadium', capacity: 68456, opened: 2017, league: 'ラ・リーガ' },
  { name: 'Benito Villamarín', team: 'Real Betis', coords: { lat: 37.3564, lng: -5.9819 }, type: 'stadium', capacity: 60721, opened: 1929, league: 'ラ・リーガ' },
  { name: 'San Mamés', team: 'Athletic Club', coords: { lat: 43.2641, lng: -2.9496 }, type: 'stadium', capacity: 53289, opened: 2013, league: 'ラ・リーガ' },
  { name: 'Estadio de la Cerámica', team: 'Villarreal', coords: { lat: 39.9449, lng: -0.1034 }, type: 'stadium', capacity: 23500, opened: 1923, league: 'ラ・リーガ' },
  { name: 'Ramón Sánchez-Pizjuán', team: 'Sevilla', coords: { lat: 37.3841, lng: -5.9707 }, type: 'stadium', capacity: 43883, opened: 1958, league: 'ラ・リーガ' },
  { name: 'Reale Arena', team: 'Real Sociedad', coords: { lat: 43.3017, lng: -1.9735 }, type: 'stadium', capacity: 39800, opened: 1993, league: 'ラ・リーガ' },
  { name: 'Estadio de Mestalla', team: 'Valencia', coords: { lat: 39.4745, lng: -0.3582 }, type: 'stadium', capacity: 49430, opened: 1923, league: 'ラ・リーガ' },
  { name: 'Estadio de Gran Canaria', team: 'Las Palmas', coords: { lat: 28.0997, lng: -15.4444 }, type: 'stadium', capacity: 32400, opened: 2003, league: 'ラ・リーガ' },
  { name: 'Estadi Mallorca Son Moix', team: 'Mallorca', coords: { lat: 39.5894, lng: 2.6303 }, type: 'stadium', capacity: 23142, opened: 1999, league: 'ラ・リーガ' },
  { name: 'Estadio de Vallecas', team: 'Rayo Vallecano', coords: { lat: 40.3919, lng: -3.6581 }, type: 'stadium', capacity: 14708, opened: 1976, league: 'ラ・リーガ' },
  { name: 'Estadio Nuevo Mirandilla', team: 'Cádiz', coords: { lat: 36.5027, lng: -6.2732 }, type: 'stadium', capacity: 20059, opened: 1955, league: 'ラ・リーガ' },
  { name: 'Estadio de Mendizorroza', team: 'Alavés', coords: { lat: 42.8467, lng: -2.6886 }, type: 'stadium', capacity: 19840, opened: 1924, league: 'ラ・リーガ' },
  { name: 'Estadio de los Juegos Mediterráneos', team: 'Almería', coords: { lat: 36.8401, lng: -2.4351 }, type: 'stadium', capacity: 15000, opened: 2004, league: 'ラ・リーガ' },
  { name: 'Coliseum Alfonso Pérez', team: 'Getafe', coords: { lat: 40.3257, lng: -3.7144 }, type: 'stadium', capacity: 17793, opened: 1998, league: 'ラ・リーガ' },
  { name: 'Estadio El Sadar', team: 'Osasuna', coords: { lat: 42.7960, lng: -1.6371 }, type: 'stadium', capacity: 23876, opened: 1967, league: 'ラ・リーガ' },
  { name: 'Estadio Municipal de Montilivi', team: 'Girona', coords: { lat: 41.9594, lng: 2.8377 }, type: 'stadium', capacity: 13750, opened: 1970, league: 'ラ・リーガ' },
  { name: 'Estadio de Vallehermoso', team: 'Leganés', coords: { lat: 40.3272, lng: -3.7635 }, type: 'stadium', capacity: 12000, opened: 1998, league: 'ラ・リーガ' },
  { name: 'Estadio de Santo Domingo', team: 'Alcorcón', coords: { lat: 40.3459, lng: -3.8303 }, type: 'stadium', capacity: 6000, opened: 1999, league: 'ラ・リーガ' },
];

// セグンダ（例: 2件のみ記載）
export const segundaStadiums: Stadium[] = [
  { name: 'Estadio de Riazor', team: 'Deportivo La Coruña', coords: { lat: 43.3686, lng: -8.4183 }, type: 'stadium', capacity: 32490, opened: 1944, league: 'セグンダ' },
  { name: 'Estadio de La Romareda', team: 'Real Zaragoza', coords: { lat: 41.6498, lng: -0.9048 }, type: 'stadium', capacity: 34596, opened: 1957, league: 'セグンダ' },
  { name: 'Estadio de El Molinón', team: 'Sporting Gijón', coords: { lat: 43.5360, lng: -5.6377 }, type: 'stadium', capacity: 29538, opened: 1908, league: 'セグンダ' },
  { name: 'Estadio de La Rosaleda', team: 'Málaga', coords: { lat: 36.7407, lng: -4.4261 }, type: 'stadium', capacity: 30044, opened: 1941, league: 'セグンダ' },
  { name: 'Estadio de los Juegos Mediterráneos', team: 'Almería', coords: { lat: 36.8401, lng: -2.4351 }, type: 'stadium', capacity: 15000, opened: 2004, league: 'セグンダ' },
  { name: 'Estadio Carlos Tartiere', team: 'Real Oviedo', coords: { lat: 43.3548, lng: -5.8647 }, type: 'stadium', capacity: 30500, opened: 2000, league: 'セグンダ' },
  { name: 'Estadio de Gran Canaria', team: 'Las Palmas', coords: { lat: 28.0997, lng: -15.4444 }, type: 'stadium', capacity: 32400, opened: 2003, league: 'セグンダ' },
  { name: 'Estadio de Butarque', team: 'Leganés', coords: { lat: 40.3272, lng: -3.7635 }, type: 'stadium', capacity: 12000, opened: 1998, league: 'セグンダ' },
  { name: 'Estadio Santo Domingo', team: 'Alcorcón', coords: { lat: 40.3459, lng: -3.8303 }, type: 'stadium', capacity: 6000, opened: 1999, league: 'セグンダ' },
  { name: 'Estadio Municipal de Anduva', team: 'Mirandés', coords: { lat: 42.6866, lng: -2.9427 }, type: 'stadium', capacity: 5859, opened: 1950, league: 'セグンダ' },
  { name: 'Estadio Municipal de Ipurua', team: 'Eibar', coords: { lat: 43.1818, lng: -2.4757 }, type: 'stadium', capacity: 8164, opened: 1947, league: 'セグンダ' },
  { name: 'Estadio Municipal José Zorrilla', team: 'Real Valladolid', coords: { lat: 41.6292, lng: -4.7619 }, type: 'stadium', capacity: 27846, opened: 1982, league: 'セグンダ' },
  { name: 'Estadio Heliodoro Rodríguez López', team: 'Tenerife', coords: { lat: 28.4682, lng: -16.2546 }, type: 'stadium', capacity: 22624, opened: 1925, league: 'セグンダ' },
  { name: 'Estadio de La Condomina', team: 'UCAM Murcia', coords: { lat: 37.9833, lng: -1.1300 }, type: 'stadium', capacity: 6000, opened: 1924, league: 'セグンダ' },
  { name: 'Estadio Municipal de Montilivi', team: 'Girona', coords: { lat: 41.9594, lng: 2.8377 }, type: 'stadium', capacity: 13750, opened: 1970, league: 'セグンダ' },
  { name: 'Estadio Municipal de Cartagonova', team: 'Cartagena', coords: { lat: 37.6051, lng: -0.9807 }, type: 'stadium', capacity: 15000, opened: 1988, league: 'セグンダ' },
  { name: 'Estadio Municipal de Balaídos', team: 'Celta Vigo', coords: { lat: 42.2118, lng: -8.7392 }, type: 'stadium', capacity: 29000, opened: 1928, league: 'セグンダ' },
  { name: 'Estadio Municipal de Castalia', team: 'Castellón', coords: { lat: 39.9883, lng: -0.0346 }, type: 'stadium', capacity: 15000, opened: 1987, league: 'セグンダ' },
  { name: 'Estadio Municipal de Santo Domingo', team: 'Ponferradina', coords: { lat: 42.5463, lng: -6.5987 }, type: 'stadium', capacity: 8800, opened: 2000, league: 'セグンダ' },
  { name: 'Estadio Municipal de El Toralín', team: 'Ponferradina', coords: { lat: 42.5463, lng: -6.5987 }, type: 'stadium', capacity: 8800, opened: 2000, league: 'セグンダ' },
  { name: 'Estadio Municipal de La Nova Creu Alta', team: 'Sabadell', coords: { lat: 41.5535, lng: 2.1043 }, type: 'stadium', capacity: 11708, opened: 1967, league: 'セグンダ' },
  { name: 'Estadio Municipal de Santo Domingo', team: 'Alcorcón', coords: { lat: 40.3459, lng: -3.8303 }, type: 'stadium', capacity: 6000, opened: 1999, league: 'セグンダ' },
];

export const bundesligaStadiums: Stadium[] = [
  // 25/26シーズン 1部
  { name: 'Allianz Arena', team: 'FC Bayern München', coords: { lat: 48.2188, lng: 11.6247 }, type: 'stadium', capacity: 75024, opened: 2005, league: 'ブンデスリーガ' },
  { name: 'Signal Iduna Park', team: 'Borussia Dortmund', coords: { lat: 51.4926, lng: 7.4517 }, type: 'stadium', capacity: 81365, opened: 1974, league: 'ブンデスリーガ' },
  { name: 'BayArena', team: 'Bayer 04 Leverkusen', coords: { lat: 51.0381, lng: 7.0026 }, type: 'stadium', capacity: 30210, opened: 1958, league: 'ブンデスリーガ' },
  { name: 'MHPArena', team: 'VfB Stuttgart', coords: { lat: 48.7924, lng: 9.2325 }, type: 'stadium', capacity: 60449, opened: 1933, league: 'ブンデスリーガ' },
  { name: 'Red Bull Arena', team: 'RB Leipzig', coords: { lat: 51.3458, lng: 12.3482 }, type: 'stadium', capacity: 47069, opened: 2004, league: 'ブンデスリーガ' },
  { name: 'Deutsche Bank Park', team: 'Eintracht Frankfurt', coords: { lat: 50.0685, lng: 8.6455 }, type: 'stadium', capacity: 51500, opened: 1925, league: 'ブンデスリーガ' },
  { name: 'PreZero Arena', team: 'TSG 1899 Hoffenheim', coords: { lat: 49.2382, lng: 8.8873 }, type: 'stadium', capacity: 30150, opened: 2009, league: 'ブンデスリーガ' },
  { name: 'Europa-Park Stadion', team: 'SC Freiburg', coords: { lat: 48.0128, lng: 7.7892 }, type: 'stadium', capacity: 34700, opened: 2021, league: 'ブンデスリーガ' },
  { name: 'wohninvest WESERSTADION', team: 'Werder Bremen', coords: { lat: 53.0664, lng: 8.8376 }, type: 'stadium', capacity: 42358, opened: 1947, league: 'ブンデスリーガ' },
  { name: 'WWK Arena', team: 'FC Augsburg', coords: { lat: 48.3233, lng: 10.9546 }, type: 'stadium', capacity: 30660, opened: 2009, league: 'ブンデスリーガ' },
  { name: 'Volkswagen Arena', team: 'VfL Wolfsburg', coords: { lat: 52.4369, lng: 10.8033 }, type: 'stadium', capacity: 30000, opened: 2002, league: 'ブンデスリーガ' },
  { name: 'MEWA ARENA', team: '1. FSV Mainz 05', coords: { lat: 49.9835, lng: 8.2318 }, type: 'stadium', capacity: 34000, opened: 2011, league: 'ブンデスリーガ' },
  { name: 'BORUSSIA-PARK', team: 'Borussia Mönchengladbach', coords: { lat: 51.1744, lng: 6.3876 }, type: 'stadium', capacity: 54057, opened: 2004, league: 'ブンデスリーガ' },
  { name: 'Stadion An der Alten Försterei', team: '1. FC Union Berlin', coords: { lat: 52.4561, lng: 13.5689 }, type: 'stadium', capacity: 22012, opened: 1920, league: 'ブンデスリーガ' },
  { name: 'Vonovia Ruhrstadion', team: 'VfL Bochum', coords: { lat: 51.4862, lng: 7.2198 }, type: 'stadium', capacity: 26600, opened: 1979, league: 'ブンデスリーガ' },
  { name: 'Voith-Arena', team: '1. FC Heidenheim', coords: { lat: 48.6781, lng: 10.1766 }, type: 'stadium', capacity: 15000, opened: 1972, league: 'ブンデスリーガ' },
  { name: 'Millerntor-Stadion', team: 'FC St. Pauli', coords: { lat: 53.5542, lng: 9.9672 }, type: 'stadium', capacity: 29646, opened: 1963, league: 'ブンデスリーガ' },
  { name: 'Holstein-Stadion', team: 'Holstein Kiel', coords: { lat: 54.3439, lng: 10.1356 }, type: 'stadium', capacity: 15634, opened: 1911, league: 'ブンデスリーガ' },
];

// ベルギー・プロ・リーグ
export const belgianProLeagueStadiums: Stadium[] = [
  { name: 'Lotto Park', team: 'Anderlecht', coords: { lat: 50.8338, lng: 4.2923 }, type: 'stadium', capacity: 21900, league: 'ベルギー・プロ・リーグ' },
  { name: 'Bosuilstadion', team: 'Antwerp', coords: { lat: 51.2325, lng: 4.47222 }, type: 'stadium', capacity: 16144, league: 'ベルギー・プロ・リーグ' },
  { name: 'Jan Breydel Stadium', team: 'Cercle Brugge', coords: { lat: 51.19333, lng: 3.18056 }, type: 'stadium', capacity: 29062, league: 'ベルギー・プロ・リーグ' },
  { name: 'Stade du Pays de Charleroi', team: 'Charleroi', coords: { lat: 50.4146, lng: 4.4538 }, type: 'stadium', capacity: 15000, league: 'ベルギー・プロ・リーグ' },
  { name: 'Jan Breydel Stadium', team: 'Club Brugge', coords: { lat: 51.19333, lng: 3.18056 }, type: 'stadium', capacity: 29062, league: 'ベルギー・プロ・リーグ' },
  { name: 'Kehrwegstadion', team: 'Eupen', coords: { lat: 50.62639, lng: 6.04583 }, type: 'stadium', capacity: 8363, league: 'ベルギー・プロ・リーグ' },
  { name: 'Cegeka Arena', team: 'Genk', coords: { lat: 51.00500, lng: 5.53333 }, type: 'stadium', capacity: 23718, league: 'ベルギー・プロ・リーグ' },
  { name: 'Planet Group Arena', team: 'Gent', coords: { lat: 51.0097, lng: 3.7338 }, type: 'stadium', capacity: 20185, league: 'ベルギー・プロ・リーグ' },
  { name: 'Guldensporen Stadion', team: 'Kortrijk', coords: { lat: 50.8304, lng: 3.2489 }, type: 'stadium', capacity: 9399, league: 'ベルギー・プロ・リーグ' },
  { name: 'AFAS-stadion Achter de Kazerne', team: 'Mechelen', coords: { lat: 51.037184, lng: 4.486397 }, type: 'stadium', capacity: 16672, league: 'ベルギー・プロ・リーグ' },
  { name: 'Den Dreef', team: 'OH Leuven', coords: { lat: 50.8677, lng: 4.6898 }, type: 'stadium', capacity: 9493, league: 'ベルギー・プロ・リーグ' },
  { name: 'Edmond Machtens Stadium', team: 'RWD Molenbeek', coords: { lat: 50.85500, lng: 4.31111 }, type: 'stadium', capacity: 8000, league: 'ベルギー・プロ・リーグ' },
  { name: 'Daio Wasabi Stayen Stadium', team: 'Sint-Truiden', coords: { lat: 50.8135, lng: 5.1663 }, type: 'stadium', capacity: 11337, league: 'ベルギー・プロ・リーグ' },
  { name: 'Stade Maurice Dufrasne', team: 'Standard Liège', coords: { lat: 50.6059, lng: 5.5393 }, type: 'stadium', capacity: 27670, league: 'ベルギー・プロ・リーグ' },
  { name: 'Stade Joseph Marien', team: 'Union SG', coords: { lat: 50.8173, lng: 4.3242 }, type: 'stadium', capacity: 9512, league: 'ベルギー・プロ・リーグ' },
  { name: 'Het Kuipje', team: 'Westerlo', coords: { lat: 51.094817, lng: 4.928806 }, type: 'stadium', capacity: 8035, league: 'ベルギー・プロ・リーグ' },
];

export const bundesliga2Stadiums: Stadium[] = [
  // 25/26シーズン 2部
  { name: 'Merkur Spiel-Arena', team: 'Fortuna Düsseldorf', coords: { lat: 51.2612, lng: 6.7339 }, type: 'stadium', capacity: 54600, opened: 2004, league: 'ブンデスリーガ2部' },
  { name: 'Volksparkstadion', team: 'Hamburger SV', coords: { lat: 53.5872, lng: 9.8986 }, type: 'stadium', capacity: 57000, opened: 1953, league: 'ブンデスリーガ2部' },
  { name: 'Max-Morlock-Stadion', team: '1. FC Nürnberg', coords: { lat: 49.4294, lng: 11.1245 }, type: 'stadium', capacity: 50000, opened: 1928, league: 'ブンデスリーガ2部' },
  { name: 'Fritz-Walter-Stadion', team: '1. FC Kaiserslautern', coords: { lat: 49.4401, lng: 7.7716 }, type: 'stadium', capacity: 49850, opened: 1920, league: 'ブンデスリーガ2部' },
  { name: 'MDCC-Arena', team: '1. FC Magdeburg', coords: { lat: 52.1278, lng: 11.6351 }, type: 'stadium', capacity: 30098, opened: 2006, league: 'ブンデスリーガ2部' },
  { name: 'Eintracht-Stadion', team: 'Eintracht Braunschweig', coords: { lat: 52.2737, lng: 10.5326 }, type: 'stadium', capacity: 26000, opened: 1923, league: 'ブンデスリーガ2部' },
  { name: 'Donaustadion', team: 'SSV Ulm 1846', coords: { lat: 48.4064, lng: 9.9952 }, type: 'stadium', capacity: 19500, opened: 1925, league: 'ブンデスリーガ2部' },
  { name: 'Preußenstadion', team: 'SC Preußen Münster', coords: { lat: 51.9481, lng: 7.5958 }, type: 'stadium', capacity: 15050, opened: 1926, league: 'ブンデスリーガ2部' },
  { name: 'Jahnstadion Regensburg', team: 'SSV Jahn Regensburg', coords: { lat: 49.0332, lng: 12.1016 }, type: 'stadium', capacity: 15210, opened: 2015, league: 'ブンデスリーガ2部' },
  { name: 'Schauinsland-Reisen-Arena', team: 'MSV Duisburg', coords: { lat: 51.3947, lng: 6.7957 }, type: 'stadium', capacity: 31500, opened: 2004, league: 'ブンデスリーガ2部' },
  { name: 'Stadion am Böllenfalltor', team: 'SV Darmstadt 98', coords: { lat: 49.8626, lng: 8.6636 }, type: 'stadium', capacity: 17868, opened: 1921, league: 'ブンデスリーガ2部' },
  { name: 'Rudolf-Harbig-Stadion', team: 'Dynamo Dresden', coords: { lat: 51.0352, lng: 13.7534 }, type: 'stadium', capacity: 32066, opened: 1923, league: 'ブンデスリーガ2部' },
  { name: 'Sportpark Ronhof | Thomas Sommer', team: 'SpVgg Greuther Fürth', coords: { lat: 49.4862, lng: 10.9814 }, type: 'stadium', capacity: 16626, opened: 1910, league: 'ブンデスリーガ2部' },
  { name: 'Audi Sportpark', team: 'FC Ingolstadt 04', coords: { lat: 48.7842, lng: 11.4716 }, type: 'stadium', capacity: 15800, opened: 2010, league: 'ブンデスリーガ2部' },
  { name: 'Stadion am Hardtwald', team: 'SV Sandhausen', coords: { lat: 49.3100, lng: 8.6397 }, type: 'stadium', capacity: 15000, opened: 1951, league: 'ブンデスリーガ2部' },
  { name: 'Voith-Arena', team: '1. FC Heidenheim', coords: { lat: 48.6781, lng: 10.1766 }, type: 'stadium', capacity: 15000, opened: 1972, league: 'ブンデスリーガ2部' },
  { name: 'Millerntor-Stadion', team: 'FC St. Pauli', coords: { lat: 53.5542, lng: 9.9672 }, type: 'stadium', capacity: 29646, opened: 1963, league: 'ブンデスリーガ2部' },
  { name: 'Holstein-Stadion', team: 'Holstein Kiel', coords: { lat: 54.3439, lng: 10.1356 }, type: 'stadium', capacity: 15634, opened: 1911, league: 'ブンデスリーガ2部' },
];

export const mapCategories = {
  stadium: 'スタジアム',
  hotel: 'ホテル',
};

export type MapCategory = keyof typeof mapCategories;
