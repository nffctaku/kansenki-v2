// app/edit/[id]/page.tsx
'use client';

import { useParams, useSearchParams } from 'next/navigation';
import PostForm from '@/components/PostForm';

export default function EditPostPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  // useParams can return string or string[]. Handle both cases.
  const postId = Array.isArray(id) ? id[0] : id;
  const collectionName = searchParams.get('collection');

  return <PostForm postId={postId} collectionName={collectionName || undefined} />;
}