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

  const hasHotels = post.hotels?.some((h: HotelInfo) => h.url || h.rating > 0 || h.comment);
  const hasSpots = post.spots?.some((s: SpotInfo) => s.url || s.rating > 0 || s.comment);

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

      {/* 投稿者情報 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
        <h2 className="text-base font-bold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 px-4 py-2 border-b dark:border-gray-700">投稿者情報</h2>
        <table className="w-full text-sm table-fixed">
          <tbody>
            <tr className="bg-white dark:bg-gray-800">
              <th className="w-1/3 px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal">ニックネーム</th>
              <td className="px-4 py-1 text-right break-words dark:text-white">{post.nickname || '未設定'}</td>
            </tr>
            {post.uid && (
              <tr className="bg-gray-50 dark:bg-gray-800/50">
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
      {post.travelId && (post.travelDuration || (post.goFlights && post.goFlights.length > 0)) && (
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
                  {post.goFlights.map((f: FlightInfo, i: number) => `${f.airline}${f.flightNumber}`).join(' → ')}
                </p>
                {post.goTime && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">出発: {post.goTime.departure}, 到着: {post.goTime.arrival} (現地時間)</p>}
                {post.goVia && <p className="text-xs text-gray-500 dark:text-gray-400">経由: {post.goVia}</p>}
              </div>
            )}
            {post.returnFlights && post.returnFlights.length > 0 && post.returnFlights[0].airline && (
              <div>
                <h3 className="font-semibold text-gray-600 dark:text-gray-400">復路フライト</h3>
                <p className="dark:text-white mt-1">
                  {post.returnFlights.map((f: FlightInfo, i: number) => `${f.airline}${f.flightNumber}`).join(' → ')}
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
        <div className="p-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">{post.match.date} @ {post.match.venue}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{post.match.competition}</p>
          <h3 className="text-lg font-bold text-center mb-1">{post.match.homeTeam} {post.match.homeScore ?? ''}-{post.match.awayScore ?? ''} {post.match.awayTeam}</h3>
        </div>
      </div>

      {/* ホテル情報 */}
      {hasHotels && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
          <h2 className="text-base font-bold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 px-4 py-2 border-b dark:border-gray-700">ホテル情報</h2>
          <div className="p-4 space-y-3">
            {post.hotels?.map((h: HotelInfo, i: number) => (h.url || h.rating > 0 || h.comment) && (
              <div key={i} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                {h.url && <a href={h.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm break-all">{h.url}</a>}
                {h.rating > 0 && <p className="text-sm text-yellow-500 mt-1">{'★'.repeat(h.rating)}</p>}
                {h.comment && <p className="text-sm text-gray-800 dark:text-gray-300 mt-2 whitespace-pre-wrap">{h.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* スポット情報 */}
      {hasSpots && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
          <h2 className="text-base font-bold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 px-4 py-2 border-b dark:border-gray-700">スポット情報</h2>
          <div className="p-4 space-y-3">
            {post.spots?.map((s: SpotInfo, i: number) => (s.url || s.rating > 0 || s.comment) && (
              <div key={i} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm break-all">{s.url}</a>}
                {s.rating > 0 && <p className="text-sm text-yellow-500 mt-1">{'★'.repeat(s.rating)}</p>}
                {s.comment && <p className="text-sm text-gray-800 dark:text-gray-300 mt-2 whitespace-pre-wrap">{s.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* その他の情報 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
        <h2 className="text-base font-bold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 px-4 py-2 border-b dark:border-gray-700">その他の情報</h2>
        <div className="p-4 space-y-4">
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
          <img src="/フリーのクリップアイコン.png" alt="コピー" className="w-[16px] h-[16px] mb-0.5 object-contain dark:invert" />
        </button>

        {/* X */}
        <a
          href={currentUrl && post ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(`『${post.match.homeTeam} vs ${post.match.awayTeam}』の観戦記をチェック！ #kansenki`)}&url=${encodeURIComponent(currentUrl)}` : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={!currentUrl ? 'pointer-events-none opacity-50' : ''}
        >
          <img src="/logo-black.png" alt="X" className="w-[16px] h-[16px] mb-0.5 object-contain dark:invert" />
        </a>
      </div>

      {/* フッター被り回避スペーサー */}
      <div className="w-full h-[100px] sm:h-[120px]" />
    </div>
  );
}
