// types/match.ts

// Re-defining to ensure all properties are correctly recognized by the compiler.
export interface MatchInfo {
  competition: string;
  season: string;
  date: string;
  kickoff: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | string;
  awayScore: number | string;
  stadium: string;
  ticketPrice: string;
  ticketPurchaseRoute: string;
  seat: string;
  seatReview: string;
}



export interface Spot {
  name?: string;
  url?: string;
  rating?: number;
  comment?: string;
}

export interface Hotel {
  name?: string;
  url?: string;
  rating?: number;
  comment?: string;
}

export interface Cost {
  flight?: number;
  hotel?: number;
  ticket?: number;
  transport?: number;
  food?: number;
  goods?: number;
  other?: number;
}

export interface Flight {
  name: string;
  seat: string;
}

export interface Travel {
  id: string;
  userId: string;
  season: string;
  travelDuration?: string;
  flights?: Flight[];
  hotels?: Hotel[];
  costTotal?: number;
  cost?: Cost;
  cities?: string;
}

export interface Post {
  id: string;
  episode?: string; // titleから変更
  author: string; // nickname
  userId?: string;
  imageUrls: string[];
  season: string;
  matches: MatchInfo[];
  league: string;
  likeCount: number;
  items?: string;
  goods?: string;
  firstAdvice?: string;
  cost?: Cost;
  hotels?: Hotel[];
  spots?: Spot[];
  category?: string;
  lifestyle?: string;
  watchYear?: number;
  watchMonth?: number;
  stayDuration?: string;
  goFlights?: Flight[];
  returnFlights?: Flight[];
  goTime?: string;
  goType?: string;
  goVia?: string;
  returnTime?: string;
  returnType?: string;
  returnVia?: string;
  travelId?: string;
}
