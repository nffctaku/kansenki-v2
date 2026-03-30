'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ManualNationalMatch } from '@/lib/national/manualNationalMatches';
import FeaturedNationalMatchHero from './FeaturedNationalMatchHero';

type Props = {
  matches: ManualNationalMatch[];
  intervalMs?: number;
};

export default function FeaturedNationalMatchHeroCarousel({ matches, intervalMs = 3000 }: Props) {
  const heroMatches = useMemo(() => matches.filter((m) => m.featured), [matches]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (heroMatches.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % heroMatches.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [heroMatches.length, intervalMs]);

  useEffect(() => {
    if (index >= heroMatches.length) setIndex(0);
  }, [heroMatches.length, index]);

  if (heroMatches.length === 0) return null;

  return (
    <div className="mb-5 -mx-3">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {heroMatches.map((m) => (
            <div key={m.id} className="w-full shrink-0">
              <FeaturedNationalMatchHero match={m} />
            </div>
          ))}
        </div>

        {heroMatches.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {heroMatches.map((m, i) => {
              const active = i === index;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={
                    `h-1.5 rounded-full transition-all ` +
                    (active ? 'w-6 bg-white/80' : 'w-2.5 bg-white/35 hover:bg-white/50')
                  }
                  aria-label={`注目カード ${i + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
