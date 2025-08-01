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
}
