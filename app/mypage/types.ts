// Unified interface for all card types
export interface UnifiedPost {
  id: string;
  postType: 'post' | 'spot';
  title: string;
  subtext: string | null;
  imageUrls: string[];
  author: {
        id: string;
    nickname: string;
    avatar?: string;
  };
  createdAt: Date | null;
  league?: string;
  country?: string;
  href: string;
  originalData: any; // Keep original data for type guards
}
