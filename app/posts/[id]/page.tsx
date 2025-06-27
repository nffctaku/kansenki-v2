'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useTheme } from 'next-themes';

// Define all necessary types locally to match Firestore data structure
interface FlightInfo {
  airline: string;
  flightNumber: string;
}

interface HotelInfo {
  url: string;
  comment: string;
  rating: number;
}

interface SpotInfo {
  url: string;
  comment: string;
  rating: number;
}

interface FlightTime {
  departure: string;
  arrival: string;
}

interface MatchInfo {
  date: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  venue: string;
}

interface PostDetail {
  id: string;
  uid: string;
  userId: string;
  nickname: string;
  createdAt: any; // Firestore Timestamp
  season: string;
  imageUrls: string[];
  category: string;
  match: MatchInfo;
  spots: SpotInfo[];
  items: string;
  goods: string;
  episode: string;
  firstAdvice: string;
  allowComments: boolean;
  travelId?: string;
  // Optional travel data
  travelDuration?: string;
  cities?: string;
  goFlights?: FlightInfo[];
  returnFlights?: FlightInfo[];
  goTime?: FlightTime;
  returnTime?: FlightTime;
  goFlightType?: string;
  returnFlightType?: string;
  goVia?: string;
  returnVia?: string;
  hotels?: HotelInfo[];
  cost?: Record<string, number>;
  // For rendering
  author?: string; 
  likeCount?: number;
  matches?: any[]; // legacy
}

