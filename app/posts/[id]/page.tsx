'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import type { DocumentData, DocumentSnapshot, FirestoreError } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Hotel, SimpleTravel, IndividualCost, Transport, Spot } from '@/types/match';
import type { Post } from '@/types/post';

import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { airlineOptions, seatClassOptions } from '@/components/data';
import LikeButton from '@/components/LikeButton';
import ShareButton from '@/components/ShareButton';
import BookmarkButton from '../../components/BookmarkButton';

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

    const handlePostData = async (postData: Post): Promise<Post> => {
      console.log('[Debug] Step 3: Handling post data (checking for travelId)', postData);
      if (postData.travelId) {
        const travelRef = doc(db, 'simple-travels', postData.travelId);
        try {
          const travelSnap = await getDoc(travelRef);
          if (travelSnap.exists()) {
            console.log('[Debug] Step 4: Found and merging travel data.');
            const travelData = travelSnap.data() as SimpleTravel;
            return { ...postData, ...travelData };
          }
          console.log('[Debug] Step 4: Travel data not found or no permission.');
          return postData;
        } catch (error) {
          console.error("[Debug] Error fetching travel details:", error);
          return postData;
        }
      }
      console.log('[Debug] Step 4: No travelId found, returning post data as is.');
      return postData;
    };

    const normalizePostData = (data: DocumentData, docId: string): Post => {

      const matchSource = (data.matches && data.matches[0]) ? data.matches[0] : data.match;

      const matchInfo = matchSource ? {
        competition: matchSource.competition || '',
        season: matchSource.season || data.season || '',
        date: matchSource.date || '',
        kickoff: matchSource.kickoff || '',
        homeTeam: matchSource.homeTeam || matchSource.teamA || '',
        awayTeam: matchSource.awayTeam || matchSource.teamB || '',
        homeScore: String(matchSource.homeScore ?? ''),
        awayScore: String(matchSource.awayScore ?? ''),
        stadium: matchSource.stadium || '',
        ticketPrice: matchSource.ticketPrice || '',
        ticketPurchaseRoute: matchSource.ticketPurchaseRoute || '',
        ticketPurchaseRouteUrl: matchSource.ticketPurchaseRouteUrl || '',
        ticketTeam: matchSource.ticketTeam || '',
        isTour: matchSource.isTour || false,
        isHospitality: matchSource.isHospitality || false,
        hospitalityDetail: matchSource.hospitalityDetail || '',
        seat: matchSource.seat || '',
        seatReview: matchSource.seatReview || '',
      } : {
        competition: '', season: '', date: '', kickoff: '', homeTeam: '', awayTeam: '', homeScore: '', awayScore: '', stadium: '', ticketPrice: '', ticketPurchaseRoute: '', ticketPurchaseRouteUrl: '', ticketTeam: '', isTour: false, isHospitality: false, hospitalityDetail: '', seat: '', seatReview: '',
      };

      const normalized = {
        id: docId,
        authorId: data.authorId || data.uid || '',
        authorNickname: data.authorNickname || data.nickname || '',
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        title: data.title || '',
        content: data.content || data.memories || data.text || '',
        firstAdvice: data.firstAdvice || data.message || '',
        goods: data.goods || '',
        images: data.images || data.imageUrls || data.existingImageUrls || [],
        categories: data.categories || data.tags || [],
        match: matchInfo,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        parentPostId: data.parentPostId || null,
        travelId: data.travelId,
        likeCount: data.likeCount || 0,
        helpfulCount: data.helpfulCount || 0,
        postType: data.postType || 'new',
        travelStartDate: data.travelStartDate || '',
        travelEndDate: data.travelEndDate || '',
        visitedCities: data.visitedCities || [],
        outboundTotalDuration: data.outboundTotalDuration || '',
        inboundTotalDuration: data.inboundTotalDuration || '',
        transports: Array.isArray(data.transports) ? data.transports : [],
        hotels: Array.isArray(data.hotels) ? data.hotels : [],
        spots: Array.isArray(data.spots) ? data.spots : [],
        costs: Array.isArray(data.costs) ? data.costs : [],
        belongings: data.belongings || '',
        youtubeUrl: data.youtubeUrl || '',

      } as unknown as Post;
      return normalized;
    };

    const unsub = onSnapshot(doc(db, 'posts', id), async (docSnap: DocumentSnapshot<DocumentData>) => {
      try {
        setLoading(true);
        let postData: Post | null = null;

        if (docSnap.exists()) {
          console.log('[Debug] Step 1: Post found in "posts" collection. Raw data:', docSnap.data());
          postData = normalizePostData(docSnap.data(), docSnap.id);
        } else {
          const simpleDocRef = doc(db, 'simple-posts', id);
          const simpleDocSnap = await getDoc(simpleDocRef);
          if (simpleDocSnap.exists()) {
            console.log('[Debug] Step 1: Post found in "simple-posts" collection. Raw data:', simpleDocSnap.data());
            postData = normalizePostData(simpleDocSnap.data(), simpleDocSnap.id);
          } else {
            setError('投稿が見つかりません。');
            return;
          }
        }

        if (postData) {
          const finalPost = await handlePostData(postData);
          console.log('[Debug] Step 5: Final post data being set to state', finalPost);
          setPost(finalPost);
        }
      } catch (e) {
        console.error("Error processing post data:", e);
        setError('投稿データの処理中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    }, (err: FirestoreError) => {
      console.error("Error fetching post:", err);
      setError('投稿の読み込み中にエラーが発生しました。');
      setLoading(false);
    });

    return () => unsub();
  }, [id, router]);

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
    images,
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
      {images && images.length > 0 && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <Swiper key={id} modules={[Navigation, Pagination, A11y]} spaceBetween={50} slidesPerView={1} navigation pagination={{ clickable: true }}>
            {images.map((url: string, index: number) => (
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
            {hotels.map((hotel: Hotel, index: number) => {
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
            {spots.map((spot: Spot, index: number) => (
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
      {costs && costs.length > 0 && costs.reduce((acc: number, cur: IndividualCost) => acc + cur.amount, 0) > 0 && (
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


      {/* Post Actions */}
      <div className="my-8 py-6 border-y border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-center gap-4">
        <LikeButton postId={id} size="md" />
        <BookmarkButton postId={id} size="md" />
        <ShareButton title={post.title} url={`https://kansenki.footballtop.net/posts/${id}`} />
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <button onClick={() => router.back()} className="text-indigo-600 dark:text-indigo-400 hover:underline">
          ← 戻る
        </button>
      </div>
    </div>
  );
}
