'use client';

import { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Stadium, premierLeagueStadiums, championshipStadiums, serieAStadiums, serieBStadiums, ligue1Stadiums, ligue2Stadiums, laLigaStadiums, segundaStadiums, bundesligaStadiums, bundesliga2Stadiums } from '@/lib/stadiumData';
import { Loader2 } from 'lucide-react';

import { Hotel } from '@/hooks/useHotelData';

interface GoogleStadiumMapProps {
  stadiums: Stadium[];
  hotels?: Hotel[];
  selectedCategory: 'stadium' | 'hotel';
  selectedStadium?: string | null;
  selectedHotel?: string | null;
  onStadiumSelect?: (stadiumName: string) => void;
  onHotelSelect?: (hotelId: string) => void;
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
const isBundesliga = (stadium: Stadium) => {
  // Bundesliga 1部
  // NOTE: You may need to import bundesligaStadiums if not already imported
  // import { bundesligaStadiums } from '@/lib/stadiumData';
  return (typeof bundesligaStadiums !== 'undefined') && bundesligaStadiums.some(b1 => b1.name === stadium.name);
};
const isBundesliga2 = (stadium: Stadium) => {
  // Bundesliga 2部
  // import { bundesliga2Stadiums } from '@/lib/stadiumData';
  return (typeof bundesliga2Stadiums !== 'undefined') && bundesliga2Stadiums.some(b2 => b2.name === stadium.name);
};

const getMarkerColor = (stadium: Stadium, isSelected: boolean = false) => {
  // If selected, use gold/highlight color
  if (isSelected) return '#F59E0B'; // Bright amber/gold for selected
  
  // Normal league colors
  if (isPremierLeague(stadium)) return '#3B82F6'; // Blue for Premier League
  if (isChampionship(stadium)) return '#10B981'; // Green for Championship
  if (isBundesliga(stadium)) return '#FACC15'; // Yellow for Bundesliga 1部 (tailwind yellow-400)
  if (isBundesliga2(stadium)) return '#84CC16'; // Lime for Bundesliga 2部 (tailwind lime-500)
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
function MapComponent({ 
  stadiums, 
  hotels, 
  selectedCategory, 
  onStadiumSelect, 
  selectedStadium, 
  onHotelSelect, 
  selectedHotel 
}: GoogleStadiumMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>();
  const [markers, setMarkers] = useState<any[]>([]);

  // Initialize map
  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new (window as any).google.maps.Map(ref.current, {
        center: { lat: 51.5074, lng: -0.1278 }, // Default to London
        zoom: 6,
        mapTypeControl: false,
        streetViewControl: false,
      });
      setMap(newMap);
    }
  }, [ref, map]);

  // Update markers when data changes
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    let newMarkers: any[] = [];

    if (selectedCategory === 'stadium') {
      newMarkers = stadiums.map(stadium => {
        const isSelected = selectedStadium === stadium.name;
        const marker = new google.maps.Marker({
          position: stadium.coords,
          map: map,
          title: stadium.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: isSelected ? 8 : 6,
            fillColor: getMarkerColor(stadium, isSelected),
            fillOpacity: 1,
            strokeColor: isSelected ? '#ffffff' : getMarkerColor(stadium, isSelected),
            strokeWeight: isSelected ? 2 : 1,
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="font-family: sans-serif; color: #333;">
              <h4 style="font-weight: bold; margin: 0 0 8px;">${stadium.name}</h4>
              <p style="margin: 0 0 4px;"><strong>チーム:</strong> ${stadium.team}</p>
              <p style="margin: 0 0 4px;"><strong>リーグ:</strong> ${getLeagueName(stadium)}</p>
              <p style="margin: 0 0 12px;"><strong>収容人数:</strong> ${stadium.capacity ? stadium.capacity.toLocaleString() : 'N/A'}人</p>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stadium.name)}" target="_blank" rel="noopener noreferrer" style="background-color: #4285F4; color: white; padding: 6px 10px; border-radius: 4px; text-decoration: none; font-size: 12px;">Google Maps</a>
                <a href="https://www.booking.com/searchresults.html?ss=${encodeURIComponent(stadium.name)}" target="_blank" rel="noopener noreferrer" style="background-color: #003580; color: white; padding: 6px 10px; border-radius: 4px; text-decoration: none; font-size: 12px;">Booking.com</a>
                <a href="https://www.trip.com/hotels/list?q=${encodeURIComponent(stadium.name)}" target="_blank" rel="noopener noreferrer" style="background-color: #2874F0; color: white; padding: 6px 10px; border-radius: 4px; text-decoration: none; font-size: 12px;">Trip.com</a>
                <a href="https://www.hotels.com/Hotel-Search?destination=${encodeURIComponent(stadium.name)}" target="_blank" rel="noopener noreferrer" style="background-color: #D92B2B; color: white; padding: 6px 10px; border-radius: 4px; text-decoration: none; font-size: 12px;">Hotels.com</a>
                <a href="https://www.airbnb.jp/s/${encodeURIComponent(stadium.name)}/homes" target="_blank" rel="noopener noreferrer" style="background-color: #FF5A5F; color: white; padding: 6px 10px; border-radius: 4px; text-decoration: none; font-size: 12px;">Airbnb</a>
              </div>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
          onStadiumSelect?.(stadium.name);
        });

        return marker;
      });
    } else if (selectedCategory === 'hotel' && hotels) {
      newMarkers = hotels.map(hotel => {
        if (!hotel.coords) return null;
        const isSelected = selectedHotel === hotel.id;
        const marker = new google.maps.Marker({
          position: hotel.coords,
          map: map,
          title: hotel.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: isSelected ? 8 : 6,
            fillColor: isSelected ? '#F59E0B' : '#8B5CF6', // Purple for hotels
            fillOpacity: 1,
            strokeColor: isSelected ? '#ffffff' : '#8B5CF6',
            strokeWeight: isSelected ? 2 : 1,
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="font-family: sans-serif; color: #333;">
              <h4 style="font-weight: bold; margin: 0 0 8px;">${hotel.name}</h4>
              <p style="margin: 0 0 4px;"><strong>都市:</strong> ${hotel.city}</p>
              ${hotel.rating ? `<p style="margin: 0 0 4px;"><strong>評価:</strong> ${hotel.rating} / 5</p>` : ''}
              ${hotel.price ? `<p style="margin: 0 0 12px;"><strong>価格:</strong> ${hotel.price.toLocaleString()}円</p>` : ''}
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
          onHotelSelect?.(hotel.id);
        });

        return marker;
      }).filter(Boolean); // remove nulls from hotels without coords
    }

    setMarkers(newMarkers);
  }, [map, stadiums, hotels, selectedCategory, selectedStadium, selectedHotel, onStadiumSelect, onHotelSelect]);

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
export default function GoogleStadiumMap({ 
  stadiums, 
  hotels, 
  selectedCategory, 
  selectedStadium, 
  onStadiumSelect, 
  selectedHotel, 
  onHotelSelect 
}: GoogleStadiumMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <ErrorComponent status={Status.FAILURE} />;
  }

  return (
    <Wrapper apiKey={apiKey} render={render} libraries={['marker']}>
      <MapComponent 
        stadiums={stadiums}
        hotels={hotels}
        selectedCategory={selectedCategory}
        selectedStadium={selectedStadium}
        onStadiumSelect={onStadiumSelect}
        selectedHotel={selectedHotel}
        onHotelSelect={onHotelSelect}
      />
    </Wrapper>
  );
}
