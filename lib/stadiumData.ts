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

export const serieAStadiums: Stadium[] = [
  {
    name: "San Siro (Giuseppe Meazza)",
    team: "AC Milan / Inter Milan",
    coords: { lat: 45.4781, lng: 9.1240 },
    type: "stadium",
    capacity: 75817,
    opened: 1926
  },
  {
    name: "Allianz Stadium",
    team: "Juventus",
    coords: { lat: 45.1097, lng: 7.6411 },
    type: "stadium",
    capacity: 41507,
    opened: 2011
  },
  {
    name: "Stadio Olimpico",
    team: "AS Roma / SS Lazio",
    coords: { lat: 41.9342, lng: 12.4549 },
    type: "stadium",
    capacity: 70634,
    opened: 1953
  },
  {
    name: "Stadio San Paolo (Diego Armando Maradona)",
    team: "SSC Napoli",
    coords: { lat: 40.8282, lng: 14.1929 },
    type: "stadium",
    capacity: 54726,
    opened: 1959
  },
  {
    name: "Stadio Artemio Franchi",
    team: "ACF Fiorentina",
    coords: { lat: 43.7811, lng: 11.2822 },
    type: "stadium",
    capacity: 43147,
    opened: 1931
  },
  {
    name: "Stadio Luigi Ferraris",
    team: "UC Sampdoria / Genoa CFC",
    coords: { lat: 44.4164, lng: 8.9528 },
    type: "stadium",
    capacity: 36685,
    opened: 1911
  },
  {
    name: "Gewiss Stadium",
    team: "Atalanta BC",
    coords: { lat: 45.7089, lng: 9.6808 },
    type: "stadium",
    capacity: 24950,
    opened: 1928
  },
  {
    name: "Stadio Renato Dall'Ara",
    team: "Bologna FC",
    coords: { lat: 44.4925, lng: 11.3097 },
    type: "stadium",
    capacity: 38279,
    opened: 1927
  },
  {
    name: "Stadio Castellani",
    team: "Empoli FC",
    coords: { lat: 43.7275, lng: 10.9531 },
    type: "stadium",
    capacity: 16284,
    opened: 1965
  },
  {
    name: "Stadio Alberto Picco",
    team: "Hellas Verona",
    coords: { lat: 45.4350, lng: 10.9686 },
    type: "stadium",
    capacity: 39211,
    opened: 1963
  },
  {
    name: "Stadio Friuli",
    team: "Udinese Calcio",
    coords: { lat: 46.0822, lng: 13.2181 },
    type: "stadium",
    capacity: 25144,
    opened: 1976
  },
  {
    name: "Stadio Ennio Tardini",
    team: "Parma FC",
    coords: { lat: 44.7958, lng: 10.3381 },
    type: "stadium",
    capacity: 22352,
    opened: 1923
  },
  {
    name: "Stadio Mapei",
    team: "US Sassuolo",
    coords: { lat: 44.5742, lng: 10.7647 },
    type: "stadium",
    capacity: 23717,
    opened: 2013
  },
  {
    name: "Stadio Olimpico Grande Torino",
    team: "Torino FC",
    coords: { lat: 45.0422, lng: 7.6508 },
    type: "stadium",
    capacity: 27994,
    opened: 1963
  },
  {
    name: "Stadio Via del Mare",
    team: "US Lecce",
    coords: { lat: 40.3547, lng: 18.1422 },
    type: "stadium",
    capacity: 33876,
    opened: 1966
  },
  {
    name: "Stadio San Vito-Gigi Marulla",
    team: "Cosenza Calcio",
    coords: { lat: 39.3156, lng: 16.2281 },
    type: "stadium",
    capacity: 20987,
    opened: 1914
  },
  {
    name: "Stadio Arechi",
    team: "US Salernitana",
    coords: { lat: 40.6311, lng: 14.7997 },
    type: "stadium",
    capacity: 37245,
    opened: 1990
  },
  {
    name: "Stadio Unipol Domus",
    team: "Cagliari Calcio",
    coords: { lat: 39.1981, lng: 9.1372 },
    type: "stadium",
    capacity: 16233,
    opened: 2017
  },
  {
    name: "Stadio Armando Picchi",
    team: "Pisa SC",
    coords: { lat: 43.6881, lng: 10.4206 },
    type: "stadium",
    capacity: 25000,
    opened: 1919
  },
  {
    name: "Stadio Ciro Vigorito",
    team: "Benevento Calcio",
    coords: { lat: 41.1156, lng: 14.7881 },
    type: "stadium",
    capacity: 25000,
    opened: 1979
  }
];

