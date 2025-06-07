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

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);

  console.log('🧭 id:', id);

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
        Object.values(post.cost).reduce((sum, v) => sum + Number(v), 0) / 10000
      )
    : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
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
      

      {/* スライド画像（最大5枚） */}
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

{/* 投稿者情報 */}
<div className="flex items-center mt-4 mb-4 px-4 space-x-2">
  <div
    className="rounded-full overflow-hidden border border-gray-300"
    style={{
      width: '30px',
      height: '30px',
      minWidth: '30px',
      minHeight: '30px',
      backgroundColor: 'white',
    }}
  >
    <img
      src={post.userIconUrl || '/kkrn_icon_user_8.png'}
      alt="プロフィール写真"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  </div>
  <div className="text-sm leading-tight">
    <p className="font-semibold">{post.nickname}</p>
    {post.userId && (
      <a
        href={`/user/${post.userId}`}
        className="text-blue-500 text-xs hover:underline"
      >
        @{post.userId}
      </a>
    )}
  </div>
</div>



      {/* 詳細情報 */}
<div className="space-y-4 text-gray-700 text-sm">

  <p><strong>カテゴリー:</strong> {post.category}</p>
  <p><strong>観戦シーズン:</strong> {post.season}</p>

 <p><strong>観戦した試合</strong></p>

{/* 観戦試合リスト */}
<div className="w-full text-left !text-left ml-0 px-0">
  <ul className="list-none p-0 m-0 space-y-3 w-full text-left">
    {post.matches.map((match, index) => (
      <li
        key={index}
        className="w-full flex flex-col items-start text-left"
      >
        <p className="text-sm font-bold text-black !font-bold !text-black !text-left">
  {match.competition || '大会未設定'}
</p>

        <p className="text-base font-medium text-gray-900 leading-snug">
          {match.teamA}
          <span className="mx-1 text-gray-500 font-normal">vs</span>
          {match.teamB}
        </p>
      </li>
    ))}
  </ul>
</div>





  <p><strong>ライフスタイル:</strong> {post.lifestyle}</p>
  <p><strong>観戦時期:</strong> {post.watchYear}年 {post.watchMonth}月</p>
  <p><strong>滞在期間:</strong> {post.stayDuration}</p>

  <p><strong>行きの航空会社:</strong> {post.goFlights?.map((f: any) => `${f.name}（${f.seat}）`).join(', ')}</p>
  <p><strong>帰りの航空会社:</strong> {post.returnFlights?.map((f: any) => `${f.name}（${f.seat}）`).join(', ')}</p>
  <p><strong>行きの移動:</strong> {post.goTime} / {post.goType} / {post.goVia}</p>
  <p><strong>帰りの移動:</strong> {post.returnTime} / {post.returnType} / {post.returnVia}</p>

  <p><strong>費用詳細:</strong></p>
  <ul className="ml-4 list-disc text-sm">
    <li>航空券: ¥{post.cost?.flight?.toLocaleString()}</li>
    <li>ホテル: ¥{post.cost?.hotel?.toLocaleString()}</li>
    <li>チケット: ¥{post.cost?.ticket?.toLocaleString()}</li>
    <li>交通費: ¥{post.cost?.transport?.toLocaleString()}</li>
    <li>食費: ¥{post.cost?.food?.toLocaleString()}</li>
    <li>グッズ: ¥{post.cost?.goods?.toLocaleString()}</li>
    <li>その他: ¥{post.cost?.other?.toLocaleString()}</li>

  </ul>
  <p><strong>費用合計:</strong> 約 {totalCost} 万円</p>

  <p><strong>泊ったホテル:</strong></p>
<ul className="ml-4 list-disc text-sm text-gray-700">
  {post.hotels?.map((h: any, i: number) => (
    <li key={i}>
      <div>
        <a
          href={h.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {h.url && h.url.startsWith('http') ? new URL(h.url).hostname.replace('www.', '') : 'リンクなし'}
        </a>{' '}
        （{h.rating}★）
      </div>
      <div className="text-gray-700 whitespace-pre-line ml-2">{h.comment}</div>
    </li>
  ))}
</ul>

<p><strong>おすすめスポット:</strong></p>
<ul className="ml-4 list-disc text-sm text-gray-700">
  {post.spots?.map((s: any, i: number) => (
    <li key={i}>
      <div>
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {s.url && s.url.startsWith('http') ? new URL(s.url).hostname.replace('www.', '') : 'リンクなし'}
        </a>{' '}
        （{s.rating}★）
      </div>
      <div className="text-gray-700 whitespace-pre-line ml-2">{s.comment}</div>
    </li>
  ))}
</ul>




  <p><strong>持参アイテム:</strong></p>
  <p className="text-gray-700 whitespace-pre-wrap">{post.items}</p>
  <p><strong>購入グッズ:</strong></p>
  <p className="text-gray-700 whitespace-pre-wrap">{post.goods}</p>
  <p><strong>エピソード:</strong></p>
  <p className="text-gray-700 whitespace-pre-wrap">{post.episode}</p>
  <p><strong>初めての人へ一言:</strong></p>
  <p className="text-gray-700 whitespace-pre-wrap">{post.firstAdvice}</p>
</div>
</div>
);
}
