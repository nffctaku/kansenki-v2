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
import { Post } from '@/types/match';


export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // ページがクライアントサイドで読み込まれた後に現在のURLを取得
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      const docRef = doc(db, 'simple-posts', id as string);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const postData = snap.data() as Post;
        // FirestoreのドキュメントにはIDが含まれていないため、手動で追加
        postData.id = snap.id;
        setPost(postData);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) return <p className="text-center py-10">読み込み中...</p>;

  const rawTotalCost = post.cost
    ? Object.values(post.cost as Record<string, number>).reduce((sum, v) => sum + (Number(v) || 0), 0)
    : 0;
  
  const totalCost = Math.round(rawTotalCost / 10000);


  const hasHotels = post.hotels?.some((h) => (h.url && h.url.startsWith('http')) || (h.rating && h.rating > 0) || h.comment);
  const hasSpots = post.spots?.some((s) => (s.url && s.url.startsWith('http')) || (s.rating && s.rating > 0) || s.comment);

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
                <div className="relative aspect-square w-full bg-gray-200 rounded overflow-hidden">
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
  <h2 className="text-base font-bold bg-gray-100 px-4 py-2 border-b">投稿者情報</h2>
  <table className="w-full text-sm table-fixed">
    <tbody>
      <tr className="bg-white">
        <th className="w-1/3 px-4 py-1 text-left text-gray-700 font-normal">ニックネーム</th>
        <td className="px-4 py-1 text-right break-words">{post.author || '未設定'}</td>
      </tr>
      {post.userId && (
        <tr className="bg-gray-100">
          <th className="px-4 py-1 text-left text-gray-700 font-normal">ユーザーID</th>
          <td className="px-4 py-1 text-right break-words">
            <a href={`/user/${post.userId}`} className="text-blue-500 hover:underline">
              @{post.userId}
            </a>
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      {/* 観戦した試合 */}
      <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
        <h2 className="text-base font-bold bg-gray-100 px-4 py-2 border-b">観戦した試合</h2>
        <table className="w-full text-sm table-fixed">
          <tbody>
            {post.matches?.[0]?.competition && (
              <tr className="bg-white">
                <th className="w-1/3 px-4 py-1 text-left text-gray-700 font-normal">大会名</th>
                <td className="px-4 py-1 text-right break-words">
                  {post.matches[0].competition}
                </td>
              </tr>
            )}
            {(post.matches?.[0]?.teamA || post.matches?.[0]?.teamB) && (
              <tr className="bg-gray-100">
                <th className="px-4 py-1 text-left text-gray-700 font-normal">対戦カード</th>
                <td className="px-4 py-1 text-right break-words">
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
              <tr className="bg-white">
                <th className="px-4 py-1 text-left text-gray-700 font-normal">シーズン</th>
                <td className="px-4 py-1 text-right break-words">{post.season}</td>
              </tr>
            )}
            {post.matches?.[0]?.stadium && (
              <tr className="bg-gray-100">
                <th className="px-4 py-1 text-left text-gray-700 font-normal">スタジアム</th>
                <td className="px-4 py-1 text-right break-words">
                  {post.matches[0].stadium}
                </td>
              </tr>
            )}
            {post.matches?.[0]?.seat && (
              <tr className="bg-white">
                <th className="px-4 py-1 text-left text-gray-700 font-normal">座席</th>
                <td className="px-4 py-1 text-right break-words">
                  {post.matches[0].seat}
                </td>
              </tr>
            )}
            {post.matches?.[0]?.ticketPrice && (
              <tr className="bg-gray-100">
                <th className="px-4 py-1 text-left text-gray-700 font-normal">チケット価格</th>
                <td className="px-4 py-1 text-right break-words">
                  {`¥${Number(post.matches[0].ticketPrice).toLocaleString()}`}
                </td>
              </tr>
            )}
            {post.matches?.[0]?.seatReview && (
              <tr className="bg-white">
                <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">座席レビュー</th>
                <td className="px-4 py-1 text-right whitespace-pre-wrap">
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
              <tr className="bg-white">
                <th className="w-1/3 px-4 py-1 text-left text-gray-700 font-normal align-top">カテゴリー</th>
                <td className="px-4 py-1 text-right break-words">{post.category}</td>
              </tr>
            )}
            {post.season && (
              <tr className="bg-gray-100">
                <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">観戦シーズン</th>
                <td className="px-4 py-1 text-right break-words">{post.season}</td>
              </tr>
            )}
            {post.lifestyle && (
              <tr className="bg-white">
                <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">ライフスタイル</th>
                <td className="px-4 py-1 text-right break-words">{post.lifestyle}</td>
              </tr>
            )}
            {post.watchYear && post.watchMonth && (
              <tr className="bg-gray-100">
                <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">観戦時期</th>
                <td className="px-4 py-1 text-right break-words">
                  {post.watchYear}年 {post.watchMonth}月
                </td>
              </tr>
            )}
            {post.stayDuration && (
              <tr className="bg-white">
                <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">滞在期間</th>
                <td className="px-4 py-1 text-right break-words">{post.stayDuration}</td>
              </tr>
            )}
            {post.goFlights && post.goFlights.length > 0 && (
              <tr className="bg-gray-100">
                <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">行きの航空会社</th>
                <td className="px-4 py-1 text-right">
                  <div className="flex flex-col items-end gap-[2px]">
                    {post.goFlights.map((f, i) => (
                      <div key={i}>{f.name}（{f.seat}）</div>
                    ))}
                  </div>
                </td>
              </tr>
            )}
            {post.returnFlights && post.returnFlights.length > 0 && (
              <tr className="bg-white">
                <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">帰りの航空会社</th>
                <td className="px-4 py-1 text-right">
                  {(Array.from(new Set(post.returnFlights.map((f) => `${f.name}（${f.seat}）`))) as string[]).map((text, i) => (
                    <div key={i}>{text}</div>
                  ))}
                </td>
              </tr>
            )}
            {(post.goTime || post.goType || post.goVia) && (
              <tr className="bg-gray-100">
                <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">行きの移動</th>
                <td className="px-4 py-1 text-right break-words">
                  {[post.goTime, post.goType, post.goVia].filter(Boolean).join(' / ')}
                </td>
              </tr>
            )}
            {(post.returnTime || post.returnType || post.returnVia) && (
              <tr className="bg-white">
                <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">帰りの移動</th>
                <td className="px-4 py-1 text-right break-words">
                  {[post.returnTime, post.returnType, post.returnVia].filter(Boolean).join(' / ')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 宿泊先 */}
      {hasHotels && (
        <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
          <h2 className="text-base font-bold bg-gray-100 px-4 py-2 border-b">宿泊先</h2>
          <table className="w-full text-sm table-fixed">
            <tbody>
              {post.hotels?.map((h, i) => (
                <>
                  {h.url && h.url.startsWith('http') && (
                    <tr key={`hotel-link-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                      <th className="w-1/3 px-4 py-1 text-left text-gray-700 font-normal align-top">ホテルリンク</th>
                      <td className="px-4 py-1 text-right break-words">
                        <a
                          href={h.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {new URL(h.url).hostname.replace('www.', '')}
                        </a>
                      </td>
                    </tr>
                  )}
                  {h.rating && h.rating > 0 && (
                    <tr key={`hotel-rating-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                      <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">評価</th>
                      <td className="px-4 py-1 text-right">{h.rating} ★</td>
                    </tr>
                  )}
                  {h.comment && (
                    <tr key={`hotel-comment-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                      <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">コメント</th>
                      <td className="px-4 py-1 text-right whitespace-pre-wrap">{h.comment}</td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* おすすめスポット */}
      {hasSpots && (
        <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
          <h2 className="text-base font-bold bg-gray-100 px-4 py-2 border-b">おすすめスポット</h2>
          <table className="w-full text-sm table-fixed">
            <tbody>
              {post.spots?.map((s, i) => (
                <>
                  {s.url && s.url.startsWith('http') && (
                    <tr key={`spot-link-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                      <th className="w-1/3 px-4 py-1 text-left text-gray-700 font-normal align-top">スポットリンク</th>
                      <td className="px-4 py-1 text-right break-words">
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {new URL(s.url).hostname.replace('www.', '')}
                        </a>
                      </td>
                    </tr>
                  )}
                  {s.rating && s.rating > 0 && (
                    <tr key={`spot-rating-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                      <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">評価</th>
                      <td className="px-4 py-1 text-right">{s.rating} ★</td>
                    </tr>
                  )}
                  {s.comment && (
                    <tr key={`spot-comment-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                      <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">コメント</th>
                      <td className="px-4 py-1 text-right whitespace-pre-wrap">{s.comment}</td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* その他の情報 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 px-6 py-6">
        <h2 className="text-xl font-extrabold text-gray-900 border-b border-gray-300 pb-3 mb-4">
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
              <section key={i} className="bg-gray-50 rounded-md px-4 py-2">
                <h3 className="text-sm font-bold text-gray-800 mb-0.5">{label as string}</h3>
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-snug">
                  {value as string}
                </p>
              </section>
            ) : null
          )}
        </div>
      </div>

      {/* 費用内訳 */}
      {rawTotalCost > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
          <h2 className="text-base font-bold bg-gray-100 px-4 py-2 border-b">費用内訳</h2>
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
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                    <th className="w-1/3 px-4 py-1 text-left text-gray-700 font-normal align-top">{label as string}</th>
                    <td className="px-4 py-1 text-right">
                      {`¥${Number(value).toLocaleString()}`}
                    </td>
                  </tr>
                ) : null
              )}
              <tr className="bg-white">
                <th className="px-4 py-2 text-left text-gray-900 font-semibold">費用合計</th>
                <td className="px-4 py-2 text-right font-bold text-gray-900">
                  約 {totalCost} 万円
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Social Buttons */}
      <div className="flex justify-center items-center gap-6 mt-6 text-[11px] text-gray-700">
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
          <img src="/フリーのクリップアイコン.png" alt="コピー" className="w-[16px] h-[16px] mb-0.5 object-contain" />
        </button>

        {/* X */}
        <a
          href={currentUrl && post ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(`『${post.matches[0]?.teamA} vs ${post.matches[0]?.teamB}』の観戦記をチェック！ #kansenki`)}&url=${encodeURIComponent(currentUrl)}` : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={!currentUrl ? 'pointer-events-none opacity-50' : ''}
        >
          <img src="/logo-black.png" alt="X" className="w-[16px] h-[16px] mb-0.5 object-contain" />
        </a>
      </div>

      {/* フッター被り回避スペーサー */}
      <div className="w-full h-[100px] sm:h-[120px]" />
    </div>
  );
}