export const serieBStadiums: Stadium[] = [
  {
    name: "Stadio Renzo Barbera",
    team: "Palermo FC",
    coords: { lat: 38.1517, lng: 13.3256 },
    type: "stadium",
    capacity: 36349,
    opened: 1932
  },
  {
    name: "Stadio Cino e Lillo Del Duca",
    team: "Ascoli Calcio",
    coords: { lat: 42.8708, lng: 13.5881 },
    type: "stadium",
    capacity: 12461,
    opened: 1962
  },
  {
    name: "Stadio Mario Rigamonti",
    team: "Brescia Calcio",
    coords: { lat: 45.5281, lng: 10.2047 },
    type: "stadium",
    capacity: 19317,
    opened: 1911
  },
  {
    name: "Stadio Pier Cesare Tombolato",
    team: "Cittadella",
    coords: { lat: 45.6481, lng: 11.7931 },
    type: "stadium",
    capacity: 7623,
    opened: 1922
  },
  {
    name: "Stadio Alberto Braglia",
    team: "Modena FC",
    coords: { lat: 44.6331, lng: 10.9281 },
    type: "stadium",
    capacity: 21151,
    opened: 1936
  },
  {
    name: "Stadio Pier Luigi Penzo",
    team: "Venezia FC",
    coords: { lat: 45.4331, lng: 12.3831 },
    type: "stadium",
    capacity: 11150,
    opened: 1913
  },
  {
    name: "Stadio Dino Manuzzi",
    team: "Cesena FC",
    coords: { lat: 44.1431, lng: 12.2431 },
    type: "stadium",
    capacity: 23717,
    opened: 1957
  },
  {
    name: "Stadio Paolo Mazza",
    team: "SPAL",
    coords: { lat: 44.8381, lng: 11.6031 },
    type: "stadium",
    capacity: 16134,
    opened: 1928
  },
  {
    name: "Stadio Romeo Menti",
    team: "Juve Stabia",
    coords: { lat: 40.7031, lng: 14.4831 },
    type: "stadium",
    capacity: 10000,
    opened: 1984
  },
  {
    name: "Stadio Nicola Ceravolo",
    team: "Catanzaro",
    coords: { lat: 38.8831, lng: 16.6031 },
    type: "stadium",
    capacity: 14650,
    opened: 1919
  },
  {
    name: "Stadio Libero Liberati",
    team: "Ternana Calcio",
    coords: { lat: 42.5631, lng: 12.6431 },
    type: "stadium",
    capacity: 17460,
    opened: 1969
  },
  {
    name: "Stadio Silvio Piola",
    team: "Novara FC",
    coords: { lat: 45.4531, lng: 8.6031 },
    type: "stadium",
    capacity: 17875,
    opened: 1994
  },
  {
    name: "Stadio Comunale",
    team: "Carrarese Calcio",
    coords: { lat: 44.0831, lng: 10.0931 },
    type: "stadium",
    capacity: 4144,
    opened: 1948
  },
  {
    name: "Stadio Euganeo",
    team: "Calcio Padova",
    coords: { lat: 45.3731, lng: 11.8831 },
    type: "stadium",
    capacity: 32420,
    opened: 1994
  },
  {
    name: "Stadio Romeo Neri",
    team: "Rimini FC",
    coords: { lat: 44.0631, lng: 12.5731 },
    type: "stadium",
    capacity: 9768,
    opened: 1957
  },
  {
    name: "Stadio Comunale Città di Arezzo",
    team: "Arezzo FC",
    coords: { lat: 43.4631, lng: 11.8731 },
    type: "stadium",
    capacity: 13128,
    opened: 1958
  },
  {
    name: "Stadio Adriatico-Giovanni Cornacchia",
    team: "Pescara Calcio",
    coords: { lat: 42.4531, lng: 14.2131 },
    type: "stadium",
    capacity: 20515,
    opened: 1955
  },
  {
    name: "Stadio Comunale Vittorio Pozzo",
    team: "Biellese",
    coords: { lat: 45.5631, lng: 8.0531 },
    type: "stadium",
    capacity: 4500,
    opened: 1930
  },
  {
    name: "Stadio Comunale Zaccheria",
    team: "Foggia Calcio",
    coords: { lat: 41.4631, lng: 15.5431 },
    type: "stadium",
    capacity: 25085,
    opened: 1925
  },
  {
    name: "Stadio San Nicola",
    team: "Bari FC",
    coords: { lat: 41.0831, lng: 16.8431 },
    type: "stadium",
    capacity: 58270,
    opened: 1990
  }
];

