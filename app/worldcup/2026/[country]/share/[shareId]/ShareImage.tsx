'use client';

import { useEffect, useMemo, useState } from 'react';

export default function ShareImage({ imageUrl }: { imageUrl: string }) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setFailed(false);
    setAttempt(0);
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

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/30">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="予想画像"
        className="w-full h-auto"
        onError={() => setFailed(true)}
      />
      {failed ? (
        <div className="p-3 text-[11px] text-white/70">
          <div>画像の読み込みに失敗しました</div>
          <div className="mt-1 break-all">{src}</div>
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
        </div>
      ) : null}
    </div>
  );
}
