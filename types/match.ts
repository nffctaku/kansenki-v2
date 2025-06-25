// types/match.ts

export interface Match {
  teamA: string;
  teamB: string;
  competition: string;
  stadium?: string;
  seat?: string;
  seatReview?: string;
  ticketPrice?: string;
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

export interface Post {
  id: string;
  episode?: string; // titleから変更
  author: string; // nickname
  userId?: string;
  imageUrls: string[];
  season: string;
  matches: Match[];
  league: string;
  homeTeam: string;
  awayTeam: string;
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
}