// All stadiums// French Ligue 1 Stadiums (2024-25 season)
export const ligue1Stadiums: Stadium[] = [
  { name: 'Parc des Princes', team: 'Paris Saint-Germain', coords: { lat: 48.8414, lng: 2.2530 }, type: 'stadium', capacity: 47929, opened: 1972 },
  { name: 'Stade Vélodrome', team: 'Olympique de Marseille', coords: { lat: 43.2699, lng: 5.3958 }, type: 'stadium', capacity: 67394, opened: 1937 },
  { name: 'Groupama Stadium', team: 'Olympique Lyonnais', coords: { lat: 45.7652, lng: 4.9822 }, type: 'stadium', capacity: 59186, opened: 2016 },
  { name: 'Stade Pierre-Mauroy', team: 'LOSC Lille', coords: { lat: 50.6119, lng: 3.1305 }, type: 'stadium', capacity: 50186, opened: 2012 },
  { name: 'Allianz Riviera', team: 'OGC Nice', coords: { lat: 43.7053, lng: 7.1925 }, type: 'stadium', capacity: 35624, opened: 2013 },
  { name: 'Stade de la Beaujoire', team: 'FC Nantes', coords: { lat: 47.2561, lng: -1.5249 }, type: 'stadium', capacity: 37473, opened: 1984 },
  { name: 'Stade Geoffroy-Guichard', team: 'AS Saint-Étienne', coords: { lat: 45.4608, lng: 4.3903 }, type: 'stadium', capacity: 41965, opened: 1931 },
  { name: 'Stade de la Meinau', team: 'RC Strasbourg', coords: { lat: 48.5600, lng: 7.7553 }, type: 'stadium', capacity: 26109, opened: 1914 },
  { name: 'Roazhon Park', team: 'Stade Rennais', coords: { lat: 48.1075, lng: -1.7125 }, type: 'stadium', capacity: 29778, opened: 1912 },
  { name: 'Stade Bollaert-Delelis', team: 'RC Lens', coords: { lat: 50.4328, lng: 2.8150 }, type: 'stadium', capacity: 38223, opened: 1933 },
  { name: 'Stade Louis II', team: 'AS Monaco', coords: { lat: 43.7278, lng: 7.4158 }, type: 'stadium', capacity: 18523, opened: 1985 },
  { name: 'Stade du Moustoir', team: 'FC Lorient', coords: { lat: 47.7481, lng: -3.3689 }, type: 'stadium', capacity: 18500, opened: 1959 },
  { name: 'Stade de Reims', team: 'Stade de Reims', coords: { lat: 49.2467, lng: 4.0250 }, type: 'stadium', capacity: 21684, opened: 1935 },
  { name: 'Stade Matmut-Atlantique', team: 'FC Girondins de Bordeaux', coords: { lat: 44.8975, lng: -0.5617 }, type: 'stadium', capacity: 42115, opened: 2015 },
  { name: 'Stade Raymond Kopa', team: 'SCO Angers', coords: { lat: 47.4606, lng: -0.5311 }, type: 'stadium', capacity: 18752, opened: 1912 },
  { name: 'Stade Gaston Gérard', team: 'Dijon FCO', coords: { lat: 47.3378, lng: 5.0683 }, type: 'stadium', capacity: 16098, opened: 1969 },
  { name: 'Stade de la Mosson', team: 'Montpellier HSC', coords: { lat: 43.6225, lng: 3.8128 }, type: 'stadium', capacity: 32939, opened: 1972 },
  { name: 'Stade Bonal', team: 'FC Sochaux-Montbéliard', coords: { lat: 47.5058, lng: 6.7944 }, type: 'stadium', capacity: 20025, opened: 2000 },
];

