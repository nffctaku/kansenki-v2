'use client';

import Image from 'next/image';
import type { ManualNationalMatch } from '@/lib/national/manualNationalMatches';

type Props = {
  matches: ManualNationalMatch[];
};

export default function ManualNationalMatchesRow({ matches }: Props) {
  return (
    <div className="mb-6">
      <div className="mb-2 text-sm font-bold text-gray-100">対戦カード</div>
      <div className="flex items-stretch gap-3 overflow-x-auto max-w-full pb-1">
        {matches.map((m) => (
          <div key={m.id} className="w-[320px] shrink-0 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white/70">{m.competitionLabel}</div>
                <div className="mt-1 text-sm font-bold text-gray-100">{m.kickoffLabel}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                  {m.broadcasterLabel}
                </div>
                <div className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                  {m.venue}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/90">
                  {m.homeFlagSrc ? (
                    <Image src={m.homeFlagSrc} alt={m.homeCountryNameJa} fill sizes="40px" className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] font-semibold text-slate-800">
                      {(m.homeCountryCode ?? '').toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-sm font-semibold text-gray-100 truncate">{m.homeCountryNameJa}</div>
              </div>

              <div className="text-xs font-semibold text-white/60">vs</div>

              <div className="flex items-center gap-2 min-w-0">
                <div className="text-sm font-semibold text-gray-100 truncate">{m.awayCountryNameJa}</div>
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/90">
                  {m.awayFlagSrc ? (
                    <Image src={m.awayFlagSrc} alt={m.awayCountryNameJa} fill sizes="40px" className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] font-semibold text-slate-800">
                      {(m.awayCountryCode ?? '').toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
