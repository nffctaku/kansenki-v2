'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import { format } from 'date-fns';

// Spotの型定義（緯度・経度も含む）
interface Spot {
  id: string;
  spotName: string;
  url: string;
  comment: string;
  rating: number;
  imageUrls: string[];
  authorId: string;
  authorNickname: string;
  createdAt: Timestamp;
  country: string;
  category: string;
}

const SpotDetailPage = () => {
  const params = useParams();
  const { id } = params;
  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchSpot = async () => {
      try {
        const docRef = doc(db, 'spots', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const spotData = {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt, // Keep as Timestamp
          } as Spot;
          setSpot(spotData);
        } else {
          setError('お探しのスポットは見つかりませんでした。');
        }
      } catch (err) {
        console.error('Error fetching spot:', err);
        setError('データの取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchSpot();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">ローディング中...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
  }

  if (!spot) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{spot.spotName}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
            <span className="font-semibold">{spot.country}</span>
            <span>/</span>
            <span>{spot.category}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {spot.imageUrls && spot.imageUrls.length > 0 && (
            <Carousel className="w-full">
              <CarouselContent>
                {spot.imageUrls.map((url, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <AspectRatio ratio={16 / 9}>
                        <Image src={url} alt={`${spot.spotName}の画像 ${index + 1}`} fill className="rounded-md object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
                      </AspectRatio>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">評価</h3>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-2xl ${i < spot.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                ))}
                 <span className='ml-2 text-lg'>({spot.rating})</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">コメント</h3>
              <p className="text-base whitespace-pre-wrap break-words">{spot.comment}</p>
            </div>

            {spot.url && (
              <div>
                <h3 className="text-lg font-semibold">関連リンク</h3>
                <a href={spot.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">{spot.url}</a>
              </div>
            )}

            

          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 pt-4">
            <span>投稿者: <span className="font-medium text-gray-700 dark:text-gray-300">{spot.authorNickname || '匿名ユーザー'}</span></span>
            <span>{spot.createdAt ? format(new Date(spot.createdAt.seconds * 1000), 'yyyy.MM.dd') : ''}</span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SpotDetailPage;