// French Ligue 2 Stadiums (Major clubs)
export const ligue2Stadiums: Stadium[] = [
  { name: 'Stade de la Licorne', team: 'Amiens SC', coords: { lat: 49.8944, lng: 2.2647 }, type: 'stadium', capacity: 12097, opened: 1999 },
  { name: 'Stade Océane', team: 'Le Havre AC', coords: { lat: 49.5019, lng: 0.1617 }, type: 'stadium', capacity: 25178, opened: 2012 },
  { name: 'Stade Michel dOrnano', team: 'SM Caen', coords: { lat: 49.1803, lng: -0.3958 }, type: 'stadium', capacity: 21215, opened: 1993 },
  { name: 'Stade de lAbbé-Deschamps', team: 'AJ Auxerre', coords: { lat: 47.7944, lng: 3.5825 }, type: 'stadium', capacity: 23467, opened: 1918 },
  { name: 'Stade du Roudourou', team: 'EA Guingamp', coords: { lat: 48.5558, lng: -3.1547 }, type: 'stadium', capacity: 18378, opened: 1990 },
  { name: 'Stade de la Vallée du Cher', team: 'Tours FC', coords: { lat: 47.3667, lng: 0.7333 }, type: 'stadium', capacity: 13500, opened: 1979 },
  { name: 'Stade Armand-Cesari', team: 'SC Bastia', coords: { lat: 42.6667, lng: 9.4500 }, type: 'stadium', capacity: 16480, opened: 1932 },
  { name: 'Stade Marcel Picot', team: 'AS Nancy Lorraine', coords: { lat: 48.6958, lng: 6.2167 }, type: 'stadium', capacity: 20087, opened: 1926 },
  { name: 'Stade Auguste-Delaune', team: 'Stade de Reims', coords: { lat: 49.2467, lng: 4.0250 }, type: 'stadium', capacity: 21684, opened: 1935 },
  { name: 'Stade de la Beaujoire', team: 'FC Nantes', coords: { lat: 47.2561, lng: -1.5249 }, type: 'stadium', capacity: 37473, opened: 1984 },
  { name: 'Stade Saint-Symphorien', team: 'FC Metz', coords: { lat: 49.1097, lng: 6.1603 }, type: 'stadium', capacity: 26700, opened: 1923 },
  { name: 'Stade de la Maladière', team: 'Neuchâtel Xamax', coords: { lat: 47.0000, lng: 6.9333 }, type: 'stadium', capacity: 12000, opened: 2007 },
  { name: 'Stade Félix Bollaert', team: 'RC Lens', coords: { lat: 50.4328, lng: 2.8150 }, type: 'stadium', capacity: 38223, opened: 1933 },
  { name: 'Stade de la Meinau', team: 'RC Strasbourg', coords: { lat: 48.5600, lng: 7.7553 }, type: 'stadium', capacity: 26109, opened: 1914 },
  { name: 'Stade de Gerland', team: 'Olympique Lyonnais', coords: { lat: 45.7269, lng: 4.8317 }, type: 'stadium', capacity: 41842, opened: 1926 },
  { name: 'Stade du Hainaut', team: 'Valenciennes FC', coords: { lat: 50.3500, lng: 3.5333 }, type: 'stadium', capacity: 25172, opened: 2011 },
  { name: 'Stade de la Rabine', team: 'Vannes OC', coords: { lat: 47.6583, lng: -2.7500 }, type: 'stadium', capacity: 4200, opened: 1932 },
  { name: 'Stade Charléty', team: 'Paris FC', coords: { lat: 48.8181, lng: 2.3444 }, type: 'stadium', capacity: 20000, opened: 1938 },
  { name: 'Stade Gaston-Gérard', team: 'Dijon FCO', coords: { lat: 47.3378, lng: 5.0683 }, type: 'stadium', capacity: 16098, opened: 1969 },
  { name: 'Stade des Alpes', team: 'Grenoble Foot 38', coords: { lat: 45.1875, lng: 5.7333 }, type: 'stadium', capacity: 20068, opened: 2008 },
];

