import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { UnifiedPost } from '@/types/post';

interface PostCardProps {
  post: UnifiedPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  console.log('PostCard authorImage:', post.authorImage);
  const postDate = post.createdAt ? format(post.createdAt, 'yyyy.MM.dd') : '';

  const title = post.title || '投稿';
  const subtext = post.subtext || '';
  const href = post.href || '/'; // Fallback to root if href is missing

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col h-full relative">
      <Link href={href} className="no-underline">
        <div className="w-full aspect-[4/3] relative">
          {post.imageUrls && post.imageUrls.length > 0 ? (
            <Image
              src={post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls[0] : '/default-avatar.svg'}
              alt={title || 'Post image'}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
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
      </Link>
      <div className="p-2 flex flex-col flex-grow">
        <Link href={href} className="no-underline">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight h-10 mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 h-4">
            {subtext}
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
          <span className="ml-auto shrink-0">{postDate}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
