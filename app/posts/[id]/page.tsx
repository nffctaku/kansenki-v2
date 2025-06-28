'use client';

import { useParams } from 'next/navigation';

export default function PostDetailPage() {
  const params = useParams();

  return (
    <div>
      <h1>Post ID: {params.id}</h1>
      <p>This is a minimal page for debugging Vercel build errors.</p>
    </div>
  );
}
