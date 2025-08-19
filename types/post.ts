import { Timestamp } from 'firebase/firestore';
import { MatchInfo, Hotel, Spot, IndividualCost } from './match';
export type { MatchInfo, Hotel, Spot, IndividualCost };
import { User } from 'firebase/auth';
import { UserProfile } from './user';

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
  tags: string[];
  createdAt: any; // Consider using Timestamp type
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

  updatedAt: any; // Consider using Timestamp type
  parentPostId?: string | null;
  travelId?: string;
  likeCount?: number;
  helpfulCount?: number;
  season?: string;
  league?: string | null;
  category?: string;

  // Fields from PostFormData to be included in Post
  postType: 'new' | 'additional' | 'simple' | 'add';
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
  content: string;
  authorId: string;
  authorName: string;
  authorImage?: string | null;
  id: string | null;
  postType: 'new' | 'additional' | 'simple' | 'add';
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

export interface UnifiedPostWithDate extends UnifiedPost {
  createdAt: Date | null;
}

export interface UnifiedPost {
  id: string;
  postType: 'post' | 'simple-post' | 'spot' | 'simple-travel';
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
  category?: string;
  originalData: any;
  editHref?: string; // 投稿編集ページへのリンク
}

export const toUnifiedPost = (
  item: any, 
  type: string, 
  user: User | null,
  currentUserProfile: UserProfile | null,
  authorProfiles: Map<string, { nickname: string; photoURL: string; }>
): UnifiedPost | null => {
  if (!item || !item.id) return null;

  const post = item as any;
  const authorId = post.author?.id || post.authorId || post.userId || '';
  const isCurrentUser = user && authorId === user.uid;

  const authorProfile = authorProfiles.get(authorId);

  const authorName = post.authorName || 
    (isCurrentUser ? currentUserProfile?.nickname : authorProfile?.nickname) || 
    post.author?.name || 
    '名無し';

  const authorImage = post.authorImage || 
    (isCurrentUser ? currentUserProfile?.avatarUrl : authorProfile?.photoURL) || 
    post.author?.image || 
    '/default-avatar.svg';

  const getTitle = () => {
    if (post.title?.trim()) {
      return post.title.trim();
    }
    const homeTeam = post.match?.homeTeam || post.homeTeam;
    const awayTeam = post.match?.awayTeam || post.awayTeam;
    if (homeTeam && awayTeam) {
      return `${homeTeam} vs ${awayTeam}`;
    }
    return post.spotName || post.title || '無題';
  };

  const title = getTitle();
  const subtext = post.match?.stadium?.name || post.stadium || null;

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
    title,
    subtext,
    imageUrls: post.imageUrls || post.images || (post.imageUrl ? [post.imageUrl] : []),
    authorId,
    authorName,
    authorImage,
    createdAt,
    league: post.category || post.match?.competition || post.match?.league || post.league || '',
    category: (post.categories && post.categories.length > 0) ? post.categories[0] : (post.match?.category || ''),
    country: post.match?.country || post.country || '',
                href: (() => {
      switch (type) {
        case 'post':
        case 'posts':
          return `/posts/${post.id}`;
        case 'simple-post':
        case 'simple-posts':
          return `/simple-posts/${post.id}`;
        case 'spot':
        case 'spots':
          return `/spots/${post.id}`;
        case 'simple-travel':
        case 'simple-travels':
          return `/simple-travels/${post.id}`;
        default:
          return `/posts/${post.id}`;
      }
    })(),
    originalData: item,
  };

  // ログインユーザーが投稿者の場合のみ編集リンクを追加
  if (isCurrentUser) {
    switch (type) {
      case 'spot':
      case 'spots':
        unifiedPost.editHref = `/create-spot?id=${post.id}`;
        break;
      case 'post':
      case 'posts':
      case 'simple-post':
      case 'simple-posts':
      case 'simple-travel':
      case 'simple-travels':
      default:
        unifiedPost.editHref = `/posts/${post.id}/edit?collection=${type}`;
        break;
    }
  }

  return unifiedPost;
};
