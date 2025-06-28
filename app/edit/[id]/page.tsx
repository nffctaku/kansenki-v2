// app/edit/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import PostForm from '@/components/PostForm';

export default function EditPostPage() {
  const { id } = useParams();
  // useParams can return string or string[]. Handle both cases.
  const postId = Array.isArray(id) ? id[0] : id;

  return <PostForm postId={postId} />;
}