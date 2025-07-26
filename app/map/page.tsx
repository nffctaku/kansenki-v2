'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo, useRef, useCallback } from 'react';
import nextDynamic from 'next/dynamic';
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
const GoogleStadiumMap = nextDynamic(
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
  const [isListOpen, setIsListOpen] = useState(true);
  const [isLeagueListOpen, setIsLeagueListOpen] = useState(true);
  const mapRef = useRef<any>(null);

  const leagueStates = {
    'プレミアリーグ': { show: showPremierLeague, set: setShowPremierLeague },
    'チャンピオンシップ': { show: showChampionship, set: setShowChampionship },
    'リーグ・ワン': { show: showLeagueOne, set: setShowLeagueOne },
    'セリエA': { show: showSerieA, set: setShowSerieA },
    'セリエB': { show: showSerieB, set: setShowSerieB },
    'リーグ・アン': { show: showLigue1, set: setShowLigue1 },
    'リーグ・ドゥ': { show: showLigue2, set: setShowLigue2 },
    'ラ・リーガ': { show: showLaLiga, set: setShowLaLiga },
    'セグンダ': { show: showSegunda, set: setShowSegunda },
    'ブンデスリーガ': { show: showBundesliga, set: setShowBundesliga },
    'ブンデスリーガ2部': { show: showBundesliga2, set: setShowBundesliga2 },
  };

  const { hotels, loading: hotelsLoading, error: hotelsError } = useHotelData();

  const stadiums = useMemo(() => {
    let activeStadiums = [];
    if (showPremierLeague) activeStadiums.push(...premierLeagueStadiums);
    if (showChampionship) activeStadiums.push(...championshipStadiums);
    if (showLeagueOne) activeStadiums.push(...leagueOneStadiums);
    if (showSerieA) activeStadiums.push(...serieAStadiums);
    if (showSerieB) activeStadiums.push(...serieBStadiums);
    if (showLigue1) activeStadiums.push(...ligue1Stadiums);
    if (showLigue2) activeStadiums.push(...ligue2Stadiums);
    if (showLaLiga) activeStadiums.push(...laLigaStadiums);
    if (showSegunda) activeStadiums.push(...segundaStadiums);
    if (showBundesliga) activeStadiums.push(...bundesligaStadiums);
    if (showBundesliga2) activeStadiums.push(...bundesliga2Stadiums);
    return activeStadiums;
  }, [
    showPremierLeague, showChampionship, showLeagueOne,
    showSerieA, showSerieB, showLigue1, showLigue2,
    showLaLiga, showSegunda, showBundesliga, showBundesliga2
  ]);

  const handleStadiumSelect = useCallback((stadiumName: string) => {
    setSelectedStadium(stadiumName);
    setSelectedHotel(null);
    const stadium = stadiums.find(s => s.name === stadiumName);
    if (stadium && mapRef.current) {
      mapRef.current.panTo(stadium.coords);
    }
  }, [stadiums]);

  const handleHotelSelect = useCallback((hotelName: string) => {
    setSelectedHotel(hotelName);
    setSelectedStadium(null);
    const hotel = hotels.find(h => h.name === hotelName);
    if (hotel && mapRef.current) {
      mapRef.current.panTo(hotel.coords);
    }
  }, [hotels]);

  const toggleAllLeagues = (show: boolean) => {
    setShowPremierLeague(show);
    setShowChampionship(show);
    setShowLeagueOne(show);
    setShowSerieA(show);
    setShowSerieB(show);
    setShowLigue1(show);
    setShowLigue2(show);
    setShowLaLiga(show);
    setShowSegunda(show);
    setShowBundesliga(show);
    setShowBundesliga2(show);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div 
        className={`
          absolute md:relative z-20 h-full bg-white dark:bg-gray-800 shadow-lg 
          transition-transform duration-300 ease-in-out
          ${isListOpen ? 'translate-x-0' : '-translate-x-full'}
          w-full md:w-80 lg:w-96 flex flex-col
        `}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">スタジアム一覧</h1>
          <button onClick={() => setIsListOpen(false)} className="md:hidden p-2">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setSelectedCategory('stadium')}
              className={`
                w-1/2 px-4 py-2 text-sm font-medium rounded-l-md
                ${selectedCategory === 'stadium' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500'}
                focus:z-10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-200
              `}
            >
              <Navigation className="w-5 h-5 inline-block mr-2" />
              スタジアム
            </button>
            <button
              onClick={() => setSelectedCategory('hotel')}
              className={`
                w-1/2 px-4 py-2 text-sm font-medium rounded-r-md
                ${selectedCategory === 'hotel' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500'}
                focus:z-10 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors duration-200
              `}
            >
              <Hotel className="w-5 h-5 inline-block mr-2" />
              ホテル
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          {selectedCategory === 'stadium' ? (
            <div>
              <div className="p-4">
                <button 
                  onClick={() => setIsLeagueListOpen(!isLeagueListOpen)}
                  className="w-full flex justify-between items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="font-semibold">リーグ選択</span>
                  {isLeagueListOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {isLeagueListOpen && (
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div className="flex justify-around mb-2">
                      <button onClick={() => toggleAllLeagues(true)} className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">全て選択</button>
                      <button onClick={() => toggleAllLeagues(false)} className="text-xs px-2 py-1 rounded bg-gray-500 text-white hover:bg-gray-600">全て解除</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(leagueStates).map(([name, state]) => (
                        <label key={name} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={state.show}
                            onChange={() => state.set(!state.show)}
                            className="form-checkbox h-4 w-4 text-blue-600 rounded"
                          />
                          <span>{name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {stadiums.map((stadium) => (
                  <li
                    key={stadium.name}
                    onClick={() => handleStadiumSelect(stadium.name)}
                    className={`p-4 cursor-pointer transition-colors duration-200 ${
                      selectedStadium === stadium.name ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <p className="font-semibold text-gray-800 dark:text-white">{stadium.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stadium.team}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              {hotelsLoading && <p className="p-4 text-center">ホテル情報を読み込み中...</p>}
              {hotelsError && <p className="p-4 text-center text-red-500">エラー: {hotelsError}</p>}
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {hotels.map((hotel) => (
                  <li
                    key={hotel.name}
                    onClick={() => handleHotelSelect(hotel.name)}
                    className={`p-4 cursor-pointer transition-colors duration-200 ${
                      selectedHotel === hotel.name ? 'bg-purple-100 dark:bg-purple-900' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <p className="font-semibold text-gray-800 dark:text-white">{hotel.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{hotel.city}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 h-full relative">
        <button 
          onClick={() => setIsListOpen(true)} 
          className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 p-2 rounded-md shadow-md md:hidden"
        >
          <List className="w-6 h-6" />
        </button>
        <GoogleStadiumMap
          stadiums={stadiums}
          hotels={hotels}
          selectedStadium={selectedStadium}
          selectedHotel={selectedHotel}
          onStadiumSelect={handleStadiumSelect}
          onHotelSelect={handleHotelSelect}
          selectedCategory={selectedCategory}
          mapRef={mapRef}
        />
      </main>
    </div>
  );
}