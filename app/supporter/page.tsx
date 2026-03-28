"use client";

import { useEffect, useMemo, useRef, useState } from 'react';

type Club = {
  id: string;
  name: string;
  nameEn: string;
  fans: number;
  color: string;
  textColor: string;
  xPct: number;
  yPct: number;
  foundedYear: number;
  country: string;
  homeTown: string;
  league: string;
  leagueTitles: number;
};

type BubbleState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

export default function SupporterPage() {
  const clubs: Club[] = useMemo(
    () => [
      {
        id: 'mu',
        name: 'マンチェスターU',
        nameEn: 'Manchester United',
        fans: 1023202,
        color: 'bg-red-700',
        textColor: 'text-white',
        xPct: 50,
        yPct: 45,
        foundedYear: 1878,
        country: 'イングランド',
        homeTown: 'マンチェスター',
        league: 'プレミアリーグ',
        leagueTitles: 20,
      },
      {
        id: 'mc',
        name: 'マンチェスターC',
        nameEn: 'Manchester City',
        fans: 892234,
        color: 'bg-sky-400',
        textColor: 'text-slate-900',
        xPct: 72,
        yPct: 30,
        foundedYear: 1880,
        country: 'イングランド',
        homeTown: 'マンチェスター',
        league: 'プレミアリーグ',
        leagueTitles: 10,
      },
      {
        id: 'liv',
        name: 'リバプール',
        nameEn: 'Liverpool',
        fans: 1021678,
        color: 'bg-red-800',
        textColor: 'text-white',
        xPct: 28,
        yPct: 30,
        foundedYear: 1892,
        country: 'イングランド',
        homeTown: 'リバプール',
        league: 'プレミアリーグ',
        leagueTitles: 19,
      },
      {
        id: 'ars',
        name: 'アーセナル',
        nameEn: 'Arsenal',
        fans: 983459,
        color: 'bg-red-600',
        textColor: 'text-white',
        xPct: 25,
        yPct: 62,
        foundedYear: 1886,
        country: 'イングランド',
        homeTown: 'ロンドン',
        league: 'プレミアリーグ',
        leagueTitles: 13,
      },
      {
        id: 'che',
        name: 'チェルシー',
        nameEn: 'Chelsea',
        fans: 652004,
        color: 'bg-blue-600',
        textColor: 'text-white',
        xPct: 72,
        yPct: 62,
        foundedYear: 1905,
        country: 'イングランド',
        homeTown: 'ロンドン',
        league: 'プレミアリーグ',
        leagueTitles: 6,
      },
      {
        id: 'tot',
        name: 'トッテナム',
        nameEn: 'Tottenham Hotspur',
        fans: 564009,
        color: 'bg-white',
        textColor: 'text-slate-900',
        xPct: 50,
        yPct: 75,
        foundedYear: 1882,
        country: 'イングランド',
        homeTown: 'ロンドン',
        league: 'プレミアリーグ',
        leagueTitles: 2,
      },
      {
        id: 'bha',
        name: 'ブライトン',
        nameEn: 'Brighton & Hove Albion',
        fans: 13210,
        color: 'bg-blue-500',
        textColor: 'text-white',
        xPct: 86,
        yPct: 46,
        foundedYear: 1901,
        country: 'イングランド',
        homeTown: 'ブライトン',
        league: 'プレミアリーグ',
        leagueTitles: 0,
      },
      {
        id: 'nfo',
        name: 'N.フォレスト',
        nameEn: 'Nottingham Forest',
        fans: 14,
        color: 'bg-red-500',
        textColor: 'text-white',
        xPct: 14,
        yPct: 46,
        foundedYear: 1865,
        country: 'イングランド',
        homeTown: 'ノッティンガム',
        league: 'プレミアリーグ',
        leagueTitles: 1,
      },
      {
        id: 'new',
        name: 'ニューカッスル',
        nameEn: 'Newcastle United',
        fans: 21889,
        color: 'bg-[repeating-linear-gradient(90deg,#111827_0px,#111827_12px,#ffffff_12px,#ffffff_24px)]',
        textColor: 'text-slate-900',
        xPct: 50,
        yPct: 18,
        foundedYear: 1892,
        country: 'イングランド',
        homeTown: 'ニューカッスル・アポン・タイン',
        league: 'プレミアリーグ',
        leagueTitles: 4,
      },
    ],
    []
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef<number>(0);

  const bubblesRef = useRef<Record<string, BubbleState>>({});
  const containerSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const dragRef = useRef<{
    id: string | null;
    pointerId: number | null;
    dx: number;
    dy: number;
    lastX: number;
    lastY: number;
    lastT: number;
  }>({ id: null, pointerId: null, dx: 0, dy: 0, lastX: 0, lastY: 0, lastT: 0 });

  const [, forceRender] = useState(0);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const suppressClickRef = useRef<{ id: string | null; until: number }>({ id: null, until: 0 });

  const minSize = 64;
  const maxSize = 140;
  const maxFans = Math.max(...clubs.map((c) => c.fans));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      containerSizeRef.current = { w: rect.width, h: rect.height };

      // Initialize (or re-initialize) bubble states based on container size
      const next: Record<string, BubbleState> = {};
      for (const club of clubs) {
        const size = Math.round(minSize + (club.fans / maxFans) * (maxSize - minSize));
        const r = size / 2;

        // Keep inside bounds even when resized
        const x = Math.min(Math.max((club.xPct / 100) * rect.width, r), rect.width - r);
        const y = Math.min(Math.max((club.yPct / 100) * rect.height, r), rect.height - r);

        const prev = bubblesRef.current[club.id];
        next[club.id] = prev
          ? { ...prev, x, y, r }
          : {
              x,
              y,
              vx: (Math.random() - 0.5) * 20,
              vy: (Math.random() - 0.5) * 20,
              r,
            };
      }
      bubblesRef.current = next;
      forceRender((v) => v + 1);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [clubs, maxFans]);

  useEffect(() => {
    const step = (t: number) => {
      const { w, h } = containerSizeRef.current;
      if (w <= 0 || h <= 0) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      const dtRaw = (t - (lastTRef.current || t)) / 1000;
      lastTRef.current = t;
      const dt = Math.min(0.033, Math.max(0.008, dtRaw));

      const states = bubblesRef.current;
      const ids = Object.keys(states);

      // Parameters: tuned for "floating on water" feel
      const damping = 0.985;
      const buoyancy = 8; // upward-ish random
      const jitter = 10;
      const bounce = 0.75;
      const separationK = 140; // collision push

      // Random gentle forces + integrate
      for (const id of ids) {
        const s = states[id];
        const isDragging = dragRef.current.id === id;
        if (isDragging) continue;

        const ax = (Math.random() - 0.5) * jitter;
        const ay = (Math.random() - 0.5) * jitter - buoyancy * 0.15;

        s.vx = (s.vx + ax * dt) * damping;
        s.vy = (s.vy + ay * dt) * damping;

        s.x += s.vx * dt;
        s.y += s.vy * dt;
      }

      // Bubble-bubble collisions (simple separation)
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const a = states[ids[i]];
          const b = states[ids[j]];

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
          const minDist = a.r + b.r;

          if (dist < minDist) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            const aDragging = dragRef.current.id === ids[i];
            const bDragging = dragRef.current.id === ids[j];

            const push = overlap * 0.5;
            if (!aDragging) {
              a.x -= nx * push;
              a.y -= ny * push;
              a.vx -= nx * separationK * dt * 0.15;
              a.vy -= ny * separationK * dt * 0.15;
            }
            if (!bDragging) {
              b.x += nx * push;
              b.y += ny * push;
              b.vx += nx * separationK * dt * 0.15;
              b.vy += ny * separationK * dt * 0.15;
            }
          }
        }
      }

      // Boundary constraints
      for (const id of ids) {
        const s = states[id];
        const isDragging = dragRef.current.id === id;

        if (s.x < s.r) {
          s.x = s.r;
          if (!isDragging) s.vx = Math.abs(s.vx) * bounce;
        }
        if (s.x > w - s.r) {
          s.x = w - s.r;
          if (!isDragging) s.vx = -Math.abs(s.vx) * bounce;
        }
        if (s.y < s.r) {
          s.y = s.r;
          if (!isDragging) s.vy = Math.abs(s.vy) * bounce;
        }
        if (s.y > h - s.r) {
          s.y = h - s.r;
          if (!isDragging) s.vy = -Math.abs(s.vy) * bounce;
        }
      }

      // Render at ~60fps; cheap since only 6 items
      forceRender((v) => v + 1);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent, id: string) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const s = bubblesRef.current[id];
    if (!s) return;

    dragRef.current = {
      id,
      pointerId: e.pointerId,
      dx: s.x - px,
      dy: s.y - py,
      lastX: px,
      lastY: py,
      lastT: performance.now(),
    };

    suppressClickRef.current = { id, until: 0 };

    s.vx = 0;
    s.vy = 0;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = containerRef.current;
    if (!el) return;

    const d = dragRef.current;
    if (!d.id || d.pointerId !== e.pointerId) return;

    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const s = bubblesRef.current[d.id];
    if (!s) return;

    if (Math.hypot(px - d.lastX, py - d.lastY) > 4) {
      suppressClickRef.current = { id: d.id, until: performance.now() + 350 };
    }

    s.x = px + d.dx;
    s.y = py + d.dy;

    const now = performance.now();
    const dt = Math.max(0.001, (now - d.lastT) / 1000);
    s.vx = (px - d.lastX) / dt;
    s.vy = (py - d.lastY) / dt;

    d.lastX = px;
    d.lastY = py;
    d.lastT = now;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (d.pointerId !== e.pointerId) return;
    dragRef.current = { id: null, pointerId: null, dx: 0, dy: 0, lastX: 0, lastY: 0, lastT: 0 };
  };

  const selectedClub = selectedClubId ? clubs.find((c) => c.id === selectedClubId) ?? null : null;

  return (
    <div className="px-3 py-4" onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">サポーター可視化</h1>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">日本の海外サッカーファン数（試作）</div>

      <div className="mt-4">
        <div ref={containerRef} className="relative w-full aspect-square overflow-hidden touch-none">
          {clubs.map((club) => {
            const s = bubblesRef.current[club.id];
            const size = Math.round(minSize + (club.fans / maxFans) * (maxSize - minSize));
            const r = size / 2;

            const left = s?.x ?? 0;
            const top = s?.y ?? 0;

            const isSelected = selectedClubId === club.id;

            return (
              <div
                key={club.id}
                onPointerDown={(e) => onPointerDown(e, club.id)}
                onClick={() => {
                  const sup = suppressClickRef.current;
                  if (sup.id === club.id && sup.until > performance.now()) return;
                  setSelectedClubId(club.id);
                }}
                className={`absolute rounded-full ${club.color} ${club.textColor} shadow-md border border-black/5 dark:border-white/10 select-none cursor-grab active:cursor-grabbing`}
                style={{
                  width: size,
                  height: size,
                  left,
                  top,
                  transform: `translate(${-r}px, ${-r}px) scale(${isSelected ? 1.15 : 1})`,
                  zIndex: isSelected ? 20 : 1,
                  transition: 'transform 180ms ease, box-shadow 180ms ease',
                }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-2">
                  <div className="text-xs sm:text-sm font-bold leading-tight">{club.name}</div>
                  <div className="mt-1 text-[10px] sm:text-xs opacity-80">{club.fans}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          数字は仮の値。丸同士は押し合い、境界で跳ね返ります（簡易物理）。ドラッグで動かせます。
        </div>
      </div>

      {selectedClub && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedClubId(null)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center p-3">
            <div
              className="w-full sm:max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedClub.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{selectedClub.nameEn}</div>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-xl px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setSelectedClubId(null)}
                >
                  閉じる
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">設立年</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{selectedClub.foundedYear}</div>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">国</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{selectedClub.country}</div>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">ホームタウン</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{selectedClub.homeTown}</div>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">所属リーグ</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{selectedClub.league}</div>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 col-span-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">リーグ優勝回数</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{selectedClub.leagueTitles}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
