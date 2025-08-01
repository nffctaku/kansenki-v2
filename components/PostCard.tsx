import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { UnifiedPost } from '@/types/post';
import LikeButton from './LikeButton';

interface PostCardProps {
  post: UnifiedPost;
  showLikeButton?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, showLikeButton = true }) => {
  const authorImage = post.authorImage || '/default-avatar.svg';
  console.log('PostCard authorImage:', authorImage);
  const getSafeDate = (date: any): Date | null => {
    if (!date) return null;
    if (date instanceof Date) return date;
    if (typeof date.toDate === 'function') return date.toDate();
    return null;
  };

  const safeCreatedAt = getSafeDate(post.createdAt);
  const postDate = safeCreatedAt ? format(safeCreatedAt, 'yyyy.MM.dd') : '';

  const collection = post.collectionName;
  const match = post.originalData?.match;
  const userTitle = post.originalData?.title?.trim();

  let displayTitle: string = post.title || '投稿';
  let displaySubtext: string | null = post.subtext;

  if (match && match.homeTeam && match.awayTeam) {
    const matchCard = `${match.homeTeam} vs ${match.awayTeam}`;
    if (collection === 'posts' && userTitle) {
      // Case 1: 'posts' with a user-defined title.
      displayTitle = userTitle;
      displaySubtext = matchCard;
    } else {
      // Case 2: 'simple-posts' OR 'posts' without a user-defined title.
      displayTitle = matchCard;
      displaySubtext = match.league || null;
    }
  }
  const href = post.href || '/'; // Fallback to root if href is missing

  const getCategoryLabel = (p: UnifiedPost): string | null => {
    if (p.category && p.category.trim() !== '') {
      return p.category;
    }
    if (p.league && p.league.trim() !== '') {
      return p.league;
    }
    // Fallback logic when category and league are not available
    switch (p.collectionName) {
      case 'simple-travels':
        return '旅行記';
      case 'posts':
      case 'simple-posts':
        return '観戦記録';
      case 'spots':
        return 'スポット';
      default:
        return null;
    }
  };

  const categoryLabel = getCategoryLabel(post);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col h-full relative">
      <Link href={href} className="no-underline">
        <div className="w-full aspect-[4/3] relative">
          {post.imageUrls && post.imageUrls.length > 0 ? (
            <Image
              src={post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls[0] : '/default-avatar.svg'}
              alt={displayTitle || 'Post image'}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          {categoryLabel && (
            <div className="absolute top-1.5 left-1.5 bg-black bg-opacity-60 text-white text-[10px] px-2 py-0.5 rounded z-10">
              {categoryLabel}
            </div>
          )}
        </div>
      </Link>
      <div className="p-2 flex flex-col flex-grow">
        <Link href={href} className="no-underline">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight h-10 mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {displayTitle}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 h-4">
            {displaySubtext}
          </p>
        </Link>
        <div className="mt-auto flex items-center text-xs text-gray-500 dark:text-gray-400 pt-2">
          <Link href={`/user/${post.authorId}`} className="flex items-center gap-2 truncate no-underline text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors z-10">
            <div className="relative w-5 h-5 rounded-full overflow-hidden">
              <Image
                src={post.authorImage || '/default-avatar.svg'}
                alt={post.authorName || 'avatar'}
                fill
                className="object-cover"
              />
            </div>
            <span className="truncate">{post.authorName || '名無し'}</span>
          </Link>
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {showLikeButton && <LikeButton postId={post.id} collectionName={post.collectionName} />}
            <span>{postDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
