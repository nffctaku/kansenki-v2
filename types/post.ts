import { Timestamp } from 'firebase/firestore';
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
  authorName: string;
  authorImage?: string | null;

  status: 'published' | 'draft';
  title: string;
  content: string; // memories
  firstAdvice: string; // message
  goods: string;
  images: string[];
  categories: string[];
  match?: MatchInfo;
  createdAt: Date | null; // Consider using Timestamp type
  updatedAt: any; // Consider using Timestamp type
  parentPostId?: string | null;
  travelId?: string;
  likeCount?: number;
  helpfulCount?: number;
  season?: string;

  // Fields from PostFormData to be included in Post
  postType: 'new' | 'additional' | 'simple';
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
  isPublic?: boolean;
}

export interface SectionProps {
  formData: PostFormData;
  setFormData: React.Dispatch<React.SetStateAction<PostFormData>>;
  user?: User | null;
  likeCount?: number;
  helpfulCount?: number;
}

export interface PostFormData {
  authorId: string;
  authorName: string;
  authorImage?: string | null;
  id: string | null;
  postType: 'new' | 'additional' | 'simple';
  parentPostId?: string | null;
  title: string;
  status: 'published' | 'draft';

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
  isPublic: boolean;

  // User Profile related fields
  visitedCountries?: string[];
  overseasMatchCount?: string;
  travelFrequency?: string;
}

export interface UnifiedPost {
  id: string;
  postType: 'post' | 'simple-post' | 'spot';
  collectionName: string; // 'posts', 'simple-posts', 'spots'など
  title: string;
  subtext: string | null;
  imageUrls: string[];
  authorId: string;
  authorName: string;
  authorImage?: string;
  createdAt: Date | Timestamp | null;
  league: string;
  country: string;
  href: string;
  editHref?: string; // 投稿編集ページへのリンク
  originalData: any; 
}

export const toUnifiedPost = (
    item: any, 
    type: string, 
    user: User | null, 
    currentUserProfile: { nickname: string; avatarUrl: string }, 
    authorProfiles: Map<string, { nickname: string; photoURL: string }>
  ): UnifiedPost | null => {
  if (!item || !item.id) return null;

  const post = item as any;
  const authorId = post.author?.id || post.authorId || post.userId || '';
  const isCurrentUser = user && authorId === user.uid;
  
  const authorProfile = isCurrentUser 
    ? { nickname: currentUserProfile.nickname, photoURL: currentUserProfile.avatarUrl } 
    : authorProfiles.get(authorId);

  const authorName = authorProfile?.nickname || post.author?.name || post.authorName || '名無し';
  const authorImage = authorProfile?.photoURL || post.author?.image || post.authorImage || '/default-avatar.svg';

  let subtext: string | null = null;
  if (post.match?.stadium?.name) {
    subtext = `${post.match.league} | ${post.match.stadium.name}`;
  } else if (post.spotName) {
    subtext = post.spotName;
  }

  let createdAt: Date | null = null;
  if (post.createdAt) {
    if (post.createdAt instanceof Timestamp) {
      createdAt = post.createdAt.toDate();
    } else if (typeof post.createdAt === 'string') {
      createdAt = new Date(post.createdAt);
    } else if (post.createdAt.seconds) {
      createdAt = new Timestamp(post.createdAt.seconds, post.createdAt.nanoseconds).toDate();
    }
  }

  const unifiedPost: UnifiedPost = {
    id: post.id,
    postType: type as any,
    collectionName: type,
    title: post.title || post.spotName || '無題',
    subtext,
    imageUrls: post.imageUrls || post.images || (post.imageUrl ? [post.imageUrl] : []),
    authorId,
    authorName,
    authorImage,
    createdAt,
    league: post.match?.league || '',
    country: post.match?.country || '',
    href: `/posts/${post.id}`,
    originalData: item,
  };

  // ログインユーザーが投稿者の場合のみ編集リンクを追加
  if (isCurrentUser) {
    unifiedPost.editHref = `/posts/${post.id}/edit?collection=${type}`;
  }

  return unifiedPost;
};
