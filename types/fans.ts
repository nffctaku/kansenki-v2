import { Timestamp } from 'firebase/firestore';

export interface FansArticle {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  content: any; // TipTap JSON content
  coverImage?: string; // Cloudinary URL
  publishedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