export default function PostDetailPage() {
  const { id } = useParams();
  const { theme } = useTheme();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // ページがクライアントサイドで読み込まれた後に現在のURLを取得
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchPostAndTravelData = async () => {
      const postDocRef = doc(db, 'simple-posts', id as string);
      const postSnap = await getDoc(postDocRef);

      if (postSnap.exists()) {
        const postData = { id: postSnap.id, ...postSnap.data() } as PostDetail;

        // If there's a travelId, fetch the associated travel data
        if (postData.travelId) {
          const travelDocRef = doc(db, 'travelData', postData.travelId);
          const travelSnap = await getDoc(travelDocRef);

          if (travelSnap.exists()) {
            const travelData = travelSnap.data();
            // Merge travelData into postData
            const combinedData = { ...postData, ...travelData };
            setPost(combinedData);
          } else {
            console.warn(`Travel data not found for travelId: ${postData.travelId}`);
            setPost(postData); // Set post data without travel info
          }
        } else {
          // No travelId, just set the post data
          setPost(postData);
        }
      } else {
        console.error("Post not found");
      }
    };

    fetchPostAndTravelData();
  }, [id]);

  if (!post) return <p className="text-center py-10 dark:text-white">読み込み中...</p>;

  const rawTotalCost = post.cost
    ? Object.values(post.cost as Record<string, number>).reduce((sum, v) => sum + (Number(v) || 0), 0)
    : 0;
  
  const totalCost = Math.round(rawTotalCost / 10000);


    const hasHotels = post.hotels?.some((h) => h.url || h.rating > 0 || h.comment);
  const hasSpots = post.spots?.some((s) => s.url || s.rating > 0 || s.comment);

  return (
        <div className="max-w-3xl mx-auto px-4 pt-4 min-h-screen pb-[100px]">


      {/* 画像スライド */}
      {post.imageUrls?.length > 0 && (
        <div className="w-full max-w-md mx-auto mb-6">
          <Swiper
            pagination={{ clickable: true }}
            modules={[Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            className="rounded-xl"
          >
            {post.imageUrls.slice(0, 5).map((url: string, index: number) => (
              <SwiperSlide key={index}>
                <div className="relative aspect-square w-full bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
                  <Image
                    src={url}
                    alt={`観戦写真${index + 1}`}
                    fill
                    sizes="100%"
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

{/* 投稿者情報（名前＋ID整列） */}
<div className="bg-white rounded-xl shadow overflow-hidden mb-6">
  <h2 className="text-base font-bold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 px-4 py-2 border-b dark:border-gray-700">投稿者情報</h2>
  <table className="w-full text-sm table-fixed">
    <tbody>
      <tr className="bg-white">
        <th className="w-1/3 px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal">ニックネーム</th>
        <td className="px-4 py-1 text-right break-words dark:text-white">{post.author || '未設定'}</td>
      </tr>
      {post.userId && (
        <tr className="bg-gray-100">
          <th className="px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal">ユーザーID</th>
          <td className="px-4 py-1 text-right break-words">
            <a href={`/user/${post.uid}`} className="text-blue-500 dark:text-blue-400 hover:underline">
              @{post.userId}
            </a>
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      {/* 渡航情報 */}
      {post.travelId && (post.travelDuration || post.goFlights) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
          <h2 className="text-base font-bold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 px-4 py-2 border-b dark:border-gray-700">渡航情報</h2>
          <div className="p-4 space-y-4 text-sm">
            {post.travelDuration && (
              <div>
                <h3 className="font-semibold text-gray-600 dark:text-gray-400">渡航期間</h3>
                <p className="dark:text-white mt-1">{post.travelDuration}</p>
              </div>
            )}
            {post.goFlights && post.goFlights.length > 0 && post.goFlights[0].airline && (
              <div>
                <h3 className="font-semibold text-gray-600 dark:text-gray-400">往路フライト</h3>
                <p className="dark:text-white mt-1">
                  {post.goFlights.map(f => `${f.airline}${f.flightNumber}`).join(' → ')}
                </p>
                {post.goTime && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">出発: {post.goTime.departure}, 到着: {post.goTime.arrival} (現地時間)</p>}
                {post.goVia && <p className="text-xs text-gray-500 dark:text-gray-400">経由: {post.goVia}</p>}
              </div>
            )}
            {post.returnFlights && post.returnFlights.length > 0 && post.returnFlights[0].airline && (
              <div>
                <h3 className="font-semibold text-gray-600 dark:text-gray-400">復路フライト</h3>
                <p className="dark:text-white mt-1">
                  {post.returnFlights.map(f => `${f.airline}${f.flightNumber}`).join(' → ')}
                </p>
                {post.returnTime && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">出発: {post.returnTime.departure}, 到着: {post.returnTime.arrival} (現地時間)</p>}
                {post.returnVia && <p className="text-xs text-gray-500 dark:text-gray-400">経由: {post.returnVia}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 観戦した試合 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
        <h2 className="text-base font-bold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 px-4 py-2 border-b dark:border-gray-700">観戦した試合</h2>
        <table className="w-full text-sm table-fixed">
          <tbody>
            {post.matches?.[0]?.competition && (
              <tr className="bg-white dark:bg-gray-800">
                <th className="w-1/3 px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal align-top">大会名</th>
                <td className="px-4 py-1 text-right break-words dark:text-white">{post.matches[0].competition}</td>
              </tr>
            )}
            {(post.matches?.[0]?.teamA || post.matches?.[0]?.teamB) && (
              <tr className="bg-gray-100 dark:bg-gray-800/50">
                <th className="px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal align-top">対戦カード</th>
                <td className="px-4 py-1 text-right break-words dark:text-white">
                  <div className="leading-tight">
                    {post.matches[0].teamA}
                    <br />
                    vs
                    <br />
                    {post.matches[0].teamB}
                  </div>
                </td>
              </tr>
            )}
            {post.season && (
              <tr className="bg-white dark:bg-gray-800">
                <th className="px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal align-top">シーズン</th>
                <td className="px-4 py-1 text-right break-words dark:text-white">{post.season}</td>
              </tr>
            )}
            {post.matches?.[0]?.stadium && (
              <tr className="bg-gray-100 dark:bg-gray-800/50">
                <th className="px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal align-top">スタジアム</th>
                <td className="px-4 py-1 text-right break-words dark:text-white">
                  {post.matches[0].stadium}
                </td>
              </tr>
            )}
            {post.matches?.[0]?.seat && (
              <tr className="bg-white dark:bg-gray-800">
                <th className="px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal align-top">座席</th>
                <td className="px-4 py-1 text-right break-words dark:text-white">
                  {post.matches[0].seat}
                </td>
              </tr>
            )}
            {post.matches?.[0]?.ticketPrice && (
              <tr className="bg-gray-100 dark:bg-gray-800/50">
                <th className="px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal align-top">チケット価格</th>
                <td className="px-4 py-1 text-right break-words dark:text-white">
                  {`¥${Number(post.matches[0].ticketPrice).toLocaleString()}`}
                </td>
              </tr>
            )}
            {post.matches?.[0]?.seatReview && (
              <tr className="bg-white dark:bg-gray-800">
                <th className="px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal align-top">座席レビュー</th>
                <td className="px-4 py-1 text-right whitespace-pre-wrap dark:text-white">
                  {post.matches[0].seatReview}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 渡航・観戦情報 */}
      <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
        <h2 className="text-base font-bold bg-gray-100 px-4 py-2 border-b">渡航・観戦情報</h2>
        <table className="w-full text-sm table-fixed">
          <tbody>
            {post.category && (
              <tr className="bg-white dark:bg-gray-800">
                <th className="w-1/3 px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal align-top">カテゴリー</th>
                <td className="px-4 py-1 text-right break-words dark:text-white">{post.category}</td>
              </tr>
            )}
            {post.season && (
              <tr className="bg-gray-100 dark:bg-gray-800/50">
                <th className="px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal align-top">観戦シーズン</th>
                <td className="px-4 py-1 text-right break-words dark:text-white">{post.season}</td>
              </tr>
            )}
            {post.lifestyle && (
              <tr className="bg-white dark:bg-gray-800">
                <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">ライフスタイル</th>
                <td className="px-4 py-1 text-right break-words dark:text-white">{post.lifestyle}</td>
              </tr>
            )}
            {post.watchYear && post.watchMonth && (
              <tr className="bg-gray-100 dark:bg-gray-800/50">
                <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">観戦時期</th>
                <td className="px-4 py-1 text-right break-words dark:text-white">
                  {post.watchYear}年 {post.watchMonth}月
                </td>
              </tr>
            )}
            {post.stayDuration && (
              <tr className="bg-white dark:bg-gray-800">
                <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">滞在期間</th>
                <td className="px-4 py-1 text-right break-words dark:text-white">{post.stayDuration}</td>
              </tr>
            )}
            {post.goFlights && post.goFlights.length > 0 && (
              <tr className="bg-gray-100 dark:bg-gray-800/50">
                <th className="px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal align-top">行きの航空会社</th>
                <td className="px-4 py-1 text-right dark:text-white">
                  <div className="flex flex-col items-end gap-[2px]">
                    {post.goFlights.map((f, i) => (
                      <span key={i}>{f.name} ({f.seat})</span>
                    ))}
                  </div>
                </td>
              </tr>
            )}
            {post.returnFlights && post.returnFlights.length > 0 && (
              <tr className="bg-white dark:bg-gray-800">
                <th className="px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal align-top">帰りの航空会社</th>
                <td className="px-4 py-1 text-right dark:text-white">
                  <div className="flex flex-col items-end gap-[2px]">
                    {post.returnFlights.map((f, i) => (
                      <span key={i}>{f.name} ({f.seat})</span>
                    ))}
                  </div>
                </td>
              </tr>
            )}
            {(post.goTime || post.goType || post.goVia) && (
              <tr className="bg-gray-100 dark:bg-gray-800/50">
                <th className="px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal align-top">行きの移動</th>
                <td className="px-4 py-1 text-right break-words dark:text-white">
                  {[post.goTime, post.goType, post.goVia].filter(Boolean).join(' / ')}
                </td>
              </tr>
            )}
            {(post.returnTime || post.returnType || post.returnVia) && (
              <tr className="bg-white dark:bg-gray-800">
                <th className="px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal align-top">帰りの移動</th>
                <td className="px-4 py-1 text-right break-words dark:text-white">
                  {[post.returnTime, post.returnType, post.returnVia].filter(Boolean).join(' / ')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ホテル情報 */}
      {hasHotels && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
          <h2 className="text-base font-bold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 px-4 py-2 border-b dark:border-gray-700">ホテル情報</h2>
          <div className="divide-y dark:divide-gray-700">
            {post.hotels?.map((h, i) => (
              <div key={i} className="p-4">
                {h.name && <h3 className="font-bold text-md dark:text-white">{h.name}</h3>}
                {h.url && h.url.startsWith('http') && (
                  <a href={h.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 text-sm break-all">
                    {h.url}
                  </a>
                )}
                {h.rating && h.rating > 0 && (
                  <div className="flex items-center mt-1">
                    {'★'.repeat(h.rating)}
                    {'☆'.repeat(5 - h.rating)}
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">({h.rating.toFixed(1)})</span>
                  </div>
                )}
                {h.comment && <p className="text-sm text-gray-800 dark:text-gray-300 mt-2 whitespace-pre-wrap">{h.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 周辺の観光スポット */}
      {hasSpots && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
          <h2 className="text-base font-bold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 px-4 py-2 border-b dark:border-gray-700">周辺の観光スポット</h2>
          <div className="divide-y dark:divide-gray-700">
            {post.spots?.map((s, i) => (
              <div key={i} className="p-4">
                {s.name && <h3 className="font-bold text-md dark:text-white">{s.name}</h3>}
                {s.url && s.url.startsWith('http') && (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 text-sm break-all">
                    {s.url}
                  </a>
                )}
                {s.rating && s.rating > 0 && (
                  <div className="flex items-center mt-1">
                    {'★'.repeat(s.rating)}
                    {'☆'.repeat(5 - s.rating)}
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">({s.rating.toFixed(1)})</span>
                  </div>
                )}
                {s.comment && <p className="text-sm text-gray-800 dark:text-gray-300 mt-2 whitespace-pre-wrap">{s.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* その他の情報 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8 px-6 py-6">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 pb-3 mb-4">
          その他の情報
        </h2>
        <div className="space-y-4">
          {[
            ['持参アイテム', post.items],
            ['購入グッズ', post.goods],
            ['印象的なエピソード', post.episode],
            ['初めて行く方へ', post.firstAdvice],
          ].map(([label, value], i) =>
            value ? (
              <section key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-md px-4 py-2">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-300 mb-0.5">{label as string}</h3>
                <p className="text-sm text-gray-800 dark:text-gray-400 whitespace-pre-wrap leading-snug">
                  {value as string}
                </p>
              </section>
            ) : null
          )}
        </div>
      </div>

      {/* 費用内訳 */}
      {rawTotalCost > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
          <h2 className="text-base font-bold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 px-4 py-2 border-b dark:border-gray-700">費用内訳</h2>
          <table className="w-full text-sm table-fixed">
            <tbody>
              {[
                ['航空券', post.cost?.flight],
                ['ホテル', post.cost?.hotel],
                ['チケット', post.cost?.ticket],
                ['交通費', post.cost?.transport],
                ['食費', post.cost?.food],
                ['グッズ', post.cost?.goods],
                ['その他', post.cost?.other],
              ].map(([label, value], i) =>
                value !== undefined && Number(value) > 0 ? (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-800/50'}>
                    <th className="w-1/3 px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal align-top">{label as string}</th>
                    <td className="px-4 py-1 text-right dark:text-white">
                      {`¥${Number(value).toLocaleString()}`}
                    </td>
                  </tr>
                ) : null
              )}
              <tr className="bg-white dark:bg-gray-800">
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-200 font-semibold">費用合計</th>
                <td className="px-4 py-2 text-right font-bold text-gray-900 dark:text-white">
                  約 {totalCost} 万円
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Social Buttons */}
      <div className="flex justify-center items-center gap-6 mt-6 text-[11px] text-gray-700 dark:text-gray-400">
        {/* いいね */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span className="text-[14px]">♡</span>
            <span className="text-[12px]">{post.likeCount || 0}</span>
          </div>
          <span className="text-[10px] mt-0.5"></span>
        </div>

        {/* コピー */}
        <button
          onClick={() => {
            if (currentUrl) {
              navigator.clipboard.writeText(currentUrl);
              alert('リンクをコピーしました！');
            }
          }}
          className="flex flex-col items-center hover:opacity-80 bg-transparent border-none p-0"
          disabled={!currentUrl}
        >
      </div>

      {/* フッター被り回避スペーサー */}
      <div className="w-full h-[100px] sm:h-[120px]" />
    </div>
  );
}
