'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp, Timestamp, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

type ThreadListItem = {
  id: string;
  title: string;
  body: string;
  thumbnailUrl?: string | null;
  authorName: string;
  authorImage?: string | null;
  createdAt: Date | null;
  hasPoll?: boolean;
  commentCount?: number;
};

export default function ThreadsSection() {
  const router = useRouter();
  const { user, userProfile } = useAuth();

  const [threads, setThreads] = useState<ThreadListItem[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(true);

  const [threadTitle, setThreadTitle] = useState('');
  const [threadBody, setThreadBody] = useState('');
  const [threadSubmitting, setThreadSubmitting] = useState(false);
  const [threadFormOpen, setThreadFormOpen] = useState(false);

  const [threadPollEnabled, setThreadPollEnabled] = useState(false);
  const [threadPollOptions, setThreadPollOptions] = useState<string[]>(['', '', '', '']);

  const [threadThumbnailFile, setThreadThumbnailFile] = useState<File | null>(null);
  const [threadThumbnailPreviewUrl, setThreadThumbnailPreviewUrl] = useState<string | null>(null);

  const formatThreadDate = (d: Date | null) => {
    if (!d) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setThreadsLoading(true);
      try {
        const q = query(collection(db, 'threads'), orderBy('createdAt', 'desc'), limit(10));
        const snap = await getDocs(q);
        const baseItems = snap.docs
          .map((d) => {
            const data: any = d.data();
            const createdAt = (() => {
              const c = data?.createdAt;
              if (!c) return null;
              if (c instanceof Date) return c;
              if (typeof c?.toDate === 'function') return c.toDate();
              if (typeof c?.seconds === 'number') return new Timestamp(c.seconds, c.nanoseconds).toDate();
              return null;
            })();
            return {
              id: d.id,
              title: String(data?.title ?? ''),
              body: String(data?.body ?? ''),
              thumbnailUrl: (data?.thumbnailUrl ?? null) as string | null,
              authorName: String(data?.authorName ?? '名無し'),
              authorImage: (data?.authorImage ?? null) as string | null,
              createdAt,
              hasPoll: Boolean(data?.poll),
            };
          })
          .filter((it) => it.title);

        const threadIds = baseItems.map((t) => t.id).filter(Boolean);
        const counts = new Map<string, number>();
        if (threadIds.length > 0) {
          const repliesQ = query(collection(db, 'thread-replies'), where('threadId', 'in', threadIds));
          const repliesSnap = await getDocs(repliesQ);
          repliesSnap.docs.forEach((d) => {
            const data: any = d.data();
            const tid = String(data?.threadId ?? '');
            if (!tid) return;
            counts.set(tid, (counts.get(tid) ?? 0) + 1);
          });
        }

        const items: ThreadListItem[] = baseItems.map((t) => ({
          ...t,
          commentCount: counts.get(t.id) ?? 0,
        }));

        if (!cancelled) setThreads(items);
      } catch {
        if (!cancelled) setThreads([]);
      } finally {
        if (!cancelled) setThreadsLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateThread = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    const title = threadTitle.trim();
    const body = threadBody.trim();
    if (!title) return;

    const pollOptions = threadPollOptions.map((s) => s.trim());
    const pollHasAny = pollOptions.some((s) => s.length > 0);
    const pollActive = threadPollEnabled || pollHasAny;
    if (pollActive) {
      const allFilled = pollOptions.every((s) => s.length > 0);
      const allLenOk = pollOptions.every((s) => s.length <= 15);
      if (!allFilled || !allLenOk) return;
    }

    setThreadSubmitting(true);
    try {
      const authorName = userProfile?.nickname || user.displayName || '名無し';
      const authorImage = userProfile?.avatarUrl || user.photoURL || null;
      const thumbnailUrl = threadThumbnailFile ? await uploadToCloudinary(threadThumbnailFile) : null;

      const ref = await addDoc(collection(db, 'threads'), {
        authorId: user.uid,
        authorName,
        authorImage,
        title,
        body,
        thumbnailUrl,
        poll: pollActive
          ? {
              options: pollOptions,
              counts: [0, 0, 0, 0],
            }
          : null,
        createdAt: serverTimestamp(),
      });

      setThreadTitle('');
      setThreadBody('');
      setThreadPollEnabled(false);
      setThreadPollOptions(['', '', '', '']);
      setThreadThumbnailFile(null);
      if (threadThumbnailPreviewUrl) URL.revokeObjectURL(threadThumbnailPreviewUrl);
      setThreadThumbnailPreviewUrl(null);
      setThreadFormOpen(false);

      router.push(`/threads/${ref.id}`);
    } finally {
      setThreadSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-gray-100">スレッド</div>
            <div className="text-xs text-gray-300">タイムラインで会話しよう</div>
          </div>
          {!user ? (
            <Link
              href="/login"
              className="rounded-full px-3 py-2 text-xs bg-white/10 text-gray-100 border border-white/10 hover:bg-white/15 transition-colors shrink-0"
            >
              ログイン
            </Link>
          ) : null}
        </div>

        <div className="mt-3">
          {!threadFormOpen ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    router.push('/login');
                    return;
                  }
                  setThreadFormOpen(true);
                }}
                className="rounded-full px-4 py-2 text-xs bg-white/90 text-slate-900 hover:bg-white transition-colors"
              >
                スレ立てる
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                value={threadTitle}
                onChange={(e) => setThreadTitle(e.target.value)}
                placeholder="タイトル"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <textarea
                value={threadBody}
                onChange={(e) => setThreadBody(e.target.value)}
                placeholder="本文（任意）"
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
              />

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-gray-200">サムネ画像（任意）</div>
                <div className="mt-2 flex items-start gap-3">
                  {threadThumbnailPreviewUrl ? (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/10">
                      <Image
                        src={threadThumbnailPreviewUrl}
                        alt="サムネプレビュー"
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={threadSubmitting}
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setThreadThumbnailFile(f);
                        if (threadThumbnailPreviewUrl) URL.revokeObjectURL(threadThumbnailPreviewUrl);
                        setThreadThumbnailPreviewUrl(f ? URL.createObjectURL(f) : null);
                      }}
                      className="block w-full text-xs text-gray-200 file:mr-3 file:rounded-full file:border file:border-white/10 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:text-gray-100 hover:file:bg-white/15"
                    />
                    {threadThumbnailPreviewUrl ? (
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setThreadThumbnailFile(null);
                            if (threadThumbnailPreviewUrl) URL.revokeObjectURL(threadThumbnailPreviewUrl);
                            setThreadThumbnailPreviewUrl(null);
                          }}
                          disabled={threadSubmitting}
                          className="rounded-full px-3 py-1.5 text-[10px] bg-white/10 text-gray-100 border border-white/10 hover:bg-white/15 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          画像を外す
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-gray-200">投票（4択）</div>
                  <button
                    type="button"
                    onClick={() => setThreadPollEnabled((v) => !v)}
                    className="rounded-full px-3 py-1.5 text-[10px] bg-white/10 text-gray-100 border border-white/10 hover:bg-white/15 transition-colors"
                  >
                    {threadPollEnabled ? 'OFF' : 'ON'}
                  </button>
                </div>

                {threadPollEnabled ? (
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {threadPollOptions.map((opt, idx) => (
                      <input
                        key={idx}
                        value={opt}
                        onChange={(e) => {
                          const next = [...threadPollOptions];
                          next[idx] = e.target.value;
                          setThreadPollOptions(next);
                        }}
                        maxLength={15}
                        placeholder={`選択肢${idx + 1}（15文字まで）`}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    ))}
                    <div className="text-[10px] text-gray-400">投票を付ける場合は4つ全て入力してね</div>
                  </div>
                ) : null}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setThreadFormOpen(false)}
                  disabled={threadSubmitting}
                  className="rounded-full px-4 py-2 text-xs bg-white/10 text-gray-100 border border-white/10 hover:bg-white/15 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={handleCreateThread}
                  disabled={
                    threadSubmitting ||
                    !threadTitle.trim() ||
                    ((threadPollEnabled || threadPollOptions.some((s) => s.trim().length > 0)) &&
                      (!threadPollOptions.every((s) => s.trim().length > 0) ||
                        !threadPollOptions.every((s) => s.trim().length <= 15)))
                  }
                  className="rounded-full px-4 py-2 text-xs bg-white/90 text-slate-900 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {threadSubmitting ? '作成中...' : '投稿'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          {threadsLoading ? (
            <div className="text-xs text-gray-300">読み込み中...</div>
          ) : threads.length === 0 ? (
            <div className="text-xs text-gray-300">まだスレッドがありません</div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={12}
              slidesPerView={'auto'}
              navigation
              pagination={{ clickable: true }}
              className="pb-8"
            >
              {threads.slice(0, 10).map((t) => (
                <SwiperSlide key={t.id} style={{ width: '260px' }}>
                  <Link
                    href={`/threads/${t.id}`}
                    className="block rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors overflow-hidden h-full"
                  >
                    <div className="flex flex-col h-full">
                      <div className="relative w-full aspect-[16/9] bg-white/10">
                        <Image
                          src={t.thumbnailUrl || '/スポカレ.png'}
                          alt={t.title}
                          fill
                          sizes="260px"
                          className="object-cover"
                        />
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm text-gray-100 font-semibold leading-snug line-clamp-3">{t.title}</div>
                          {t.hasPoll ? (
                            <div className="shrink-0 rounded-full px-2 py-0.5 text-[10px] bg-blue-600 text-white">投票</div>
                          ) : null}
                        </div>

                        {t.body ? (
                          <div className="mt-2 text-xs text-gray-300 leading-relaxed line-clamp-3">{t.body}</div>
                        ) : (
                          <div className="mt-2 text-xs text-gray-300 leading-relaxed line-clamp-3">&nbsp;</div>
                        )}

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10">
                              <Image
                                src={t.authorImage || '/default-avatar.svg'}
                                alt={t.authorName}
                                fill
                                sizes="28px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11px] text-gray-200 line-clamp-1">{t.authorName}</div>
                              <div className="text-[10px] text-gray-400">{formatThreadDate(t.createdAt)}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="rounded-full px-2 py-1 bg-white/5 border border-white/10">💬 {t.commentCount ?? 0}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}