// Spanish La Liga Stadiums (2024-25 season)
export const laLigaStadiums: Stadium[] = [
  { name: 'Santiago Bernabéu', team: 'Real Madrid', coords: { lat: 40.4530, lng: -3.6883 }, type: 'stadium', capacity: 81044, opened: 1947 },
  { name: 'Camp Nou', team: 'FC Barcelona', coords: { lat: 41.3809, lng: 2.1228 }, type: 'stadium', capacity: 99354, opened: 1957 },
  { name: 'Cívitas Metropolitano', team: 'Atlético Madrid', coords: { lat: 40.4362, lng: -3.5992 }, type: 'stadium', capacity: 70460, opened: 2017 },
  { name: 'Ramón Sánchez-Pizjuán', team: 'Sevilla FC', coords: { lat: 37.3833, lng: -5.9706 }, type: 'stadium', capacity: 43883, opened: 1958 },
  { name: 'Mestalla', team: 'Valencia CF', coords: { lat: 39.4747, lng: -0.3589 }, type: 'stadium', capacity: 49430, opened: 1923 },
  { name: 'San Mamés', team: 'Athletic Bilbao', coords: { lat: 43.2642, lng: -2.9492 }, type: 'stadium', capacity: 53289, opened: 2013 },
  { name: 'Benito Villamarín', team: 'Real Betis', coords: { lat: 37.3564, lng: -5.9817 }, type: 'stadium', capacity: 60721, opened: 1929 },
  { name: 'Estadio de la Cerámica', team: 'Villarreal CF', coords: { lat: 39.9442, lng: -0.1031 }, type: 'stadium', capacity: 23008, opened: 1923 },
  { name: 'RCDE Stadium', team: 'RCD Espanyol', coords: { lat: 41.3475, lng: 2.0758 }, type: 'stadium', capacity: 40500, opened: 2009 },
  { name: 'Reale Arena', team: 'Real Sociedad', coords: { lat: 43.3014, lng: -1.9736 }, type: 'stadium', capacity: 39500, opened: 1993 },
  { name: 'Balaídos', team: 'RC Celta de Vigo', coords: { lat: 42.2119, lng: -8.7397 }, type: 'stadium', capacity: 29000, opened: 1928 },
  { name: 'Riazor', team: 'Deportivo La Coruña', coords: { lat: 43.3667, lng: -8.4167 }, type: 'stadium', capacity: 32660, opened: 1944 },
  { name: 'El Sadar', team: 'CA Osasuna', coords: { lat: 42.7967, lng: -1.6372 }, type: 'stadium', capacity: 23576, opened: 1967 },
  { name: 'Coliseum Alfonso Pérez', team: 'Getafe CF', coords: { lat: 40.3256, lng: -3.7147 }, type: 'stadium', capacity: 17393, opened: 1998 },
  { name: 'Estadio Ciutat de València', team: 'Levante UD', coords: { lat: 39.4975, lng: -0.3683 }, type: 'stadium', capacity: 26354, opened: 1969 },
  { name: 'Son Moix', team: 'RCD Mallorca', coords: { lat: 39.5906, lng: 2.6306 }, type: 'stadium', capacity: 23142, opened: 1999 },
  { name: 'Mendizorrotza', team: 'Deportivo Alavés', coords: { lat: 42.8367, lng: -2.6867 }, type: 'stadium', capacity: 19840, opened: 1924 },
  { name: 'Estadio de Vallecas', team: 'Rayo Vallecano', coords: { lat: 40.3919, lng: -3.6586 }, type: 'stadium', capacity: 14708, opened: 1976 },
  { name: 'Nuevo Los Cármenes', team: 'Granada CF', coords: { lat: 37.1547, lng: -3.6050 }, type: 'stadium', capacity: 19336, opened: 1995 },
  { name: 'Estadio Municipal de Butarque', team: 'CD Leganés', coords: { lat: 40.3400, lng: -3.7617 }, type: 'stadium', capacity: 12454, opened: 1998 },
];

