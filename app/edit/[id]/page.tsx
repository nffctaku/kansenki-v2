'use client';

import { useParams } from 'next/navigation';
import CloudinaryPostForm from '@/app/form/page';

export default function EditPage() {
  const { id } = useParams();

  // idが配列の場合は最初の要素を、文字列の場合はそのまま使用
  const postId = Array.isArray(id) ? id[0] : id;

  return <CloudinaryPostForm postId={postId} />;
}
