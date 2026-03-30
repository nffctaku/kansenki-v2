'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Megaphone, Tv } from 'lucide-react';
import type { ManualNationalMatch } from '@/lib/national/manualNationalMatches';

type Props = {
  match: ManualNationalMatch;
};

export default function FeaturedNationalMatchHero({ match }: Props) {
  return (
    <div className="relative overflow-hidden bg-slate-950/60 aspect-[3/4] min-h-[420px]">
        {match.heroImageSrc && (
          <div className="absolute inset-0">
            <Image
              src={match.heroImageSrc}
              alt={match.heroTitle ?? 'featured match'}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-slate-950/60 to-slate-950" />

        <div className="relative px-4 py-5 h-full flex flex-col justify-end">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <div className="text-xs font-semibold text-white/70">{match.kickoffLabel}</div>
            <div className="inline-flex rounded-full border border-amber-200/30 bg-amber-300/10 px-2 py-0.5 text-[10px] font-semibold text-amber-100">
              注目
            </div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
              {match.heroKickerLabel ?? match.competitionLabel}
            </div>
            <div className="max-w-[200px] truncate rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
              {match.venue}
            </div>
          </div>

          <div className="mt-2 text-xl font-extrabold tracking-tight text-gray-100">
            {match.heroTitle ?? `${match.homeCountryNameJa} vs ${match.awayCountryNameJa}`}
          </div>

          {(match.heroDescription || match.comment) && (
            <div className="mt-2 text-xs font-semibold text-white/80 whitespace-pre-line">
              {match.heroDescription ?? match.comment}
            </div>
          )}

          <div className="mt-4">
            {(() => {
              const href = match.detailUrl ?? match.watchUrl ?? match.predictUrl;
              if (!href) return null;

              const label = match.ctaLabel ?? '詳細を見る';
              const isExternal = href.startsWith('http');

              return (
                <Link
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noreferrer' : undefined}
                  className="block w-full rounded-xl bg-white px-4 py-3 text-center text-sm font-extrabold text-slate-900 hover:bg-white/90 transition-colors"
                >
                  {label}
                </Link>
              );
            })()}
          </div>

          {(match.watchUrl || match.predictUrl) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {match.watchUrl ? (
                <Link
                  href={match.watchUrl}
                  target={match.watchUrl.startsWith('http') ? '_blank' : undefined}
                  rel={match.watchUrl.startsWith('http') ? 'noreferrer' : undefined}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-300/80 px-4 py-2 text-xs font-bold text-slate-900 hover:bg-emerald-300 transition-colors"
                >
                  <Tv className="h-4 w-4" />
                  U-NEXT
                </Link>
              ) : null}

              {match.predictUrl ? (
                <Link
                  href={match.predictUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-gray-100 border border-white/10 hover:bg-white/15 transition-colors"
                >
                  <Megaphone className="h-4 w-4" />
                  みんなでスコア予想
                </Link>
              ) : null}
            </div>
          )}
        </div>
    </div>
  );
}
