'use client';

import Link from 'next/link';
import PostCard from '@/components/PostCard';
import SpotCard, { SpotData } from '@/components/SpotCard';
import { SimplePost } from '@/types/match';
import { UnifiedPost } from './types';

interface PostGridProps {
  items: UnifiedPost[];
  showDeleteButton: boolean;
  onDelete?: (id: string) => void;
}

export default function PostGrid({ items, showDeleteButton, onDelete }: PostGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
      {items.map((item) => (
        <div key={item.id} className="relative group">
          {item.postType === 'post' ? (
            <PostCard post={item} />
          ) : (
            <Link href={item.href} className="block h-full">
              <SpotCard spot={item.originalData as SpotData} />
            </Link>
          )}
          {showDeleteButton && onDelete && (
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={() => onDelete(item.id)}
                className="bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zM4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
