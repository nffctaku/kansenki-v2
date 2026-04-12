'use client';

import { useMemo, useState } from 'react';

export default function ShareImage({ imageUrl }: { imageUrl: string }) {
  const [failed, setFailed] = useState(false);

  const src = useMemo(() => {
    const sep = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${sep}t=${Date.now()}`;
  }, [imageUrl]);

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
        </div>
      ) : null}
    </div>
  );
}
