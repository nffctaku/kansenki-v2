import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  username: string; // nickname
  bio?: string;
  favoriteTeam?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
