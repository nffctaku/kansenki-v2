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
  ticketPurchaseRouteUrl?: string;
  ticketTeam?: string;
  isTour?: boolean;
  isHospitality?: boolean;
  hospitalityDetail?: string;
  seat: string;
  seatReview: string;
  // Legacy fields for compatibility
  teamA?: string;
  teamB?: string;
  scoreA?: number | string;
  scoreB?: number | string;
}

export interface Transport {
  id: string;
  direction: 'outbound' | 'inbound';
  method: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  airline: string;
  seatType: string;
}

export interface Spot {
  id: string;
  name: string;
  url?: string;
  city?: string;
  description: string;
  rating?: number;
  comment?: string;
}

export interface Hotel {
  id: string; // Added for unique key
  name: string;
  city?: string;
  nights?: number;
  price?: number;
  bookingSite?: string;
  url?: string;
  comment?: string;
  overallRating?: number;
  accessRating?: number;
  cleanlinessRating?: number;
  comfortRating?: number;
  facilityRating?: number;
  staffRating?: number;
}

// This is for individual cost items
export interface IndividualCost {
  id: string;
  category: string;
  amount: number;
}

// This is for the summary of costs
export interface CostSummary {
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
  cost?: CostSummary; // Changed to CostSummary
  cities?: string;
  individualCosts?: IndividualCost[];
}

export interface Post {
  parentPostId?: string;
  id: string;
  authorId: string;
  authorNickname: string;
  title: string;
  content: string; // 観戦記
  isPublic: boolean;
  imageUrls: string[];
  likeCount: number;
  helpfulCount: number;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  match?: MatchInfo;
  travelId?: string;
  costs?: IndividualCost[];
  totalCost?: number;
  hotels?: Hotel[];
  spots?: Spot[];
  goods?: string;
  firstAdvice?: string; // これから行く人へのアドバイス
  transports?: Transport[];
  outboundTotalDuration?: string;
  inboundTotalDuration?: string;
  youtubeUrl?: string;
}

// For data from 'simple-travels' collection
export interface SimpleTravel {
  id: string;
  authorId: string;
  name: string;
  cost?: CostSummary; // Changed to CostSummary
  totalCost?: number;
  hotels?: Hotel[];
  spots?: Spot[];
  goods?: string;
  firstAdvice?: string;
  createdAt: any;
  updatedAt: any;
}

// For data from 'simple-posts' collection for list pages
export interface SimplePost {
  id: string;
  isPublic?: boolean;
  imageUrls: string[];
  season: string;
  episode: string;
  author: string; // authorNickname
  authorId?: string; // Add authorId
  league: string; // competition name
  matches: {
    homeTeam: string;
    awayTeam: string;
    competition: string;
    date?: string;
  }[];
  likeCount: number;
  helpfulCount: number;
  createdAt?: Date;
}
