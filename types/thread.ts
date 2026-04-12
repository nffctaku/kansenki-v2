import { Timestamp } from 'firebase/firestore';

export type Thread = {
  id: string;
  authorId: string;
  authorName: string;
  authorImage?: string | null;
  title: string;
  body: string;
  poll?: {
    options: [string, string, string, string];
    counts: [number, number, number, number];
  } | null;
  createdAt: Date | Timestamp | null;
};

export type ThreadReply = {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorImage?: string | null;
  body: string;
  createdAt: Date | Timestamp | null;
};
