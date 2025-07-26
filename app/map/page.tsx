'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { premierLeagueStadiums, championshipStadiums, leagueOneStadiums, serieAStadiums, serieBStadiums, ligue1Stadiums, ligue2Stadiums, laLigaStadiums, segundaStadiums, bundesligaStadiums, bundesliga2Stadiums, mapCategories, MapCategory } from '@/lib/stadiumData';
import { useHotelData } from '@/hooks/useHotelData';
import { MapPin, Navigation, Check, ChevronDown, ChevronUp, List, X, Hotel } from 'lucide-react';

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
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [showList, setShowList] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  
  // Fetch hotel data
  const { hotels, loading: hotelsLoading, error: hotelsError } = useHotelData();

  // Calculate current stadiums based on selected leagues
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
  }, [selectedCategory, showPremierLeague, showChampionship, showLeagueOne, showSerieA, showSerieB, showLigue1, showLigue2, showLaLiga, showSegunda]);

  // Filter hotels with coordinates
  const currentHotels = useMemo(() => {
    if (selectedCategory !== 'hotel') return [];
    return hotels.filter((hotel: any) => hotel.coords);
  }, [selectedCategory, hotels]);

  // Handle stadium selection and scroll synchronization
  const handleStadiumSelect = useCallback((stadiumName: string) => {
    setSelectedStadium(stadiumName);
    setSelectedHotel(null); // Clear hotel selection
    
    // Scroll to the selected stadium in the list
    if (listRef.current) {
      const stadiumElement = listRef.current.querySelector(`[data-stadium="${stadiumName}"]`);
      if (stadiumElement) {
        stadiumElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

  // Handle hotel selection and scroll synchronization
  const handleHotelSelect = useCallback((hotelId: string) => {
    setSelectedHotel(hotelId);
    setSelectedStadium(null); // Clear stadium selection
    
    // Scroll to the selected hotel in the list
    if (listRef.current) {
      const hotelElement = listRef.current.querySelector(`[data-hotel="${hotelId}"]`);
      if (hotelElement) {
        hotelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

  // Handle list item click to center map on stadium
  const handleListItemClick = useCallback((stadium: any) => {
    setSelectedStadium(stadium.name);
    // Map centering will be handled by the StadiumMap component
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Navigation className="w-6 h-6 text-blue-600" />
                  スタジアムマップ
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Selector */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3">
            <div className="flex gap-2 overflow-x-auto">
              {Object.entries(mapCategories).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as MapCategory)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* League Filter (only show for stadium category) */}
      {selectedCategory === 'stadium' && (
        <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-2 md:py-3">
              <div className="flex flex-wrap gap-2 md:gap-4">
  {/* Bundesliga 1部 */}
  <label className="flex items-center gap-1.5 md:gap-2 cursor-pointer touch-manipulation">
    <div className="relative">
      <input
        type="checkbox"
        checked={showBundesliga}
        onChange={(e) => setShowBundesliga(e.target.checked)}
        className="sr-only"
      />
      <div className={`w-4 h-4 md:w-5 md:h-5 rounded border-2 flex items-center justify-center transition-colors ${
        showBundesliga
          ? 'bg-yellow-400 border-yellow-400 text-white'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
      }`}>
        {showBundesliga && <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />}
      </div>
    </div>
    <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
      ブンデスリーガ ({bundesligaStadiums.length})
    </span>
  </label>
  {/* Bundesliga 2部 */}
  <label className="flex items-center gap-1.5 md:gap-2 cursor-pointer touch-manipulation">
    <div className="relative">
      <input
        type="checkbox"
        checked={showBundesliga2}
        onChange={(e) => setShowBundesliga2(e.target.checked)}
        className="sr-only"
      />
      <div className={`w-4 h-4 md:w-5 md:h-5 rounded border-2 flex items-center justify-center transition-colors ${
        showBundesliga2
          ? 'bg-lime-500 border-lime-500 text-white'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
      }`}>
        {showBundesliga2 && <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />}
      </div>
    </div>
    <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
    2. ブンデスリーガ ({bundesliga2Stadiums.length})
    </span>
  </label>
                <label className="flex items-center gap-1.5 md:gap-2 cursor-pointer touch-manipulation">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showPremierLeague}
                      onChange={(e) => setShowPremierLeague(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      showPremierLeague
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }`}>
                      {showPremierLeague && <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                    プレミアリーグ ({premierLeagueStadiums.length})
                  </span>
                </label>
                
                <label className="flex items-center gap-1.5 md:gap-2 cursor-pointer touch-manipulation">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showChampionship}
                      onChange={(e) => setShowChampionship(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      showChampionship
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }`}>
                      {showChampionship && <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                    チャンピオンシップ ({championshipStadiums.length})
                  </span>
                </label>
                
                {/* League One Checkbox */}
                <label className="flex items-center gap-1.5 md:gap-2 cursor-pointer touch-manipulation">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showLeagueOne}
                      onChange={(e) => setShowLeagueOne(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      showLeagueOne
                        ? 'bg-yellow-500 border-yellow-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }`}>
                      {showLeagueOne && <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                    リーグ・ワン ({leagueOneStadiums.length})
                  </span>
                </label>
                
                <label className="flex items-center gap-1.5 md:gap-2 cursor-pointer touch-manipulation">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showSerieA}
                      onChange={(e) => setShowSerieA(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      showSerieA
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }`}>
                      {showSerieA && <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                    セリエA ({serieAStadiums.length})
                  </span>
                </label>
                
                <label className="flex items-center gap-1.5 md:gap-2 cursor-pointer touch-manipulation">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showSerieB}
                      onChange={(e) => setShowSerieB(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      showSerieB
                        ? 'bg-orange-600 border-orange-600 text-white'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }`}>
                      {showSerieB && <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                    セリエB ({serieBStadiums.length})
                  </span>
                </label>
                
                <label className="flex items-center gap-1.5 md:gap-2 cursor-pointer touch-manipulation">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showLigue1}
                      onChange={(e) => setShowLigue1(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      showLigue1
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }`}>
                      {showLigue1 && <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                    リーグ・アン ({ligue1Stadiums.length})
                  </span>
                </label>
                
                <label className="flex items-center gap-1.5 md:gap-2 cursor-pointer touch-manipulation">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showLigue2}
                      onChange={(e) => setShowLigue2(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      showLigue2
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }`}>
                      {showLigue2 && <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                    リーグ・ドゥ ({ligue2Stadiums.length})
                  </span>
                </label>
                
                <label className="flex items-center gap-1.5 md:gap-2 cursor-pointer touch-manipulation">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showLaLiga}
                      onChange={(e) => setShowLaLiga(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      showLaLiga
                        ? 'bg-yellow-600 border-yellow-600 text-white'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }`}>
                      {showLaLiga && <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                    ラ・リーガ ({laLigaStadiums.length})
                  </span>
                </label>
                
                <label className="flex items-center gap-1.5 md:gap-2 cursor-pointer touch-manipulation">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showSegunda}
                      onChange={(e) => setShowSegunda(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      showSegunda
                        ? 'bg-amber-600 border-amber-600 text-white'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }`}>
                      {showSegunda && <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                    セグンダ ({segundaStadiums.length})
                  </span>
                </label>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center ml-auto">
                  表示中: {currentStadiums.length}スタジアム
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 relative">
        <div className="h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] relative">
           {/* 地図表示部分をGoogleStadiumMapに差し替え */}
      <GoogleStadiumMap
        stadiums={selectedCategory === 'stadium' ? currentStadiums : []}
        hotels={selectedCategory === 'hotel' ? currentHotels : []}
        selectedStadium={selectedStadium}
        selectedHotel={selectedHotel}
        onStadiumSelect={handleStadiumSelect}
        onHotelSelect={handleHotelSelect}
      />


          {/* Stadium List Toggle Button */}
          <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20">
            <button
              onClick={() => setShowList(!showList)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 md:p-3 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation"
              aria-label={showList ? 'リストを非表示' : 'リストを表示'}
            >
              {showList ? (
                <X className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <List className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* List Sidebar - Collapsible */}
          {showList && (
            <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 w-[calc(100vw-1rem)] sm:w-80 md:max-w-sm z-10">
              {/* Header */}
              <div className="p-3 md:p-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm md:text-base">
                    {selectedCategory === 'stadium' ? (
                      <>
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                        スタジアム ({currentStadiums.length})
                      </>
                    ) : (
                      <>
                        <Hotel className="w-3 h-3 md:w-4 md:h-4 text-purple-500" />
                        ホテル ({currentHotels.length})
                      </>
                    )}
                  </h4>
                  <button
                    onClick={() => setIsListExpanded(!isListExpanded)}
                    className="flex items-center gap-1 px-2 py-1 text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors touch-manipulation"
                  >
                    {isListExpanded ? (
                      <>
                        <span>折りたたむ</span>
                        <ChevronUp className="w-3 h-3 md:w-4 md:h-4" />
                      </>
                    ) : (
                      <>
                        <span>すべて表示</span>
                        <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* List Content */}
              <div 
                ref={listRef}
                className={`${isListExpanded ? 'max-h-[40vh] md:max-h-80' : 'max-h-32 md:max-h-40'} overflow-y-auto p-3 md:p-4 space-y-1.5 md:space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent`}
              >
                {/* Stadium List */}
                {selectedCategory === 'stadium' && currentStadiums.slice(0, isListExpanded ? currentStadiums.length : 3).map((stadium) => {
                  // Determine league colors
                  const isPremierLeague = premierLeagueStadiums.some(pl => pl.name === stadium.name);
                  const isChampionship = championshipStadiums.some(ch => ch.name === stadium.name);
                  const isSerieA = serieAStadiums.some(sa => sa.name === stadium.name);
                  const isSerieB = serieBStadiums.some(sb => sb.name === stadium.name);
                  const isLigue1 = ligue1Stadiums.some(l1 => l1.name === stadium.name);
                  const isLigue2 = ligue2Stadiums.some(l2 => l2.name === stadium.name);
                  const isLaLiga = laLigaStadiums.some(ll => ll.name === stadium.name);
                  const isSegunda = segundaStadiums.some(sg => sg.name === stadium.name);
                  const isBundesliga = bundesligaStadiums.some(b1 => b1.name === stadium.name);
                  const isBundesliga2 = bundesliga2Stadiums.some(b2 => b2.name === stadium.name);
                  
                  let leagueColor = 'bg-gray-500';
                  let leagueName = '不明';
                  
                  if (isPremierLeague) { leagueColor = 'bg-blue-500'; leagueName = 'プレミア'; }
                  else if (isChampionship) { leagueColor = 'bg-green-500'; leagueName = 'チャンピオン'; }
                  else if (isBundesliga) { leagueColor = 'bg-yellow-400'; leagueName = 'ブンデスリーガ'; }
                  else if (isBundesliga2) { leagueColor = 'bg-lime-500'; leagueName = '2. ブンデスリーガ'; }
                  else if (isSerieA) { leagueColor = 'bg-red-500'; leagueName = 'セリエA'; }
                  else if (isSerieB) { leagueColor = 'bg-orange-500'; leagueName = 'セリエB'; }
                  else if (isLigue1) { leagueColor = 'bg-purple-500'; leagueName = 'リーグ・アン'; }
                  else if (isLigue2) { leagueColor = 'bg-indigo-500'; leagueName = 'リーグ・ドゥ'; }
                  else if (isLaLiga) { leagueColor = 'bg-yellow-500'; leagueName = 'ラ・リーガ'; }
                  else if (isSegunda) { leagueColor = 'bg-amber-500'; leagueName = 'セグンダ'; }
                  
                  return (
                    <div
                      key={stadium.name}
                      data-stadium={stadium.name}
                      className={`p-2 md:p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedStadium === stadium.name
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => handleListItemClick(stadium)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0 ${leagueColor.replace('bg-', 'bg-')}`}></div>
                            <span className={`text-xs px-1 py-0.5 md:px-1.5 rounded text-white font-medium flex-shrink-0 ${leagueColor}`}>
                              {leagueName}
                            </span>
                          </div>
                          <h5 className="font-medium text-gray-900 dark:text-white text-xs md:text-sm truncate">
                            {stadium.name}
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {stadium.team}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                            {stadium.capacity?.toLocaleString()}人
                          </p>
                        </div>
                        <MapPin className={`w-3 h-3 md:w-4 md:h-4 flex-shrink-0 ml-2 ${leagueColor.replace('bg-', 'text-')}`} />
                      </div>
                      {selectedStadium === stadium.name && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 space-y-1">
                          {stadium.opened && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              開場: {stadium.opened}年
                            </p>
                          )}
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            リーグ: {leagueName}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Hotel List */}
                {selectedCategory === 'hotel' && (
                  hotelsLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">ホテル情報を読み込み中...</p>
                    </div>
                  ) : hotelsError ? (
                    <div className="text-center py-4">
                      <p className="text-xs text-red-500">{hotelsError}</p>
                    </div>
                  ) : currentHotels.length === 0 ? (
                    <div className="text-center py-4">
                      <Hotel className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">表示できるホテル情報がありません</p>
                      <p className="text-xs text-gray-400 mt-1">座標情報付きの投稿をお待ちしています</p>
                    </div>
                  ) : (
                    currentHotels.slice(0, isListExpanded ? currentHotels.length : 3).map((hotel: any) => (
                      <div
                        key={hotel.id}
                        data-hotel={hotel.id}
                        className={`p-2 md:p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedHotel === hotel.id
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => {
                          setSelectedHotel(hotel.id);
                          // Center map on hotel if coordinates exist
                          if (hotel.coords) {
                            // This would need to be implemented in the map component
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0 bg-purple-500"></div>
                              <span className="text-xs px-1 py-0.5 md:px-1.5 rounded text-white font-medium flex-shrink-0 bg-purple-500">
                                ホテル
                              </span>
                            </div>
                            <h5 className="font-medium text-gray-900 dark:text-white text-xs md:text-sm truncate">
                              {hotel.name}
                            </h5>
                            {hotel.city && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {hotel.city}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-0.5">
                              {hotel.rating && (
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                  ★ {hotel.rating}/5
                                </p>
                              )}
                              {hotel.price && (
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                  {hotel.price.toLocaleString()}円
                                </p>
                              )}
                            </div>
                          </div>
                          <Hotel className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0 ml-2 text-purple-500" />
                        </div>
                        {selectedHotel === hotel.id && (
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 space-y-1">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              投稿: {hotel.postTitle}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              投稿者: {hotel.author}
                            </p>
                            {hotel.nights && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {hotel.nights}泊
                              </p>
                            )}
                            {hotel.bookingSite && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                予約: {hotel.bookingSite}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )
                )}
                
                {/* Show remaining count when collapsed */}
                {!isListExpanded && selectedCategory === 'stadium' && currentStadiums.length > 3 && (
                  <div className="text-center py-2">
                    <button
                      onClick={() => setIsListExpanded(true)}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      他 {currentStadiums.length - 3} スタジアムを表示
                    </button>
                  </div>
                )}
                
                {!isListExpanded && selectedCategory === 'hotel' && currentHotels.length > 3 && (
                  <div className="text-center py-2">
                    <button
                      onClick={() => setIsListExpanded(true)}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      他 {currentHotels.length - 3} ホテルを表示
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
