import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { SimplePost } from '@/types/match';

interface PostCardProps {
  post: SimplePost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const postDate = post.createdAt ? format(post.createdAt, 'yyyy.MM.dd') : '';
  const title = post.episode;
  const matchInfo = post.matches?.[0]
    ? `${post.matches[0].homeTeam || post.matches[0].teamA} vs ${post.matches[0].awayTeam || post.matches[0].teamB}`
    : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col h-full">
      <Link href={`/posts/${post.id}`} className="no-underline flex flex-col flex-grow">
        <div className="w-full aspect-[4/3] relative">
          {post.imageUrls && post.imageUrls.length > 0 ? (
            <Image
              src={post.imageUrls[0]}
              alt={title || 'Post image'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          {post.league && (
            <div className="absolute top-1.5 left-1.5 bg-black bg-opacity-60 text-white text-[10px] px-2 py-0.5 rounded">
              {post.league}
            </div>
          )}
        </div>
        <div className="p-2 flex flex-col flex-grow">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight h-10 mb-1">
            {title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 h-4">
            {matchInfo}
          </p>
          <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2">
            <span className="truncate">
              {post.author}
            </span>
            <span>{postDate}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
