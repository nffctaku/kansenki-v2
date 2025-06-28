'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Post } from '@/types/match';
import Link from 'next/link';
import Image from 'next/image';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const postRef = doc(db, 'simple-posts', id);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          setPost({ id: postSnap.id, ...postSnap.data() } as Post);
        } else {
          setError('投稿が見つかりません。');
        }
      } catch (err) {
        setError('投稿の読み込み中にエラーが発生しました。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="p-6">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Post Images Carousel */}
        <div className="relative w-full aspect-square bg-gray-200 dark:bg-gray-700">
          {post.imageUrls && post.imageUrls.length > 0 ? (
            <Image
              src={post.imageUrls[0]}
              alt="Post image"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No Image</p>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Author Info */}
          <div className="flex items-center mb-4">
            <Link href={`/user/${post.userId}`} className="flex items-center">
              <p className="font-semibold text-gray-800 dark:text-white hover:underline">
                {post.author}
              </p>
            </Link>
          </div>

          {/* Post Title (Episode) */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {post.episode || '無題'}
          </h1>

          {/* Like Button */}
          <div className="flex items-center text-red-500 mb-4">
            <span>❤</span>
            <span className="ml-1">{post.likeCount || 0}</span>
          </div>

          {/* Match Details */}
          <div className="mt-4 border-t pt-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-2">試合情報</h2>
            {post.matches && post.matches.length > 0 ? (
              post.matches.map((match, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <p><strong>{match.competition}</strong> - {match.season}</p>
                  <p>{match.homeTeam} vs {match.awayTeam}</p>
                  <p><strong>Result:</strong> {match.homeScore} - {match.awayScore}</p>
                  <p><strong>Date:</strong> {match.date} {match.kickoff}</p>
                  <p><strong>Stadium:</strong> {match.stadium}</p>
                </div>
              ))
            ) : (
              <p>試合情報がありません。</p>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-6">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:underline"
            >
              ← 戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
