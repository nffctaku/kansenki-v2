import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PostImageCarousel from '@/components/PostImageCarousel';
import PostActions from '@/components/PostActions';
import Link from 'next/link';

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
  match?: MatchInfo;
  spots: SpotInfo[];
  items: string;
  goods: string;
  episode: string;
  firstAdvice: string;
  allowComments: boolean;
  travelId?: string;
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
  likeCount?: number;
}

// Function to fetch post data on the server
async function getPostData(id: string): Promise<PostDetail | null> {
  const postDocRef = doc(db, 'simple-posts', id);
  const postSnap = await getDoc(postDocRef);

  if (!postSnap.exists()) {
    return null;
  }

  const postData = { id: postSnap.id, ...postSnap.data() } as PostDetail;

  if (postData.travelId) {
    const travelDocRef = doc(db, 'simple-travels', postData.travelId);
    const travelSnap = await getDoc(travelDocRef);

    if (travelSnap.exists()) {
      const travelData = travelSnap.data();
      return { ...postData, ...travelData };
    } else {
      console.warn(`Travel data not found for travelId: ${postData.travelId}`);
      return postData;
    }
  }

  return postData;
}

// Generate static paths for existing posts for better performance (SSG)
export async function generateStaticParams() {
  try {
    const postsCollectionRef = collection(db, 'simple-posts');
    const postSnapshot = await getDocs(postsCollectionRef);
    return postSnapshot.docs.map(doc => ({ id: doc.id }));
  } catch (error) {
    console.error("Error fetching posts for generateStaticParams:", error);
    return [];
  }
}

// The page component is now an async Server Component
export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await getPostData(params.id);

  if (!post) {
    return <p className="text-center py-10 dark:text-white">投稿が見つかりません。</p>;
  }

  const rawTotalCost = post.cost ? Object.values(post.cost).reduce((sum, v) => sum + (Number(v) || 0), 0) : 0;
  const totalCost = Math.round(rawTotalCost / 10000);

  const hasHotels = post.hotels?.some(h => h.url || h.rating > 0 || h.comment);
  const hasSpots = post.spots?.some(s => s.url || s.rating > 0 || s.comment);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 min-h-screen pb-[100px]">
      <PostImageCarousel imageUrls={post.imageUrls} />

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
                  <Link href={`/user/${post.uid}`} className="text-blue-500 dark:text-blue-400 hover:underline">
                    @{post.userId}
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
            {totalCost > 0 && (
              <div>
                <h3 className="font-semibold text-gray-600 dark:text-gray-400">総費用</h3>
                <p className="dark:text-white mt-1">約{totalCost}万円</p>
              </div>
            )}
          </div>
        </div>
      )}

      {post.match && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
          <h2 className="text-base font-bold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 px-4 py-2 border-b dark:border-gray-700">観戦した試合</h2>
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">{post.match.date} @ {post.match.venue}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{post.match.competition}</p>
            <h3 className="text-lg font-bold text-center mb-1">{`${post.match.homeTeam} ${post.match.homeScore ?? ''}-${post.match.awayScore ?? ''} ${post.match.awayTeam}`}</h3>
          </div>
        </div>
      )}

      {hasHotels && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
          <h2 className="text-base font-bold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 px-4 py-2 border-b dark:border-gray-700">ホテル情報</h2>
          <div className="p-4 space-y-3">
            {post.hotels?.map((h, i) => (h.url || h.rating > 0 || h.comment) && (
              <div key={i} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                {h.url && <a href={h.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm break-all">{h.url}</a>}
                {h.rating > 0 && <p className="text-sm text-yellow-500 mt-1">{'★'.repeat(h.rating)}</p>}
                {h.comment && <p className="text-sm text-gray-800 dark:text-gray-300 mt-2 whitespace-pre-wrap">{h.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {hasSpots && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
          <h2 className="text-base font-bold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 px-4 py-2 border-b dark:border-gray-700">スポット情報</h2>
          <div className="p-4 space-y-3">
            {post.spots?.map((s, i) => (s.url || s.rating > 0 || s.comment) && (
              <div key={i} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm break-all">{s.url}</a>}
                {s.rating > 0 && <p className="text-sm text-yellow-500 mt-1">{'★'.repeat(s.rating)}</p>}
                {s.comment && <p className="text-sm text-gray-800 dark:text-gray-300 mt-2 whitespace-pre-wrap">{s.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
        <h2 className="text-base font-bold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 px-4 py-2 border-b dark:border-gray-700">その他の情報</h2>
        <div className="p-4 space-y-4">
          {[
            ['持参アイテム', post.items],
            ['購入グッズ', post.goods],
            ['印象的なエピソード', post.episode],
            ['初めて行く方へ', post.firstAdvice],
          ].map(([label, value], i) => value && (
            <section key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-md px-4 py-2">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-300 mb-0.5">{label as string}</h3>
              <p className="text-sm text-gray-800 dark:text-gray-400 whitespace-pre-wrap leading-snug">{value as string}</p>
            </section>
          ))}
        </div>
      </div>

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
              ].map(([label, value], i) => Number(value) > 0 && (
                <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-800/50'}>
                  <th className="w-1/3 px-4 py-1 text-left text-gray-700 dark:text-gray-400 font-normal align-top">{label as string}</th>
                  <td className="px-4 py-1 text-right dark:text-white">{`¥${Number(value).toLocaleString()}`}</td>
                </tr>
              ))}
              <tr className="bg-white dark:bg-gray-800">
                <th className="px-4 py-2 text-left text-gray-900 dark:text-gray-200 font-semibold">費用合計</th>
                <td className="px-4 py-2 text-right font-bold text-gray-900 dark:text-white">約 {totalCost} 万円</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <PostActions likeCount={post.likeCount || 0} match={post.match} />

      <div className="w-full h-[100px] sm:h-[120px]" />
    </div>
  );
}
