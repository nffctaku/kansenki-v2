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

// 追加予定のアイコン or 共有用UIに備えて、ここに読み込み予定（未使用でもOK）
import { Share2, ClipboardIcon, Twitter, Facebook, Line } from 'lucide-react';

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [open, setOpen] = useState(false); // ⭐ ここが必要！

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      const docRef = doc(db, 'simple-posts', id as string);
      const snap = await getDoc(docRef);
      if (snap.exists()) setPost(snap.data());
    };
    fetchPost();
  }, [id]);

  if (!post) return <p className="text-center py-10">読み込み中...</p>;

  const totalCost = post.cost
    ? Math.round(
        Object.values(post.cost as Record<string, number>).reduce(
          (sum, v) => sum + Number(v),
          0
        ) / 10000
      )
    : 0;


  return (
    <div className="max-w-3xl mx-auto px-4 py-10 min-h-screen pb-[100px]">
      {/* ロゴ */}
      <div className="text-center mb-6">
        <Image
          src="/footballtop-logo-12.png"
          alt="FOOTBALLTOP ロゴ"
          width={180}
          height={60}
          unoptimized
          className="mx-auto"
        />
      </div>

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
        <td className="px-4 py-1 text-right break-words">{post.nickname || '未設定'}</td>
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
      <tr className="bg-white">
        <th className="w-1/3 px-4 py-1 text-left text-gray-700 font-normal">大会名</th>
        <td className="px-4 py-1 text-right break-words">
          {post.matches?.[0]?.competition || '未入力'}
        </td>
      </tr>
     <tr className="bg-gray-100">
  <th className="px-4 py-1 text-left text-gray-700 font-normal">対戦カード</th>
  <td className="px-4 py-1 text-right break-words">
    <div className="leading-tight">
      <div>{post.matches?.[0]?.teamA}</div>
      <div>{post.matches?.[0]?.teamB}</div>
    </div>
  </td>
</tr>

    </tbody>
  </table>
</div>


{/* 渡航・観戦情報 */}
<div className="bg-white rounded-xl shadow overflow-hidden mb-6">
  <h2 className="text-base font-bold bg-gray-100 px-4 py-2 border-b">渡航・観戦情報</h2>
  <table className="w-full text-sm table-fixed">
    <tbody>
      <tr className="bg-white">
        <th className="w-1/3 px-4 py-1 text-left text-gray-700 font-normal align-top">カテゴリー</th>
        <td className="px-4 py-1 text-right break-words">{post.category}</td>
      </tr>
      <tr className="bg-gray-100">
        <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">観戦シーズン</th>
        <td className="px-4 py-1 text-right break-words">{post.season}</td>
      </tr>
      <tr className="bg-white">
        <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">ライフスタイル</th>
        <td className="px-4 py-1 text-right break-words">{post.lifestyle}</td>
      </tr>
      <tr className="bg-gray-100">
        <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">観戦時期</th>
        <td className="px-4 py-1 text-right break-words">
          {post.watchYear}年 {post.watchMonth}月
        </td>
      </tr>
      <tr className="bg-white">
        <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">滞在期間</th>
        <td className="px-4 py-1 text-right break-words">{post.stayDuration}</td>
      </tr>
      <tr className="bg-gray-100">
        <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">行きの航空会社</th>
        <td className="px-4 py-1 text-right">
          {post.goFlights?.length ? (
            <div className="flex flex-col items-end gap-[2px]">
              {post.goFlights.map((f: any, i: number) => (
                <div key={i}>{f.name}（{f.seat}）</div>
              ))}
            </div>
          ) : '未入力'}
        </td>
      </tr>
      <tr className="bg-white">
  <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">帰りの航空会社</th>
  <td className="px-4 py-1 text-right">
    {post.returnFlights?.length ? (
      [...new Set(post.returnFlights.map((f: any) => `${f.name}（${f.seat}）`))].map((text, i) => (
        <div key={i}>{text}</div>
      ))
    ) : '未入力'}
  </td>
</tr>

      <tr className="bg-gray-100">
        <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">行きの移動</th>
        <td className="px-4 py-1 text-right break-words">
          {[post.goTime, post.goType, post.goVia].filter(Boolean).join(' / ')}
        </td>
      </tr>
      <tr className="bg-white">
        <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">帰りの移動</th>
        <td className="px-4 py-1 text-right break-words">
          {[post.returnTime, post.returnType, post.returnVia].filter(Boolean).join(' / ')}
        </td>
      </tr>
    </tbody>
  </table>
</div>




{/* 宿泊先 */}
<div className="bg-white rounded-xl shadow overflow-hidden mb-6">
  <h2 className="text-base font-bold bg-gray-100 px-4 py-2 border-b">宿泊先</h2>
  <table className="w-full text-sm table-fixed">
    <tbody>
      {post.hotels?.length ? post.hotels.map((h: any, i: number) => (
        <>
          <tr key={`hotel-link-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
            <th className="w-1/3 px-4 py-1 text-left text-gray-700 font-normal align-top">ホテルリンク</th>
            <td className="px-4 py-1 text-right break-words">
              {h.url && h.url.startsWith('http') ? (
                <a
                  href={h.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {new URL(h.url).hostname.replace('www.', '')}
                </a>
              ) : 'リンクなし'}
            </td>
          </tr>
          <tr key={`hotel-rating-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
            <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">評価</th>
            <td className="px-4 py-1 text-right">{h.rating} ★</td>
          </tr>
          <tr key={`hotel-comment-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
            <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">コメント</th>
            <td className="px-4 py-1 text-right whitespace-pre-wrap">{h.comment}</td>
          </tr>
        </>
      )) : (
        <tr>
          <td colSpan={2} className="px-4 py-2 text-center text-gray-500">登録された宿泊先はありません</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

{/* おすすめスポット */}
<div className="bg-white rounded-xl shadow overflow-hidden mb-6">
  <h2 className="text-base font-bold bg-gray-100 px-4 py-2 border-b">おすすめスポット</h2>
  <table className="w-full text-sm table-fixed">
    <tbody>
      {post.spots?.length ? post.spots.map((s: any, i: number) => (
        <>
          <tr key={`spot-link-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
            <th className="w-1/3 px-4 py-1 text-left text-gray-700 font-normal align-top">スポットリンク</th>
            <td className="px-4 py-1 text-right break-words">
              {s.url && s.url.startsWith('http') ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {new URL(s.url).hostname.replace('www.', '')}
                </a>
              ) : 'リンクなし'}
            </td>
          </tr>
          <tr key={`spot-rating-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
            <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">評価</th>
            <td className="px-4 py-1 text-right">{s.rating} ★</td>
          </tr>
          <tr key={`spot-comment-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
            <th className="px-4 py-1 text-left text-gray-700 font-normal align-top">コメント</th>
            <td className="px-4 py-1 text-right whitespace-pre-wrap">{s.comment}</td>
          </tr>
        </>
      )) : (
        <tr>
          <td colSpan={2} className="px-4 py-2 text-center text-gray-500">おすすめスポットはありません</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

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
    ].map(([label, value], i) => (
      <section key={i} className="bg-gray-50 rounded-md px-4 py-2">
        <h3 className="text-sm font-bold text-gray-800 mb-0.5">{label}</h3>
        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-snug">
          {value}
        </p>
      </section>
    ))}
  </div>
</div>



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
      ].map(([label, value], i) => (
        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
          <th className="w-1/3 px-4 py-1 text-left text-gray-700 font-normal align-top">{label}</th>
          <td className="px-4 py-1 text-right">
            {value !== undefined ? `¥${Number(value).toLocaleString()}` : '―'}
          </td>
        </tr>
      ))}
      <tr className="bg-white">
        <th className="px-4 py-2 text-left text-gray-900 font-semibold">費用合計</th>
        <td className="px-4 py-2 text-right font-bold text-gray-900">
          約 {totalCost} 万円
        </td>
      </tr>
    </tbody>
  </table>
</div>

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
      navigator.clipboard.writeText(`https://kansenki.app/posts/${id}`);
      alert('リンクをコピーしました！');
    }}
    className="flex flex-col items-center hover:opacity-80 bg-transparent border-none p-0"
  >
    <img src="/フリーのクリップアイコン.png" alt="コピー" className="w-[16px] h-[16px] mb-0.5 object-contain" />
  </button>

  {/* X */}
  <a
  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('観戦記をチェック！')}&url=https://kansenki.app/posts/${id}`}
  target="_blank"
  rel="noopener noreferrer"
>
  <img src="/logo-black.png" alt="X" className="w-[16px] h-[16px] mb-0.5 object-contain" />
</a>

</div>



 {/* フッター被り回避スペーサー */}
    <div className="w-full h-[100px] sm:h-[120px]" />
  </div> // ← この1つの div で全体ラップ（閉じタグ1個だけ！）
);
}
