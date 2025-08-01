'use client';

import PostForm from '@/components/PostForm';
import { useSearchParams } from 'next/navigation';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const searchParams = useSearchParams();
  const collectionName = searchParams.get('collection');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">投稿を編集</h1>
      {collectionName ? (
        <PostForm postId={id} collectionName={collectionName} />
      ) : (
        <div className="text-red-500">エラー: 投稿の種類が特定できませんでした。</div>
      )}
    </div>
  );
}
