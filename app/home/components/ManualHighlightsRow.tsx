'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ManualHighlight } from '@/lib/highlights/manualHighlights';

type Props = {
  highlights: ManualHighlight[];
  loading?: boolean;
};

export default function ManualHighlightsRow({ highlights, loading = false }: Props) {
  return (
    <div className="mb-6">
      <div className="mb-2 text-sm font-bold text-gray-100">MATCH HIGHLIGHT</div>
      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/70">
          読み込み中...
        </div>
      ) : highlights.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/70">
          選択中のチームに該当するハイライトが見つかりませんでした
        </div>
      ) : (
        <div className="flex items-stretch gap-3 overflow-x-auto max-w-full pb-1">
          {highlights.map((h) => (
            <Link
              key={h.id}
              href={`https://www.youtube.com/watch?v=${h.youtubeVideoId}`}
              target="_blank"
              rel="noreferrer"
              className="block shrink-0"
            >
              <div className="w-[190px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                <div className="relative aspect-video w-full">
                  <Image
                    src={`https://i.ytimg.com/vi/${h.youtubeVideoId}/hqdefault.jpg`}
                    alt={h.label}
                    fill
                    sizes="190px"
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 px-2 py-2">
                  <div className="text-xs font-semibold text-gray-100 truncate">{h.label}</div>
                  {h.competitionId && (
                    <div className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                      {h.competitionId}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
