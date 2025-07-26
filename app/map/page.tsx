'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { 
  premierLeagueStadiums, 
  championshipStadiums, 
  leagueOneStadiums, 
  serieAStadiums, 
  serieBStadiums, 
  ligue1Stadiums, 
  ligue2Stadiums, 
  laLigaStadiums, 
  segundaStadiums, 
  bundesligaStadiums, 
  bundesliga2Stadiums, 
  mapCategories, 
  MapCategory 
} from '@/lib/stadiumData';
import { useHotelData } from '@/hooks/useHotelData';
import { MapPin, Navigation, ChevronDown, ChevronUp, List, X, Hotel } from 'lucide-react';

// Dynamically import the map component to avoid SSR issues
const GoogleStadiumMap = dynamic(
  () => import('@/components/GoogleStadiumMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600 dark:text-gray-400">地図を読み込み中...</p>
        </div>
      </div>
    )
  }
);

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<MapCategory>('stadium');
  const [selectedStadium, setSelectedStadium] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  
  const [showPremierLeague, setShowPremierLeague] = useState(true);
  const [showChampionship, setShowChampionship] = useState(false);
  const [showLeagueOne, setShowLeagueOne] = useState(false);
  const [showSerieA, setShowSerieA] = useState(false);
  const [showSerieB, setShowSerieB] = useState(false);
  const [showLigue1, setShowLigue1] = useState(false);
  const [showLigue2, setShowLigue2] = useState(false);
  const [showLaLiga, setShowLaLiga] = useState(false);
  const [showSegunda, setShowSegunda] = useState(false);
  const [showBundesliga, setShowBundesliga] = useState(false);
  const [showBundesliga2, setShowBundesliga2] = useState(false);

  const [showList, setShowList] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const { hotels, loading: hotelsLoading, error: hotelsError } = useHotelData();

  const leagueFilters = [
    { label: 'プレミア', state: showPremierLeague, setter: setShowPremierLeague },
    { label: 'チャンピオンシップ', state: showChampionship, setter: setShowChampionship },
    { label: 'リーグ1', state: showLeagueOne, setter: setShowLeagueOne },
    { label: 'セリエA', state: showSerieA, setter: setShowSerieA },
    { label: 'セリエB', state: showSerieB, setter: setShowSerieB },
    { label: 'リーグ・アン', state: showLigue1, setter: setShowLigue1 },
    { label: 'リーグ・ドゥ', state: showLigue2, setter: setShowLigue2 },
    { label: 'ラ・リーガ', state: showLaLiga, setter: setShowLaLiga },
    { label: 'セグンダ', state: showSegunda, setter: setShowSegunda },
    { label: 'ブンデス', state: showBundesliga, setter: setShowBundesliga },
    { label: 'ブンデス2部', state: showBundesliga2, setter: setShowBundesliga2 },
  ];

  const currentStadiums = useMemo(() => {
    if (selectedCategory !== 'stadium') return [];
    const stadiums = [];
    if (showPremierLeague) stadiums.push(...premierLeagueStadiums);
    if (showChampionship) stadiums.push(...championshipStadiums);
    if (showLeagueOne) stadiums.push(...leagueOneStadiums);
    if (showSerieA) stadiums.push(...serieAStadiums);
    if (showSerieB) stadiums.push(...serieBStadiums);
    if (showLigue1) stadiums.push(...ligue1Stadiums);
    if (showLigue2) stadiums.push(...ligue2Stadiums);
    if (showLaLiga) stadiums.push(...laLigaStadiums);
    if (showSegunda) stadiums.push(...segundaStadiums);
    if (showBundesliga) stadiums.push(...bundesligaStadiums);
    if (showBundesliga2) stadiums.push(...bundesliga2Stadiums);
    return stadiums;
  }, [selectedCategory, showPremierLeague, showChampionship, showLeagueOne, showSerieA, showSerieB, showLigue1, showLigue2, showLaLiga, showSegunda, showBundesliga, showBundesliga2]);

  const currentHotels = useMemo(() => {
    if (selectedCategory !== 'hotel') return [];
    return hotels.filter((hotel: any) => hotel.coords);
  }, [selectedCategory, hotels]);

  const handleStadiumSelect = useCallback((stadiumName: string) => {
    setSelectedStadium(stadiumName);
    setSelectedHotel(null);
    if (listRef.current) {
      const stadiumElement = listRef.current.querySelector(`[data-stadium="${stadiumName}"]`);
      if (stadiumElement) stadiumElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleHotelSelect = useCallback((hotelId: string) => {
    setSelectedHotel(hotelId);
    setSelectedStadium(null);
    if (listRef.current) {
      const hotelElement = listRef.current.querySelector(`[data-hotel="${hotelId}"]`);
      if (hotelElement) hotelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Navigation className="w-6 h-6 text-blue-600" />
              スタジアムマップ
            </h1>
            <button
              onClick={() => setShowList(!showList)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
            >
              {showList ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {Object.entries(mapCategories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as MapCategory)}
                className={`py-1 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${selectedCategory === key ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                {key === 'stadium' ? <MapPin className="w-4 h-4" /> : <Hotel className="w-4 h-4" />}
                {label}
              </button>
            ))}
          </div>
          {selectedCategory === 'stadium' && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">リーグ選択</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {leagueFilters.map(({ label, state, setter }) => (
                  <label key={label} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state}
                      onChange={() => setter(!state)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shadow-sm"
                    />
                    <span className="text-xs text-gray-700 dark:text-gray-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        <div className="flex-grow h-full">
          <GoogleStadiumMap
            stadiums={currentStadiums}
            hotels={currentHotels}
            selectedCategory={selectedCategory}
            selectedStadium={selectedStadium}
            onStadiumSelect={handleStadiumSelect}
            selectedHotel={selectedHotel}
            onHotelSelect={handleHotelSelect}
          />
        </div>

        <div ref={listRef} className={`w-full lg:w-80 flex-shrink-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto transition-transform duration-300 ease-in-out ${showList ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 absolute lg:static right-0 top-0 h-full`}>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {selectedCategory === 'stadium' ? (
              currentStadiums.length > 0 ? (
                currentStadiums.map(stadium => (
                  <div
                    key={stadium.name}
                    data-stadium={stadium.name}
                    onClick={() => handleStadiumSelect(stadium.name)}
                    className={`p-3 cursor-pointer transition-colors ${selectedStadium === stadium.name ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{stadium.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{stadium.team}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">表示するスタジアムがありません。</div>
              )
            ) : (
              hotelsLoading ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">ホテル情報を読み込み中...</div>
              ) : hotelsError ? (
                <div className="p-4 text-center text-red-500 dark:text-red-400">ホテルの読み込みに失敗しました。</div>
              ) : currentHotels.length > 0 ? (
                currentHotels.map((hotel: any) => (
                  <div 
                    key={hotel.id}
                    data-hotel={hotel.id}
                    onClick={() => handleHotelSelect(hotel.id)}
                    className={`p-3 cursor-pointer transition-colors ${selectedHotel === hotel.id ? 'bg-purple-100 dark:bg-purple-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{hotel.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{hotel.city}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">表示するホテルがありません。</div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}