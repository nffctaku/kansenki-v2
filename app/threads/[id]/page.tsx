'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

type ThreadView = {
  id: string;
  authorId: string;
  authorName: string;
  authorImage?: string | null;
  title: string;
  body: string;
  thumbnailUrl?: string | null;
  poll: { options: string[]; counts: number[] } | null;
  createdAt: Date | null;
};

type ThreadReplyView = {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorImage?: string | null;
  body: string;
  createdAt: Date | null;
};

export default function ThreadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const threadId = params.id as string;

  const [thread, setThread] = useState<ThreadView | null>(null);
  const [threadLoading, setThreadLoading] = useState(true);
  const [replies, setReplies] = useState<ThreadReplyView[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(true);

  const [pollChoiceIndex, setPollChoiceIndex] = useState<number | null>(null);
  const [pollChecking, setPollChecking] = useState(true);
  const [pollSubmitting, setPollSubmitting] = useState(false);

  const [threadDeleting, setThreadDeleting] = useState(false);
  const [replyDeletingId, setReplyDeletingId] = useState<string | null>(null);

  const [replyBody, setReplyBody] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const formattedThreadDate = useMemo(() => {
    if (!thread?.createdAt) return null;
    const d = thread.createdAt;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
  }, [thread?.createdAt]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!threadId) return;
      setThreadLoading(true);
      try {
        const snap = await getDoc(doc(db, 'threads', threadId));
        if (!snap.exists()) {
          if (!cancelled) setThread(null);
          return;
        }
        const data: any = snap.data();
        const createdAt = (() => {
          const c = data?.createdAt;
          if (!c) return null;
          if (c instanceof Date) return c;
          if (typeof c?.toDate === 'function') return c.toDate();
          if (typeof c?.seconds === 'number') return new Timestamp(c.seconds, c.nanoseconds).toDate();
          return null;
        })();

        const t: ThreadView = {
          id: snap.id,
          authorId: String(data?.authorId ?? ''),
          authorName: String(data?.authorName ?? '名無し'),
          authorImage: (data?.authorImage ?? null) as string | null,
          title: String(data?.title ?? ''),
          body: String(data?.body ?? ''),
          thumbnailUrl: (data?.thumbnailUrl ?? null) as string | null,
          poll: (() => {
            const p = data?.poll;
            if (!p) return null;
            const optionsRaw = Array.isArray(p?.options) ? p.options.map((x: any) => String(x ?? '')) : null;
            const countsRaw = Array.isArray(p?.counts) ? p.counts.map((x: any) => Number(x ?? 0)) : null;
            if (!optionsRaw || optionsRaw.length < 1) return null;

            const options = optionsRaw.slice(0, 4);
            const counts = (countsRaw ?? []).slice(0, 4);
            while (counts.length < options.length) counts.push(0);
            return { options, counts };
          })(),
          createdAt,
        };
        if (!cancelled) setThread(t);
      } finally {
        if (!cancelled) setThreadLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [threadId]);

  const handleDeleteThread = async () => {
    if (!user || !thread) return;
    if (thread.authorId !== user.uid) return;
    if (threadDeleting) return;
    const ok = window.confirm('このスレッドを削除しますか？（返信も削除されます）');
    if (!ok) return;

    setThreadDeleting(true);
    try {
      try {
        const repliesSnap = await getDocs(
          query(collection(db, 'thread-replies'), where('threadId', '==', threadId), limit(500))
        );
        for (const d of repliesSnap.docs) {
          await deleteDoc(doc(db, 'thread-replies', d.id));
        }
      } catch {
        // ignore
      }

      try {
        const votesSnap = await getDocs(
          query(collection(db, 'thread-poll-votes'), where('threadId', '==', threadId), limit(500))
        );
        for (const d of votesSnap.docs) {
          await deleteDoc(doc(db, 'thread-poll-votes', d.id));
        }
      } catch {
        // ignore
      }

      await deleteDoc(doc(db, 'threads', threadId));
      router.push('/timeline');
    } finally {
      setThreadDeleting(false);
    }
  };

  const handleDeleteReply = async (replyId: string, replyAuthorId: string) => {
    if (!user) return;
    if (replyAuthorId !== user.uid) return;
    if (replyDeletingId) return;
    const ok = window.confirm('この返信を削除しますか？');
    if (!ok) return;

    setReplyDeletingId(replyId);
    try {
      await deleteDoc(doc(db, 'thread-replies', replyId));
      setReplies((prev) => prev.filter((r) => r.id !== replyId));
    } finally {
      setReplyDeletingId(null);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setPollChecking(true);
      try {
        if (!user || !threadId) {
          if (!cancelled) setPollChoiceIndex(null);
          return;
        }
        const voteId = `${threadId}_${user.uid}`;
        const snap = await getDoc(doc(db, 'thread-poll-votes', voteId));
        if (!snap.exists()) {
          if (!cancelled) setPollChoiceIndex(null);
          return;
        }
        const data: any = snap.data();
        const idx = typeof data?.choiceIndex === 'number' ? data.choiceIndex : Number(data?.choiceIndex);
        if (!cancelled) setPollChoiceIndex(Number.isFinite(idx) ? idx : null);
      } finally {
        if (!cancelled) setPollChecking(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [threadId, user]);

  useEffect(() => {
    if (!threadId) return;
    let cancelled = false;
    setRepliesLoading(true);

    const q = query(
      collection(db, 'thread-replies'),
      where('threadId', '==', threadId),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => {
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
            threadId: String(data?.threadId ?? ''),
            authorId: String(data?.authorId ?? ''),
            authorName: String(data?.authorName ?? '名無し'),
            authorImage: (data?.authorImage ?? null) as string | null,
            body: String(data?.body ?? ''),
            createdAt,
          };
        });

        if (!cancelled) {
          setReplies(items);
          setRepliesLoading(false);
        }
      },
      () => {
        if (!cancelled) {
          setReplies([]);
          setRepliesLoading(false);
        }
      }
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [threadId]);

  const handleSubmitReply = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    const body = replyBody.trim();
    if (!body) return;

    setReplyError(null);
    setReplySubmitting(true);
    try {
      const authorName = userProfile?.nickname || user.displayName || '名無し';
      const authorImage = userProfile?.avatarUrl || user.photoURL || null;
      await addDoc(collection(db, 'thread-replies'), {
        threadId,
        authorId: user.uid,
        authorName,
        authorImage,
        body,
        createdAt: serverTimestamp(),
      });
      setReplyBody('');
    } catch (e: any) {
      console.error('Failed to submit reply:', e);
      setReplyError(e?.message ? String(e.message) : '返信の投稿に失敗しました');
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleVote = async (choiceIndex: number) => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!thread?.poll) return;
    if (pollChoiceIndex !== null) return;
    if (choiceIndex < 0 || choiceIndex > 3) return;

    setPollSubmitting(true);
    try {
      const voteId = `${threadId}_${user.uid}`;
      const voteRef = doc(db, 'thread-poll-votes', voteId);
      const threadRef = doc(db, 'threads', threadId);

      await runTransaction(db, async (tx) => {
        const existing = await tx.get(voteRef);
        if (existing.exists()) return;

        const threadSnap = await tx.get(threadRef);
        if (!threadSnap.exists()) return;
        const data: any = threadSnap.data();
        const p = data?.poll;
        if (!p || !Array.isArray(p.options) || !Array.isArray(p.counts) || p.options.length !== 4 || p.counts.length !== 4) {
          return;
        }

        const nextCounts = p.counts.map((n: any, idx: number) => {
          const base = Number(n ?? 0);
          return idx === choiceIndex ? base + 1 : base;
        });

        tx.set(voteRef, {
          threadId,
          userId: user.uid,
          choiceIndex,
          createdAt: serverTimestamp(),
        });
        tx.update(threadRef, {
          poll: {
            options: p.options,
            counts: nextCounts,
          },
        });
      });

      setPollChoiceIndex(choiceIndex);

      const updatedThreadSnap = await getDoc(doc(db, 'threads', threadId));
      if (updatedThreadSnap.exists()) {
        const data: any = updatedThreadSnap.data();
        const poll = (() => {
          const p = data?.poll;
          if (!p) return null;
          const optionsRaw = Array.isArray(p?.options) ? p.options.map((x: any) => String(x ?? '')) : null;
          const countsRaw = Array.isArray(p?.counts) ? p.counts.map((x: any) => Number(x ?? 0)) : null;
          if (!optionsRaw || optionsRaw.length < 1) return null;

          const options = optionsRaw.slice(0, 4);
          const counts = (countsRaw ?? []).slice(0, 4);
          while (counts.length < options.length) counts.push(0);
          return { options, counts };
        })();
        setThread((prev) => (prev ? { ...prev, poll } : prev));
      }
    } finally {
      setPollSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950">
      <div className="px-3 pt-4 pb-24 max-w-screen-md mx-auto">
        <div className="mb-3">
          <Link href="/timeline" className="text-xs text-white/70 hover:text-white transition-colors">
            ← タイムラインへ
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 overflow-hidden">
          <div className="p-4">
            {threadLoading ? (
              <div className="text-xs text-gray-300">読み込み中...</div>
            ) : !thread ? (
              <div className="text-xs text-gray-300">スレッドが見つかりませんでした</div>
            ) : (
              <div>
                <div className="flex items-start gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10">
                    <Image
                      src={thread.authorImage || '/default-avatar.svg'}
                      alt={thread.authorName}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-100 font-semibold">{thread.title}</div>
                    {thread.thumbnailUrl ? (
                      <div className="mt-2 relative w-full aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-white/10">
                        <Image
                          src={thread.thumbnailUrl}
                          alt={thread.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 640px"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="mt-1 text-xs text-gray-300 whitespace-pre-wrap">{thread.body}</div>
                    <div className="mt-2 text-[10px] text-gray-400">
                      {thread.authorName}
                      {formattedThreadDate ? ` ・ ${formattedThreadDate}` : ''}
                    </div>
                  </div>
                  {user && thread.authorId === user.uid ? (
                    <div className="shrink-0">
                      <button
                        type="button"
                        onClick={handleDeleteThread}
                        disabled={threadDeleting}
                        className="rounded-full px-3 py-2 text-[10px] bg-white/10 text-gray-100 border border-white/10 hover:bg-white/15 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {threadDeleting ? '削除中...' : '削除'}
                      </button>
                    </div>
                  ) : null}
                </div>

                {thread.poll ? (
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-sm text-gray-100">投票</div>

                    {pollChecking ? (
                      <div className="mt-2 text-xs text-gray-300">読み込み中...</div>
                    ) : pollChoiceIndex === null ? (
                      <div className="mt-2 grid grid-cols-1 gap-2">
                        {thread.poll.options.slice(0, 4).map((opt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleVote(idx)}
                            disabled={pollSubmitting}
                            className="w-full text-left rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {opt}
                          </button>
                        ))}
                        <div className="text-[10px] text-gray-400">投票すると結果が表示されます</div>
                      </div>
                    ) : (
                      <div className="mt-2 space-y-2">
                        {(() => {
                          const counts = thread.poll?.counts ?? [0, 0, 0, 0];
                          const total = counts.reduce((a, b) => a + b, 0) || 0;
                          return thread.poll.options.slice(0, 4).map((opt, idx) => {
                            const c = counts[idx] ?? 0;
                            const pct = total > 0 ? Math.round((c / total) * 100) : 0;
                            const selected = idx === pollChoiceIndex;
                            return (
                              <div key={idx} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                                <div className="px-3 py-2">
                                  <div className="flex items-center justify-between gap-3">
                                    <div className={selected ? 'text-sm text-gray-100 font-semibold' : 'text-sm text-gray-100'}>
                                      {opt}
                                    </div>
                                    <div className="text-xs text-gray-300 shrink-0">{pct}% ({c})</div>
                                  </div>
                                  <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                                    <div
                                      className={selected ? 'h-2 bg-white/80' : 'h-2 bg-white/40'}
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
                ) : null}

                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="text-sm text-gray-100">返信</div>

                  <div className="mt-2 space-y-2">
                    <textarea
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      placeholder={user ? '返信を書く' : 'ログインすると返信できます'}
                      rows={3}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                      disabled={!user || replySubmitting}
                    />
                    {replyError ? <div className="text-[10px] text-red-200">{replyError}</div> : null}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSubmitReply}
                        disabled={!user || replySubmitting || !replyBody.trim()}
                        className="rounded-full px-4 py-2 text-xs bg-white/90 text-slate-900 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {replySubmitting ? '送信中...' : '返信する'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {repliesLoading ? (
                      <div className="text-xs text-gray-300">読み込み中...</div>
                    ) : replies.length === 0 ? (
                      <div className="text-xs text-gray-300">まだ返信がありません</div>
                    ) : (
                      replies.map((r) => (
                        <div key={r.id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                          <div className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10">
                                <Image
                                  src={r.authorImage || '/default-avatar.svg'}
                                  alt={r.authorName}
                                  fill
                                  sizes="36px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs text-gray-100 font-semibold">{r.authorName}</div>
                                <div className="mt-1 text-xs text-gray-300 whitespace-pre-wrap">{r.body}</div>
                              </div>
                              {user && r.authorId === user.uid ? (
                                <div className="shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteReply(r.id, r.authorId)}
                                    disabled={replyDeletingId === r.id}
                                    className="rounded-full px-3 py-1.5 text-[10px] bg-white/10 text-gray-100 border border-white/10 hover:bg-white/15 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {replyDeletingId === r.id ? '削除中...' : '削除'}
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