// Spanish Segunda División Stadiums (Major clubs)
export const segundaStadiums: Stadium[] = [
  { name: 'La Romareda', team: 'Real Zaragoza', coords: { lat: 41.6344, lng: -0.8958 }, type: 'stadium', capacity: 33608, opened: 1957 },
  { name: 'Carlos Tartiere', team: 'Real Oviedo', coords: { lat: 43.3583, lng: -5.8667 }, type: 'stadium', capacity: 30500, opened: 2000 },
  { name: 'Estadio de Gran Canaria', team: 'UD Las Palmas', coords: { lat: 28.0992, lng: -15.4539 }, type: 'stadium', capacity: 32400, opened: 2003 },
  { name: 'Heliodoro Rodríguez López', team: 'CD Tenerife', coords: { lat: 28.4822, lng: -16.3322 }, type: 'stadium', capacity: 22824, opened: 1925 },
  { name: 'Nuevo Mirandilla', team: 'Cádiz CF', coords: { lat: 36.5042, lng: -6.2742 }, type: 'stadium', capacity: 20724, opened: 1955 },
  { name: 'Estadio Municipal de Anduva', team: 'SD Ponferradina', coords: { lat: 42.5500, lng: -6.6000 }, type: 'stadium', capacity: 8400, opened: 2000 },
  { name: 'Estadio de la Nova Creu Alta', team: 'CE Sabadell FC', coords: { lat: 41.5500, lng: 2.1167 }, type: 'stadium', capacity: 11981, opened: 1967 },
  { name: 'Estadio Santo Domingo', team: 'SD Alcorcón', coords: { lat: 40.3467, lng: -3.8267 }, type: 'stadium', capacity: 5000, opened: 1999 },
  { name: 'Estadio José Zorrilla', team: 'Real Valladolid', coords: { lat: 41.6442, lng: -4.7608 }, type: 'stadium', capacity: 26512, opened: 1982 },
  { name: 'Estadio El Toralín', team: 'SD Ponferradina', coords: { lat: 42.5500, lng: -6.6000 }, type: 'stadium', capacity: 8400, opened: 2000 },
  { name: 'Estadio Francisco de la Hera', team: 'CD Extremadura', coords: { lat: 39.1667, lng: -5.9667 }, type: 'stadium', capacity: 15200, opened: 1976 },
  { name: 'Estadio Municipal de Butarque', team: 'CD Leganés', coords: { lat: 40.3400, lng: -3.7617 }, type: 'stadium', capacity: 12454, opened: 1998 },
  { name: 'Estadio de los Juegos Mediterráneos', team: 'UD Almería', coords: { lat: 36.8297, lng: -2.4103 }, type: 'stadium', capacity: 22000, opened: 2004 },
  { name: 'Estadio Nuevo Colombino', team: 'Recreativo de Huelva', coords: { lat: 37.2667, lng: -6.9500 }, type: 'stadium', capacity: 21670, opened: 2001 },
  { name: 'Estadio de Castalia', team: 'CD Castellón', coords: { lat: 39.9833, lng: -0.0333 }, type: 'stadium', capacity: 15500, opened: 1987 },
  { name: 'Estadio Municipal de Ipurua', team: 'SD Eibar', coords: { lat: 43.2067, lng: -2.4733 }, type: 'stadium', capacity: 8164, opened: 1947 },
  { name: 'Estadio Anxo Carro', team: 'CD Lugo', coords: { lat: 43.0167, lng: -7.5500 }, type: 'stadium', capacity: 7070, opened: 1967 },
  { name: 'Estadio Municipal de Pasarón', team: 'CD Pontevedra', coords: { lat: 42.4333, lng: -8.6500 }, type: 'stadium', capacity: 12000, opened: 1970 },
  { name: 'Estadio de Riazor', team: 'Deportivo La Coruña', coords: { lat: 43.3667, lng: -8.4167 }, type: 'stadium', capacity: 32660, opened: 1944 },
  { name: 'Estadio Municipal de Anduva', team: 'SD Mirandés', coords: { lat: 42.6833, lng: -2.9167 }, type: 'stadium', capacity: 6000, opened: 2007 },
];

// Combined export for all stadiums
export const allStadiums = [
  ...premierLeagueStadiums,
  ...championshipStadiums,
  ...serieAStadiums,
  ...serieBStadiums,
  ...ligue1Stadiums,
  ...ligue2Stadiums,
  ...laLigaStadiums,
  ...segundaStadiums,
];

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
