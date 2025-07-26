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
  
  // League filter states
  const [showPremierLeague, setShowPremierLeague] = useState(true);
  const [showChampionship, setShowChampionship] = useState(false);
  const [showLeagueOne, setShowLeagueOne] = useState(false); // English League One
  const [showSerieA, setShowSerieA] = useState(false);
  const [showSerieB, setShowSerieB] = useState(false);
  const [showLigue1, setShowLigue1] = useState(false); // French Ligue 1
  const [showLigue2, setShowLigue2] = useState(false);
  const [showLaLiga, setShowLaLiga] = useState(false);
  const [showSegunda, setShowSegunda] = useState(false);
  const [showBundesliga, setShowBundesliga] = useState(false);
  const [showBundesliga2, setShowBundesliga2] = useState(false);

  // UI visibility states
  const [showList, setShowList] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  
  const listRef = useRef<HTMLDivElement>(null);
  
  const { hotels, loading: hotelsLoading, error: hotelsError } = useHotelData();

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
      if (stadiumElement) {
        stadiumElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

  const handleHotelSelect = useCallback((hotelId: string) => {
    setSelectedHotel(hotelId);
    setSelectedStadium(null);
    if (listRef.current) {
      const hotelElement = listRef.current.querySelector(`[data-hotel="${hotelId}"]`);
      if (hotelElement) {
        hotelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

  const leagueFilters = [
    { label: 'プレミアリーグ', state: showPremierLeague, setter: setShowPremierLeague },
    { label: 'チャンピオンシップ', state: showChampionship, setter: setShowChampionship },
    { label: 'リーグ・アン', state: showLigue1, setter: setShowLigue1 }, // Corrected to Ligue 1
    { label: 'リーグ・ドゥ', state: showLigue2, setter: setShowLigue2 },
    { label: 'セリエA', state: showSerieA, setter: setShowSerieA },
    { label: 'セリエB', state: showSerieB, setter: setShowSerieB },
    { label: 'ラ・リーガ', state: showLaLiga, setter: setShowLaLiga },
    { label: 'セグンダ', state: showSegunda, setter: setShowSegunda },
    { label: 'ブンデスリーガ', state: showBundesliga, setter: setShowBundesliga },
    { label: 'ブンデスリーガ2部', state: showBundesliga2, setter: setShowBundesliga2 },
    { label: 'リーグ1', state: showLeagueOne, setter: setShowLeagueOne }, // English League One
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <header className="relative bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
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
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        <div className="flex-grow h-full relative">
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

        <div className={`w-full lg:w-96 flex-shrink-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out ${showList ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 absolute lg:relative right-0 top-0 h-full z-10`}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                {Object.entries(mapCategories).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key as MapCategory)}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${selectedCategory === key
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}>
                    {key === 'stadium' ? <MapPin className="w-4 h-4" /> : <Hotel className="w-4 h-4" />}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-grow overflow-y-auto">
              {selectedCategory === 'stadium' && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 mt-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer select-none"
                    onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">リーグ選択</h3>
                    {isFiltersVisible ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                  {isFiltersVisible && (
                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                      {leagueFilters.map(({ label, state, setter }) => (
                        <label key={label} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={state}
                            onChange={() => setter(!state)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div ref={listRef} className="divide-y divide-gray-200 dark:divide-gray-700">
                {selectedCategory === 'stadium' ? (
                  currentStadiums.length > 0 ? (
                    currentStadiums.map(stadium => (
                      <div
                        key={stadium.name}
                        data-stadium={stadium.name}
                        onClick={() => handleStadiumSelect(stadium.name)}
                        className={`p-4 cursor-pointer transition-colors ${selectedStadium === stadium.name ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{stadium.name}</h4>
                          <MapPin className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stadium.team}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">表示するスタジアムがありません。</div>
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
                        className={`p-4 cursor-pointer transition-colors ${selectedHotel === hotel.id ? 'bg-purple-100 dark:bg-purple-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{hotel.name}</h4>
                          <Hotel className="w-5 h-5 text-purple-500" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{hotel.city}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">表示するホテルがありません。</div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}