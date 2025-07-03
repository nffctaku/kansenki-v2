'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Post, Hotel, SimpleTravel, IndividualCost, Transport } from '@/types/match';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { airlineOptions, seatClassOptions } from '@/components/data';
import LikeButton from '@/components/LikeButton';

// Helper component for star ratings
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center my-2">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// Helper component for content sections
const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
    <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">{title}</h2>
    {children}
  </div>
);

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('IDが見つかりません。');
      return;
    }

    const handlePostData = (postData: Post): Promise<Post> => {
      if (postData.travelId) {
        const travelRef = doc(db, 'simple-travels', postData.travelId);
        return getDoc(travelRef)
          .then(travelSnap => {
            if (travelSnap.exists()) {
              const travelData = travelSnap.data() as SimpleTravel;
              return { ...postData, ...travelData };
            }
            return postData;
          })
          .catch(error => {
            console.error("Could not fetch travel details, possibly due to permissions:", error);
            return postData;
          });
      }
      return Promise.resolve(postData);
    };

    const normalizePostData = (data: DocumentData, docId: string): Post => {
      const matchInfo = data.matches && data.matches[0] ? {
        competition: data.matches[0].competition || '',
        season: data.matches[0].season || data.season || '',
        date: data.matches[0].date || '',
        kickoff: data.matches[0].kickoff || '',
        homeTeam: data.matches[0].homeTeam || data.matches[0].teamA || '',
        awayTeam: data.matches[0].awayTeam || data.matches[0].teamB || '',
        homeScore: String(data.matches[0].homeScore ?? ''),
        awayScore: String(data.matches[0].awayScore ?? ''),
        stadium: data.matches[0].stadium || '',
        ticketPrice: data.matches[0].ticketPrice || '',
        ticketPurchaseRoute: data.matches[0].ticketPurchaseRoute || '',
        ticketPurchaseRouteUrl: data.matches[0].ticketPurchaseRouteUrl || '',
        ticketTeam: data.matches[0].ticketTeam || '',
        isTour: data.matches[0].isTour || false,
        isHospitality: data.matches[0].isHospitality || false,
        hospitalityDetail: data.matches[0].hospitalityDetail || '',
        seat: data.matches[0].seat || '',
        seatReview: data.matches[0].seatReview || '',
      } : undefined;

      const outboundTotalDuration = data.outboundTotalDuration || '';
      const inboundTotalDuration = data.inboundTotalDuration || '';

      const costs = data.cost ? Object.entries(data.cost).map(([category, amount]) => ({
        id: `${category}-${Date.now()}`,
        category,
        amount: Number(amount) || 0,
      })) : [];

      return {
        id: docId,
        authorId: data.authorId || data.uid,
        authorNickname: data.authorNickname || data.nickname || '',
        title: data.title || '',
        content: data.content || data.memories || '',
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        imageUrls: data.imageUrls || [],
        match: data.match || matchInfo,
        costs: data.costs || costs,
        transports: data.transports || [],
        hotels: data.hotels || [],
        spots: data.spots || [],
        goods: data.goods || '',
        firstAdvice: data.firstAdvice || data.message || '',
        outboundTotalDuration,
        inboundTotalDuration,
        likeCount: data.likeCount || 0,
        helpfulCount: data.helpfulCount || 0,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        postType: data.postType || 'new',
        travelId: data.travelId,
      } as Post;
    };

    const postRef = doc(db, 'posts', id);
    const unsubscribe = onSnapshot(postRef, async (postSnap) => {
      try {
        setLoading(true);
        if (postSnap.exists()) {
          const postData = postSnap.data();
          let normalizedPost = normalizePostData(postData, postSnap.id);
          normalizedPost = await handlePostData(normalizedPost);
          setPost(normalizedPost);
        } else {
          const oldPostRef = doc(db, 'simple-posts', id);
          const oldPostSnap = await getDoc(oldPostRef);
          if (oldPostSnap.exists()) {
            const oldPostData = oldPostSnap.data();
            let normalizedPost = normalizePostData(oldPostData, oldPostSnap.id);
            normalizedPost = await handlePostData(normalizedPost);
            setPost(normalizedPost);
          } else {
            setError('投稿が見つかりません。');
          }
        }
      } catch (e) {
        console.error("Error fetching post:", e);
        setError('投稿の読み込み中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (post) {
      console.log("Post data loaded:", post);
    }
  }, [post]);

  if (loading) return <div className="p-6 text-center">読み込み中...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (!post) return null;

  const {
    title,
    content,
    imageUrls,
    match,
    costs,
    transports,
    hotels,
    spots,
    goods,
    firstAdvice,
    authorNickname,
    authorId,

    outboundTotalDuration,
    inboundTotalDuration,
  } = post;

  const outboundTransports = (transports || []).filter(t => t.direction === 'outbound');
  const inboundTransports = (transports || []).filter(t => t.direction === 'inbound');

  const airlineLabelMap = new Map(airlineOptions.map(opt => [opt.value, opt.label]));
  const seatClassLabelMap = new Map(seatClassOptions.map(opt => [opt.value, opt.label]));

  const ratingCategories: { key: keyof Pick<Hotel, 'accessRating' | 'cleanlinessRating' | 'comfortRating' | 'facilityRating' | 'staffRating'>; label: string }[] = [
    { key: 'accessRating', label: 'アクセス' },
    { key: 'cleanlinessRating', label: '清潔さ' },
    { key: 'comfortRating', label: '快適さ' },
    { key: 'facilityRating', label: '設備' },
    { key: 'staffRating', label: 'スタッフ' },
  ];

  const costLabels: { [key: string]: string } = {
    airfare: '航空券',
    accommodation: '宿泊費',
    transportation: '現地交通費',
    food: '食費',
    tickets: 'チケット代',
    tours: 'ツアー・アクティビティ',
    other: 'その他',
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Image Carousel */}
      {imageUrls && imageUrls.length > 0 && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <Swiper key={id} modules={[Navigation, Pagination, A11y]} spaceBetween={50} slidesPerView={1} navigation pagination={{ clickable: true }}>
            {imageUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <div className="w-full aspect-square overflow-hidden rounded-lg shadow-lg">
                  <Image src={url} alt={`Post image ${index + 1}`} fill className="object-cover" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Title and Author */}
      <div className="mb-4 px-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href={`/user/${authorId}`} className="text-slate-700 dark:text-slate-300 hover:underline">
              投稿者: {authorNickname}
            </Link>
            <span className="text-slate-500 dark:text-slate-400">•</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {post.createdAt && typeof post.createdAt.toDate === 'function' ? new Date(post.createdAt.toDate()).toLocaleDateString() : '日付不明'}
            </span>
          </div>

        </div>
      </div>

      {/* Post Actions */}
      <div className="my-8 py-6 border-y border-slate-200 dark:border-slate-700 flex justify-center">
        <LikeButton postId={id} />
      </div>

      {/* Match Details */}
      {match && (
        <DetailSection title="試合情報">
          <div className="text-center mb-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">{match.competition} {match.season}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{new Date(match.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })} {match.kickoff} K.O.</p>
          </div>
          <div className="flex items-center justify-center space-x-4 text-center">
            <div className="flex-1">
              <p className="font-bold text-lg text-slate-900 dark:text-white">{match.homeTeam}</p>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              <span>{match.homeScore} - {match.awayScore}</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg text-slate-900 dark:text-white">{match.awayTeam}</p>
            </div>
          </div>
          <div className="text-center mt-2 text-sm text-slate-600 dark:text-slate-400">
            <p>at {match.stadium}</p>
          </div>
        </DetailSection>
      )}



      {/* Ticket Details */}
      {match && (match.ticketPrice || match.ticketPurchaseRoute || match.seat || match.seatReview || match.isTour || match.isHospitality) && (
        <DetailSection title="チケット情報">
          <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <ul className="space-y-3 text-slate-800 dark:text-slate-200 text-sm">
              {match.ticketTeam && (
                <li className="flex justify-between">
                  <span className="font-semibold">チケット</span>
                  <span>{match.ticketTeam}</span>
                </li>
              )}
              {match.isTour && (
                <li className="flex justify-between">
                  <span className="font-semibold">ツアー</span>
                  <span>あり</span>
                </li>
              )}
              {match.ticketPrice && !match.isTour && (
                <li className="flex justify-between">
                  <span className="font-semibold">価格</span>
                  <span>{match.ticketPrice}</span>
                </li>
              )}
              {match.ticketPurchaseRoute && (
                <li className="flex justify-between">
                  <span className="font-semibold">購入ルート</span>
                  <span>{match.ticketPurchaseRoute}</span>
                </li>
              )}
              {match.ticketPurchaseRouteUrl && (
                <li className="flex justify-between items-start">
                  <span className="font-semibold">購入URL</span>
                  <a href={match.ticketPurchaseRouteUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline break-all text-right">
                    {match.ticketPurchaseRouteUrl}
                  </a>
                </li>
              )}
              {match.seat && (
                <li className="flex justify-between">
                  <span className="font-semibold">座席</span>
                  <span>{match.seat}</span>
                </li>
              )}
              {match.seatReview && (
                <li className="flex flex-col">
                  <span className="font-semibold mb-1">座席レビュー</span>
                  <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{match.seatReview}</p>
                </li>
              )}
              {match.isHospitality && (
                <li className="flex flex-col">
                  <span className="font-semibold mb-1">ホスピタリティ</span>
                  <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{match.hospitalityDetail || 'あり'}</p>
                </li>
              )}
            </ul>
          </div>
        </DetailSection>
      )}

      {/* Transport Details */}
      {(outboundTransports.length > 0 || inboundTransports.length > 0) && (
        <DetailSection title="移動情報">
          <div className="space-y-6">
            {outboundTransports.length > 0 &&
              <div>
                <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200 mb-3">往路</h3>
                {outboundTotalDuration && <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">総移動時間: {outboundTotalDuration}</p>}
                <div className="space-y-4">
                  {outboundTransports.map((transport: Transport, index) => (
                    <div key={transport.id || index} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{transport.method}</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{transport.from} → {transport.to}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">【時間】{transport.departureTime} - {transport.arrivalTime}</p>
                      {transport.airline && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">【航空会社】{airlineLabelMap.get(transport.airline) || transport.airline}</p>}
                      {transport.seatType && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">【座席】{seatClassLabelMap.get(transport.seatType) || transport.seatType}</p>}
                    </div>
                  ))}
                </div>
              </div>
            }
            {inboundTransports.length > 0 &&
              <div className={outboundTransports.length > 0 ? 'pt-6 border-t border-slate-200 dark:border-slate-700' : ''}>
                <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200 mb-3">復路</h3>
                {inboundTotalDuration && <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">総移動時間: {inboundTotalDuration}</p>}
                <div className="space-y-4">
                  {inboundTransports.map((transport: Transport, index) => (
                    <div key={transport.id || index} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{transport.method}</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{transport.from} → {transport.to}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">【時間】{transport.departureTime} - {transport.arrivalTime}</p>
                      {transport.airline && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">【航空会社】{airlineLabelMap.get(transport.airline) || transport.airline}</p>}
                      {transport.seatType && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">【座席】{seatClassLabelMap.get(transport.seatType) || transport.seatType}</p>}
                    </div>
                  ))}
                </div>
              </div>
            }
          </div>
        </DetailSection>
      )}

      {/* Hotel Details */}
      {hotels && hotels.length > 0 && (
        <DetailSection title="宿泊したホテル">
          <div className="space-y-4">
            {hotels.map((hotel, index) => {
              const hasDetailedRatings = ratingCategories.some(cat => {
                const rating = hotel[cat.key];
                return typeof rating === 'number' && rating > 0;
              });

              return (
                <div key={hotel.id || index} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  {hotel.name && <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-2">{hotel.name}</h3>}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-700 dark:text-slate-300">
                    {hotel.bookingSite && <p><strong>予約サイト:</strong> {hotel.bookingSite}</p>}
                    {hotel.city && <p><strong>都市:</strong> {hotel.city}</p>}
                    {hotel.nights != null && <p><strong>宿泊数:</strong> {hotel.nights}泊</p>}
                    {hotel.price != null && <p><strong>料金:</strong> {hotel.price.toLocaleString()}円</p>}
                  </div>
                  {hotel.url && <a href={hotel.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block break-all">{hotel.url}</a>}

                  {hotel.overallRating != null && hotel.overallRating > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">総合評価</p>
                      <div className="flex items-center gap-x-2">
                        <StarRating rating={hotel.overallRating} />
                        <span className="font-bold text-slate-700 dark:text-slate-200 tabular-nums">{(hotel.overallRating).toFixed(1)}</span>
                      </div>
                    </div>
                  )}

                  {hasDetailedRatings && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">詳細評価</p>
                      <div className="space-y-1 mt-2">
                        {ratingCategories.map(category => {
                          const rating = hotel[category.key];
                          return (
                            (typeof rating === 'number' && rating > 0) && (
                              <div key={category.key} className="flex justify-between items-center text-sm">
                                <p className="text-slate-600 dark:text-slate-400">{category.label}</p>
                                <StarRating rating={rating} />
                              </div>
                            )
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {hotel.comment && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">コメント</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-wrap">{hotel.comment}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </DetailSection>
      )}

      {/* Spot Details */}
      {spots && spots.length > 0 && (
        <DetailSection title="訪れた場所">
          <div className="space-y-4">
            {spots.map((spot, index) => (
              <div key={spot.id || index} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-2">{spot.name}</h3>
                {spot.city && <p className="text-sm text-slate-600 dark:text-slate-400"><strong>都市:</strong> {spot.city}</p>}
                {spot.description && <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 whitespace-pre-wrap">{spot.description}</p>}
                {spot.url && <a href={spot.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block break-all">{spot.url}</a>}
                {spot.rating != null && <StarRating rating={spot.rating} />}
                {spot.comment && <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 whitespace-pre-wrap">{spot.comment}</p>}
              </div>
            ))}
          </div>
        </DetailSection>
      )}

      {/* Cost Details */}
      {costs && costs.length > 0 && (
        <DetailSection title="かかった費用">
          <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <ul className="space-y-2 text-slate-800 dark:text-slate-200">
              {costs.map((item: IndividualCost) => (
                <li key={item.id} className="flex justify-between border-b border-slate-200 dark:border-slate-700 py-2 last:border-b-0">
                  <span>{costLabels[item.category] || item.category}</span>
                  <span className="font-semibold">{item.amount.toLocaleString()}円</span>
                </li>
              ))}
              <li className="flex justify-between font-bold pt-2">
                <span>合計</span>
                <span>{costs.reduce((acc: number, cur: IndividualCost) => acc + cur.amount, 0).toLocaleString()}円</span>
              </li>
            </ul>
          </div>
        </DetailSection>
      )}

      {/* Message and Other Info */}
      {(content || goods || firstAdvice) && (
        <DetailSection title="メッセージ・その他情報">
          <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-4">
            {content && (
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">これから初観戦行く人へメッセージ</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-wrap">{content}</p>
              </div>
            )}
            {goods && (
              <div className={content ? 'pt-4 border-t border-slate-200 dark:border-slate-700' : ''}>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">買ったグッズ</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-wrap">{goods}</p>
              </div>
            )}
            {firstAdvice && (
              <div className={(content || goods) ? 'pt-4 border-t border-slate-200 dark:border-slate-700' : ''}>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">初めて行く人へのアドバイス</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-wrap">{firstAdvice}</p>
              </div>
            )}
          </div>
        </DetailSection>
      )}


      {/* Back Button */}
      <div className="mt-6">
        <button onClick={() => router.back()} className="text-indigo-600 dark:text-indigo-400 hover:underline">
          ← 戻る
        </button>
      </div>
    </div>
  );
}
