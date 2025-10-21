import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  nickname: string;
  bio?: string;
  favoriteTeam?: string;
  bookmarks?: { collectionName: string; postId: string }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Social Links
  xLink?: string;
  instagramLink?: string;
  youtubeLink?: string;
  noteLink?: string;

  // Travel Profile
  travelFrequency?: string;
  overseasMatchCount?: string;
  visitedCountries?: string[];

  // Legacy fields for backward compatibility
  twitter?: string;
  instagram?: string;
  youtube?: string;
  note?: string;
}
