'use client';

import { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Stadium, premierLeagueStadiums, championshipStadiums, serieAStadiums, serieBStadiums, ligue1Stadiums, ligue2Stadiums, laLigaStadiums, segundaStadiums } from '@/lib/stadiumData';
import { Loader2 } from 'lucide-react';

interface GoogleStadiumMapProps {
  stadiums: Stadium[];
  onStadiumSelect?: (stadiumName: string) => void;
  selectedStadium?: string | null;
}

// Helper functions to determine stadium league
const isPremierLeague = (stadium: Stadium) => {
  return premierLeagueStadiums.some(pl => pl.name === stadium.name);
};

const isChampionship = (stadium: Stadium) => {
  return championshipStadiums.some(ch => ch.name === stadium.name);
};

const isSerieA = (stadium: Stadium) => {
  return serieAStadiums.some(sa => sa.name === stadium.name);
};

const isSerieB = (stadium: Stadium) => {
  return serieBStadiums.some(sb => sb.name === stadium.name);
};

const isLigue1 = (stadium: Stadium) => {
  return ligue1Stadiums.some(l1 => l1.name === stadium.name);
};

const isLigue2 = (stadium: Stadium) => {
  return ligue2Stadiums.some(l2 => l2.name === stadium.name);
};

const isLaLiga = (stadium: Stadium) => {
  return laLigaStadiums.some(ll => ll.name === stadium.name);
};

const isSegunda = (stadium: Stadium) => {
  return segundaStadiums.some(sg => sg.name === stadium.name);
};

// Get marker color based on league and selection state
const getMarkerColor = (stadium: Stadium, isSelected: boolean = false) => {
  // If selected, use gold/highlight color
  if (isSelected) return '#F59E0B'; // Bright amber/gold for selected
  
  // Normal league colors
  if (isPremierLeague(stadium)) return '#3B82F6'; // Blue for Premier League
  if (isChampionship(stadium)) return '#10B981'; // Green for Championship
  if (isSerieA(stadium)) return '#DC2626'; // Red for Serie A
  if (isSerieB(stadium)) return '#EA580C'; // Orange for Serie B
  if (isLigue1(stadium)) return '#9333EA'; // Purple for Ligue 1
  if (isLigue2(stadium)) return '#4F46E5'; // Indigo for Ligue 2
  if (isLaLiga(stadium)) return '#CA8A04'; // Yellow for La Liga
  if (isSegunda(stadium)) return '#D97706'; // Amber for Segunda
  return '#6B7280'; // Gray for unknown
};

// Get league name for display
const getLeagueName = (stadium: Stadium) => {
  if (isPremierLeague(stadium)) return 'プレミアリーグ';
  if (isChampionship(stadium)) return 'チャンピオンシップ';
  if (isSerieA(stadium)) return 'セリエA';
  if (isSerieB(stadium)) return 'セリエB';
  if (isLigue1(stadium)) return 'リーグ・アン';
  if (isLigue2(stadium)) return 'リーグ・ドゥ';
  if (isLaLiga(stadium)) return 'ラ・リーガ';
  if (isSegunda(stadium)) return 'セグンダ';
  return '不明';
};

// Map component
function MapComponent({ stadiums, onStadiumSelect, selectedStadium }: GoogleStadiumMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>();
  const [markers, setMarkers] = useState<any[]>([]);

  // Initialize map
  useEffect(() => {
    if (ref.current && !map && (window as any).google) {
      const newMap = new (window as any).google.maps.Map(ref.current, {
        center: { lat: 52.5, lng: -1.5 }, // Center on England
        zoom: 6,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      setMap(newMap);
    }
  }, [ref, map]);

// Update markers when stadiums or selection changes
useEffect(() => {
  if (!map) return;

  // Clear existing markers
  markers.forEach(marker => marker.setMap(null));
  
  // Create new markers
  const newMarkers = (stadiums || []).map(stadium => {
    const isSelected = selectedStadium === stadium.name;
    const color = getMarkerColor(stadium, isSelected);
    
    const marker = new (window as any).google.maps.Marker({
      position: { lat: stadium.coords.lat, lng: stadium.coords.lng },
      map: map,
      title: stadium.name,
      icon: {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 2,
        anchor: new (window as any).google.maps.Point(12, 24),
      },
    });

    // Create info window
    const infoWindow = new (window as any).google.maps.InfoWindow({
      content: `
        <div style="padding: 12px; min-width: 200px;">
          <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #1f2937;">${stadium.name}</h3>
          <div style="font-size: 14px; color: #6b7280; line-height: 1.4;">
            <p><strong>リーグ:</strong> ${getLeagueName(stadium)}</p>
            <p><strong>クラブ:</strong> ${stadium.club}</p>
            <p><strong>収容人数:</strong> ${stadium.capacity?.toLocaleString()}人</p>
          </div>
        </div>
      `
    });

    // Add click listener
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
      onStadiumSelect?.(stadium.name);
    });

    return marker;
  });

  setMarkers(newMarkers);
}, [map, stadiums, selectedStadium, onStadiumSelect]);

  // Center map on selected stadium
  useEffect(() => {
    if (!map || !selectedStadium) return;
    
    const stadium = stadiums.find(s => s.name === selectedStadium);
    if (stadium) {
      map.panTo({ lat: stadium.coords.lat, lng: stadium.coords.lng });
      map.setZoom(12);
    }
  }, [map, selectedStadium, stadiums]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}

// Loading component
const LoadingComponent = () => (
  <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
      <p className="text-gray-600 dark:text-gray-400">地図を読み込み中...</p>
    </div>
  </div>
);

// Error component
const ErrorComponent = ({ status }: { status: Status }) => (
  <div className="h-full flex items-center justify-center bg-red-50 dark:bg-red-900/20">
    <div className="text-center p-6">
      <div className="text-red-500 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">地図の読み込みに失敗しました</h3>
      <p className="text-red-600 dark:text-red-300 text-sm mb-4">
        Google Maps APIの設定を確認してください
      </p>
      <p className="text-xs text-red-500 dark:text-red-400">
        エラー: {status}
      </p>
      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-xs text-yellow-800 dark:text-yellow-200">
          💡 Google Maps API Keyが必要です。環境変数 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY を設定してください。
        </p>
      </div>
    </div>
  </div>
);

// Render function for Wrapper
const render = (status: Status, ...args: any[]) => {
  switch (status) {
    case Status.LOADING:
      return <LoadingComponent />;
    case Status.FAILURE:
      return <ErrorComponent status={status} />;
    case Status.SUCCESS:
      return <MapComponent {...args[0]} />;
  }
};

// Main component
export default function GoogleStadiumMap({ stadiums, selectedStadium, onStadiumSelect }: GoogleStadiumMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <ErrorComponent status={Status.FAILURE} />;
  }

  return (
    <Wrapper apiKey={apiKey} render={render} libraries={['marker']}>
      <MapComponent 
        stadiums={stadiums} 
        selectedStadium={selectedStadium} 
        onStadiumSelect={onStadiumSelect} 
      />
    </Wrapper>
  );
}
