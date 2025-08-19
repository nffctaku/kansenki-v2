'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import LikeButton from '@/components/LikeButton';
import ThanksButton from '@/components/ThanksButton';
import BookmarkButton from '@/components/BookmarkButton';
import ShareButton from '@/components/ShareButton';

import { format } from 'date-fns';

// Spotの型定義（緯度・経度も含む）
type UserInfo = {
  nickname: string;
  avatarUrl?: string;
};

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
  type: 'spot' | 'hotel';
  price?: number;
  bookingSite?: string;
  nights?: number;
  overallRating?: number;
  accessRating?: number;
  cleanlinessRating?: number;
  comfortRating?: number;
  facilityRating?: number;
  staffRating?: number;
}

const SpotDetailPage = () => {
  const params = useParams();
  const { id } = params;
  const [spot, setSpot] = useState<Spot | null>(null);
  const [collectionName, setCollectionName] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = async (authorId: string) => {
    if (!authorId) return;
    try {
      const userDocRef = doc(db, 'users', authorId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUserInfo(userDocSnap.data() as UserInfo);
      } else {
        console.log('No such user!');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchSpot = async () => {
      const collectionNames = ['spots', 'posts', 'simple-posts', 'simple-travels'];
      let found = false;

      for (const name of collectionNames) {
        try {
          const docRef = doc(db, name, id as string);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            // spotName or name field check for spot type
            if (data.spotName || data.category || data.type === 'spot' || data.type === 'hotel') {
              const spotData = {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt, // Keep as Timestamp
              } as Spot;
              setSpot(spotData);
              setCollectionName(name);
              if (spotData.authorId) {
                fetchUserInfo(spotData.authorId);
              }
              found = true;
              break;
            }
          }
        } catch (err) {
          console.error(`Error fetching spot from ${name}:`, err);
        }
      }

      if (!found) {
        setError('お探しのスポットは見つかりませんでした。');
      }
      setLoading(false);
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
                      <AspectRatio ratio={1 / 1}>
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

          <div className="space-y-6">
            {spot.type === 'hotel' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">総合評価</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-slate-800">{spot.overallRating?.toFixed(1)}</span>
                    <span className="text-yellow-400">{'★'.repeat(Math.round(spot.overallRating || 0))}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">金額</h3>
                  <p className="text-xl">{spot.price ? `${spot.price.toLocaleString()}円` : 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">予約サイト</h3>
                  <p>{spot.bookingSite || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">泊数</h3>
                  <p>{spot.nights ? `${spot.nights}泊` : 'N/A'}</p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold">評価</h3>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-2xl ${i < spot.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                  ))}
                  <span className='ml-2 text-lg'>({spot.rating})</span>
                </div>
              </div>
            )}

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

        <div className="my-4 py-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-around">
            <div className="flex flex-col items-center gap-2">
              {collectionName && <LikeButton postId={spot.id} collectionName={collectionName} size="md" />}
              <span className="text-sm text-slate-600 dark:text-slate-400">いいね</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              {collectionName && <ThanksButton postId={spot.id} collectionName={collectionName} size="md" />}
              <span className="text-sm text-slate-600 dark:text-slate-400">参考になった</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              {collectionName && <BookmarkButton postId={spot.id} collectionName={collectionName} size="md" />}
              <span className="text-sm text-slate-600 dark:text-slate-400">保存</span>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <ShareButton title={spot.spotName} url={`https://kansenki.footballtop.net/spots/${id}`} />
          </div>
        </div>

        <CardFooter className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 pt-4">
            <Link href={`/user/${spot.authorId}`} className="flex items-center space-x-2 hover:underline">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={userInfo?.avatarUrl || '/default-avatar.svg'}
                  alt={userInfo?.nickname || 'avatar'}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <span>{userInfo?.nickname || '匿名ユーザー'}</span>
            </Link>
            <span>{spot.createdAt ? format(new Date(spot.createdAt.seconds * 1000), 'yyyy.MM.dd') : ''}</span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SpotDetailPage;
