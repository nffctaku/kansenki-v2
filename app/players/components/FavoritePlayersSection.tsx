'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Player = { id: string; name: string };

type VideoItem = { youtubeVideoId: string; label: string; description?: string };

const STORAGE_KEY = 'favoritePlayers.v1';

function loadPlayers(): Player[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((p) => {
        if (!p || typeof p !== 'object') return null;
        const name = (p as any).name;
        const id = (p as any).id;
        if (typeof name !== 'string' || !name.trim()) return null;
        return { id: typeof id === 'string' ? id : name, name: name.trim() } as Player;
      })
      .filter(Boolean) as Player[];
  } catch {
    return [];
  }
}

function savePlayers(players: Player[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}

async function fetchPlayerVideos(playerName: string) {
  const res = await fetch(`/api/player-videos?q=${encodeURIComponent(playerName)}&limit=5&fetchMax=30`);
  if (!res.ok) throw new Error('failed');
  const json = await res.json();
  const items = (json?.items ?? []) as Array<{ youtubeVideoId?: string; label?: string; description?: string }>;
  return items
    .map((it) => {
      if (!it.youtubeVideoId || !it.label) return null;
      return { youtubeVideoId: it.youtubeVideoId, label: it.label, description: it.description };
    })
    .filter(Boolean) as VideoItem[];
}

function PlayerVideoCard({ playerName }: { playerName: string }) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const v = await fetchPlayerVideos(playerName);
        if (!cancelled) setVideos(v);
      } catch {
        if (!cancelled) setVideos([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [playerName]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-gray-100">{playerName} 関連動画</div>
            <div className="text-xs text-gray-300">YouTube</div>
          </div>
        </div>

        <div className="mt-3">
          {loading ? (
            <div className="text-xs text-gray-300">読み込み中...</div>
          ) : videos.length === 0 ? (
            <div className="text-xs text-gray-300">動画が見つかりませんでした</div>
          ) : (
            <div className="space-y-3">
              {(() => {
                const [first, ...rest] = videos;
                return (
                  <>
                    <Link
                      href={`https://www.youtube.com/watch?v=${first.youtubeVideoId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition-colors"
                    >
                      <div className="relative aspect-video w-full">
                        <Image
                          src={`https://i.ytimg.com/vi/${first.youtubeVideoId}/hqdefault.jpg`}
                          alt={first.label}
                          fill
                          sizes="(max-width: 768px) 100vw, 640px"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <div className="text-sm text-gray-100 font-semibold line-clamp-2">{first.label}</div>
                        {first.description ? (
                          <div className="mt-1 text-xs text-gray-300 line-clamp-2">{first.description}</div>
                        ) : null}
                      </div>
                    </Link>

                    {rest.length > 0 ? (
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={12}
                        slidesPerView={'auto'}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 4500, disableOnInteraction: false }}
                        loop={rest.length > 1}
                        className="pb-8"
                      >
                        {rest.slice(0, 4).map((v) => (
                          <SwiperSlide key={v.youtubeVideoId} style={{ width: '240px' }}>
                            <Link
                              href={`https://www.youtube.com/watch?v=${v.youtubeVideoId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="block rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition-colors"
                            >
                              <div className="relative aspect-video w-full">
                                <Image
                                  src={`https://i.ytimg.com/vi/${v.youtubeVideoId}/hqdefault.jpg`}
                                  alt={v.label}
                                  fill
                                  sizes="240px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="p-3">
                                <div className="text-xs text-gray-100 font-semibold line-clamp-2">{v.label}</div>
                              </div>
                            </Link>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : null}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FavoritePlayersSection() {
  const initialPlayers = useMemo(() => [{ id: 'mitoma', name: '三笘薫' }], []);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const loaded = loadPlayers();
    if (loaded.length > 0) setPlayers(loaded);
  }, []);

  useEffect(() => {
    savePlayers(players);
  }, [players]);

  const addPlayer = () => {
    const name = newName.trim();
    if (!name) return;
    const id = name;
    if (players.some((p) => p.id === id)) return;
    setPlayers([{ id, name }, ...players]);
    setNewName('');
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  return (
    <div className="mb-4">
      <div className="rounded-2xl border border-white/10 bg-white/10 overflow-hidden mb-4">
        <div className="p-4">
          <div className="text-sm text-gray-100 font-semibold">好きな選手</div>
          <div className="mt-3 flex items-center gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="例：三笘薫"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none"
            />
            <button
              type="button"
              onClick={addPlayer}
              className="rounded-xl px-3 py-2 text-sm bg-white/10 text-gray-100 border border-white/10 hover:bg-white/15 transition-colors shrink-0"
            >
              追加
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {players.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => removePlayer(p.id)}
                className="rounded-full px-3 py-1 text-xs bg-white/10 text-gray-100 border border-white/10 hover:bg-white/15 transition-colors"
              >
                {p.name} ×
              </button>
            ))}
          </div>

          <div className="mt-2 text-xs text-gray-300">登録した選手をタップすると削除できます</div>
        </div>
      </div>

      {players.map((p) => (
        <PlayerVideoCard key={p.id} playerName={p.name} />
      ))}
    </div>
  );
}
