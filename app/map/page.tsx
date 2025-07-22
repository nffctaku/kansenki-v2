'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { premierLeagueStadiums, championshipStadiums, mapCategories, MapCategory } from '@/lib/stadiumData';
import { MapPin, Navigation, Check, ChevronDown, ChevronUp, List, X } from 'lucide-react';

// Dynamically import the map component to avoid SSR issues
const StadiumMap = dynamic(() => import('@/components/StadiumMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="text-center">
        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-600 dark:text-gray-400">地図を読み込み中...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<MapCategory>('stadium');
  const [selectedStadium, setSelectedStadium] = useState<string | null>(null);
  const [showPremierLeague, setShowPremierLeague] = useState(true);
  const [showChampionship, setShowChampionship] = useState(false);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [showList, setShowList] = useState(true);

  // Calculate current stadiums based on selected leagues
  const currentStadiums = useMemo(() => {
    if (selectedCategory !== 'stadium') return [];
    
    const stadiums = [];
    if (showPremierLeague) stadiums.push(...premierLeagueStadiums);
    if (showChampionship) stadiums.push(...championshipStadiums);
    return stadiums;
  }, [selectedCategory, showPremierLeague, showChampionship]);

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
                  プレミアリーグスタジアムの位置を確認
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
          {/* Map Component */}
          <StadiumMap
            stadiums={currentStadiums}
            selectedStadium={selectedStadium}
            onStadiumSelect={(stadiumName) => 
              setSelectedStadium(stadiumName === selectedStadium ? null : stadiumName)
            }
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

          {/* Stadium List Sidebar - Collapsible */}
          {showList && (
            <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 w-[calc(100vw-1rem)] sm:w-80 md:max-w-sm z-10">
              {/* Header */}
              <div className="p-3 md:p-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm md:text-base">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                    スタジアム ({currentStadiums.length})
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

              {/* Stadium List */}
              <div className={`${isListExpanded ? 'max-h-[40vh] md:max-h-80' : 'max-h-32 md:max-h-40'} overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent`}>
                <div className="p-3 md:p-4 space-y-1.5 md:space-y-2">
                  {currentStadiums.slice(0, isListExpanded ? currentStadiums.length : 3).map((stadium, index) => {
                    const isPlStadium = premierLeagueStadiums.some(pl => pl.name === stadium.name);
                    return (
                      <div
                        key={index}
                        className={`p-2 md:p-3 rounded-lg border cursor-pointer transition-colors touch-manipulation ${
                          selectedStadium === stadium.name
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 active:bg-gray-50 dark:active:bg-gray-700'
                        }`}
                        onClick={() => setSelectedStadium(stadium.name === selectedStadium ? null : stadium.name)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0 ${
                                isPlStadium ? 'bg-blue-500' : 'bg-green-500'
                              }`}></div>
                              <span className={`text-xs px-1 py-0.5 md:px-1.5 rounded text-white font-medium flex-shrink-0 ${
                                isPlStadium ? 'bg-blue-500' : 'bg-green-500'
                              }`}>
                                {isPlStadium ? 'PL' : 'CH'}
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
                          <MapPin className={`w-3 h-3 md:w-4 md:h-4 flex-shrink-0 ml-2 ${
                            isPlStadium ? 'text-blue-500' : 'text-green-500'
                          }`} />
                        </div>
                        {selectedStadium === stadium.name && (
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 space-y-1">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              座標: {stadium.coords.lat.toFixed(4)}, {stadium.coords.lng.toFixed(4)}
                            </p>
                            {stadium.opened && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                開場: {stadium.opened}年
                              </p>
                            )}
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              リーグ: {isPlStadium ? 'プレミアリーグ' : 'チャンピオンシップ'}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Show remaining count when collapsed */}
                  {!isListExpanded && currentStadiums.length > 3 && (
                    <div className="text-center py-2">
                      <button
                        onClick={() => setIsListExpanded(true)}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      >
                        他 {currentStadiums.length - 3} スタジアムを表示
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            💡 地図機能を有効にするには、以下のコマンドを実行してください: 
            <code className="bg-yellow-100 dark:bg-yellow-800 px-2 py-1 rounded text-xs ml-2">
              npm install react-leaflet leaflet @types/leaflet
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
