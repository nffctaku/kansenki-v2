import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PostImageCarousel from '@/components/PostImageCarousel';
import PostActions from '@/components/PostActions';
import Link from 'next/link';

// Define all necessary types locally to match Firestore data structure
interface FlightInfo {
  name: string;
  seat: string;
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

interface MatchInfo {
  competition: string;
  season: string;
  date: string;
  kickoff: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | string | null;
  awayScore: number | string | null;
  stadium: string;
  ticketPrice: string;
  ticketPurchaseRoute: string;
  seat: string;
  seatReview: string;
  // For backward compatibility
  venue?: string;
  teamA?: string;
  teamB?: string;
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
  matches?: MatchInfo[];
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
  goTime?: string;
  returnTime?: string;
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

  // Cast to any to handle legacy data structures before conforming to PostDetail
  let postData: any = { id: postSnap.id, ...postSnap.data() };

  // Backward compatibility for old match data (teamA/teamB)
  if (postData.matches && Array.isArray(postData.matches)) {
    postData.matches = postData.matches.map((match: any) => {
      const newMatch = { ...match };
      if (newMatch.teamA && !newMatch.homeTeam) {
        newMatch.homeTeam = newMatch.teamA;
      }
      if (newMatch.teamB && !newMatch.awayTeam) {
        newMatch.awayTeam = newMatch.teamB;
      }
      return newMatch;
    });
  }

  // Fetch and merge travel data if it exists
  if (postData.travelId) {
    const travelDocRef = doc(db, 'simple-travels', postData.travelId);
    const travelSnap = await getDoc(travelDocRef);

    if (travelSnap.exists()) {
      const travelData = travelSnap.data();
      postData = { ...postData, ...travelData };
    } else {
      console.warn(`Travel data not found for travelId: ${postData.travelId}`);
    }
  }

  return postData as PostDetail;
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

            {(post.goFlights && post.goFlights.length > 0 && post.goFlights.some(f => f.name)) && (
              <div>
                <h3 className="font-semibold text-gray-600 dark:text-gray-400 border-t pt-4 mt-4 border-gray-200 dark:border-gray-700">往路フライト</h3>
                <div className="mt-2 space-y-2 text-gray-800 dark:text-gray-300">
                  {post.goTime && <p><span className="font-medium text-gray-500">所要時間:</span> {post.goTime}</p>}
                  {post.goVia && <p><span className="font-medium text-gray-500">経由地:</span> {post.goVia}</p>}
                  {post.goFlightType && <p><span className="font-medium text-gray-500">種別:</span> {post.goFlightType}</p>}
                  {post.goFlights.map((flight, index) => flight.name && (
                    <div key={index} className="pl-4 mt-2">
                      <p><span className="font-medium text-gray-500">航空会社/便名:</span> {flight.name}</p>
                      <p><span className="font-medium text-gray-500">座席:</span> {flight.seat}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(post.returnFlights && post.returnFlights.length > 0 && post.returnFlights.some(f => f.name)) && (
              <div>
                <h3 className="font-semibold text-gray-600 dark:text-gray-400 border-t pt-4 mt-4 border-gray-200 dark:border-gray-700">復路フライト</h3>
                <div className="mt-2 space-y-2 text-gray-800 dark:text-gray-300">
                  {post.returnTime && <p><span className="font-medium text-gray-500">所要時間:</span> {post.returnTime}</p>}
                  {post.returnVia && <p><span className="font-medium text-gray-500">経由地:</span> {post.returnVia}</p>}
                  {post.returnFlightType && <p><span className="font-medium text-gray-500">種別:</span> {post.returnFlightType}</p>}
                  {post.returnFlights.map((flight, index) => flight.name && (
                    <div key={index} className="pl-4 mt-2">
                      <p><span className="font-medium text-gray-500">航空会社/便名:</span> {flight.name}</p>
                      <p><span className="font-medium text-gray-500">座席:</span> {flight.seat}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {post.matches && post.matches.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
          <h2 className="text-base font-bold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 px-4 py-2 border-b dark:border-gray-700">観戦した試合</h2>
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400"> {post.matches[0].competition} / {post.matches[0].date}</p>
            <div className="flex flex-col justify-center items-center text-2xl font-bold my-2 text-center">
              <span className="truncate">{post.matches[0].homeTeam || '未設定'}</span>
              <span className="my-1 text-lg">
                {(post.matches[0].homeScore != null && post.matches[0].homeScore !== '') && (post.matches[0].awayScore != null && post.matches[0].awayScore !== '')
                  ? `${post.matches[0].homeScore} - ${post.matches[0].awayScore}`
                  : 'vs'}
              </span>
              <span className="truncate">{post.matches[0].awayTeam || '未設定'}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{post.matches[0].stadium}</p>
          </div>
          {(post.matches[0].seat || post.matches[0].seatReview) && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
              {post.matches[0].seat && (
                <div className="text-sm">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">座席情報:</span>
                  <span className="ml-2 dark:text-white">{post.matches[0].seat}</span>
                </div>
              )}
              {post.matches[0].seatReview && (
                <p className="text-sm mt-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md">{post.matches[0].seatReview}</p>
              )}
            </div>
          )}
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

      <PostActions likeCount={post.likeCount || 0} match={post.matches && post.matches.length > 0 ? post.matches[0] : undefined} />

      <div className="w-full h-[100px] sm:h-[120px]" />
    </div>
  );
}
