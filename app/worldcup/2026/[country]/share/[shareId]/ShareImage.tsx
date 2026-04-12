'use client';

import { useEffect, useMemo, useState } from 'react';

export default function ShareImage({ imageUrl }: { imageUrl: string }) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [diag, setDiag] = useState<{ status?: number; contentType?: string; error?: string } | null>(null);

  useEffect(() => {
    setFailed(false);
    setAttempt(0);
    setDiag(null);
  }, [imageUrl]);

  const src = useMemo(() => {
    const sep = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${sep}t=${Date.now()}&a=${attempt}`;
  }, [attempt, imageUrl]);

  useEffect(() => {
    if (!failed) return;
    if (attempt >= 3) return;
    const t = setTimeout(() => {
      setFailed(false);
      setAttempt((v) => v + 1);
    }, 600);
    return () => clearTimeout(t);
  }, [attempt, failed]);

  useEffect(() => {
    if (!failed) return;
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch(src, { method: 'HEAD', cache: 'no-store' });
        if (cancelled) return;
        setDiag({ status: res.status, contentType: res.headers.get('content-type') ?? undefined });
      } catch (e: any) {
        if (cancelled) return;
        setDiag({ error: typeof e?.message === 'string' ? e.message : 'fetch_failed' });
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [failed, src]);

  return (
    <div className="mt-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="予想画像"
        className="w-full h-auto"
        onError={() => setFailed(true)}
        loading="eager"
      />
      {failed ? (
        <div className="mt-2 text-[11px] text-white/70">
          <div>画像の読み込みに失敗しました</div>
          <div className="mt-1 break-all">{src}</div>
          {diag ? (
            <div className="mt-2">
              {typeof diag.status === 'number' ? <div>status: {diag.status}</div> : null}
              {diag.contentType ? <div>content-type: {diag.contentType}</div> : null}
              {diag.error ? <div>error: {diag.error}</div> : null}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setFailed(false);
              setAttempt((v) => v + 1);
            }}
            className="mt-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-[11px] text-white hover:bg-white/15"
          >
            再読み込み
          </button>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-[11px] text-white/80 hover:bg-black/40"
          >
            画像を別タブで開く
          </a>
        </div>
      ) : null}
    </div>
  );
}
