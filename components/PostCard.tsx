import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { UnifiedPost } from '@/mypage/types';

interface PostCardProps {
  post: UnifiedPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const postDate = post.createdAt ? format(post.createdAt, 'yyyy.MM.dd') : '';

  const title = post.title || '投稿';
  const subtext = post.subtext || '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col h-full">
      <Link href={post.href} className="no-underline flex flex-col flex-grow">
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
            {subtext}
          </p>
          <div className="mt-auto flex items-center text-xs text-gray-500 dark:text-gray-400 pt-2">
                        <Link href={`/user/${post.author.id}`} className="flex items-center gap-2 truncate no-underline text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <div className="relative w-5 h-5 rounded-full overflow-hidden">
                <Image
                                    src={post.author?.avatar || '/default-avatar.svg'}
                  alt={post.author?.nickname || 'avatar'}
                  fill
                  className="object-cover"
                />
              </div>
                            <span className="truncate">{post.author?.nickname || '名無し'}</span>
            </Link>
            <span className="ml-auto shrink-0">{postDate}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
