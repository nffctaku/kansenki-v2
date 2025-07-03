import { MatchInfo, Hotel, Spot, IndividualCost } from './match';
export type { MatchInfo, Hotel, Spot, IndividualCost };
import { User } from 'firebase/auth';

// NOTE: This is a placeholder type. You may need to adjust it
// based on the actual data structure used in the Transport section.
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

export interface Post {
  id: string;
  authorId: string;
  authorNickname: string;
  isPublic: boolean;
  title: string;
  content: string; // memories
  firstAdvice: string; // message
  goods: string;
  imageUrls: string[];
  categories: string[];
  match?: MatchInfo;
  createdAt: any; // Consider using Timestamp type
  updatedAt: any; // Consider using Timestamp type
  parentPostId?: string | null;
  travelId?: string;
  likeCount?: number;
  helpfulCount?: number;

  // Fields from PostFormData to be included in Post
  postType: 'new' | 'additional';
  travelStartDate?: string;
  travelEndDate?: string;
  visitedCities?: { id: string; name: string }[];
  outboundTotalDuration?: string;
  inboundTotalDuration?: string;
  transports?: Transport[];
  hotels?: Hotel[];
  spots?: Spot[];
  costs?: IndividualCost[];
  belongings?: string;
  youtubeUrl?: string;
}

export interface SectionProps {
  formData: PostFormData;
  setFormData: React.Dispatch<React.SetStateAction<PostFormData>>;
  user?: User | null;
  likeCount?: number;
  helpfulCount?: number;
}

export interface PostFormData {
  id: string | null;
  authorNickname: string;
  postType: 'new' | 'additional';
  parentPostId?: string | null;
  title: string;
  isPublic: boolean;

  // Match and Ticket Info
  match: MatchInfo | null;

  // Travel Info
  travelStartDate: string;
  travelEndDate: string;
  visitedCities: { id: string; name: string }[];
  transports: Transport[];
  outboundTotalDuration?: string;
  inboundTotalDuration?: string;
  hotels?: Hotel[];
  spots?: Spot[];
  costs?: IndividualCost[];

  // Other Info
  belongings?: string;
  goods?: string;
  memories?: string;
  message?: string;
  youtubeUrl?: string;

  // Images & Categories
  imageFiles: File[];
  existingImageUrls: string[];
  categories: string[];
}
