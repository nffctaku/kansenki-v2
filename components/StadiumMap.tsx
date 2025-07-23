'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Stadium, premierLeagueStadiums, championshipStadiums, serieAStadiums, serieBStadiums, ligue1Stadiums, ligue2Stadiums, laLigaStadiums, segundaStadiums, MapCategory } from '@/lib/stadiumData';
import { HotelMapData } from '@/hooks/useHotelData';
import { MapPin, Loader2 } from 'lucide-react';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface StadiumMapProps {
  stadiums: Stadium[];
  hotels?: HotelMapData[];
  onStadiumSelect?: (stadiumName: string) => void;
  onHotelSelect?: (hotelId: string) => void;
  selectedStadium?: string | null;
  selectedHotel?: string | null;
  category?: MapCategory;
}

export default function StadiumMap({ 
  stadiums, 
  hotels = [], 
  selectedStadium, 
  selectedHotel, 
  onStadiumSelect, 
  onHotelSelect,
  category = 'stadium'
}: StadiumMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check if leaflet is available and set up custom icons
    const checkLeaflet = async () => {
      try {
        const L = await import('leaflet');
        await import('react-leaflet');
        
        // Fix for default markers in webpack
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });
        
        setLeafletLoaded(true);
      } catch (error) {
        console.log('Leaflet not available:', error);
        setLeafletLoaded(false);
      }
    };
    
    checkLeaflet();
  }, []);

  // Center map on England
  const centerPosition: [number, number] = [52.5, -1.5];
  const zoom = 6;
  
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

  // Get hotel marker color
  const getHotelMarkerColor = (hotel: HotelMapData, isSelected: boolean = false) => {
    if (isSelected) return '#F59E0B'; // Bright amber/gold for selected
    return '#8B5CF6'; // Purple for hotels
  };

  // Create custom marker icon with dynamic color
  const createCustomIcon = (color: string, isSelected: boolean = false) => {
    if (!leafletLoaded || !window.L) return null;
    
    const size = isSelected ? 35 : 25; // Larger size for selected
    const shadowSize = isSelected ? 41 : 31;
    
    return new window.L.Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="12" cy="9" r="3" fill="white"/>
        </svg>
      `)}`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [size, size],
      iconAnchor: [size/2, size],
      popupAnchor: [1, -size + 5],
      shadowSize: [shadowSize, shadowSize]
    });
  };

  if (!isClient) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!leafletLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            地図ライブラリが見つかりません
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            以下のコマンドを実行して地図機能を有効にしてください:
          </p>
          <code className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded text-sm">
            npm install react-leaflet leaflet @types/leaflet
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <MapContainer
        center={centerPosition}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        

        
        {/* Stadium Markers */}
        {category === 'stadium' && stadiums.map((stadium, index) => {
          const isSelected = selectedStadium === stadium.name;
          const markerColor = getMarkerColor(stadium, isSelected);
          
          return (
            <Marker
              key={`stadium-${index}`}
              position={[stadium.coords.lat, stadium.coords.lng]}
              icon={createCustomIcon(markerColor, isSelected) || undefined}
              eventHandlers={{
                click: () => onStadiumSelect?.(stadium.name),
              }}
            >
              <Popup>
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: markerColor}}></div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      isSelected ? 'bg-amber-100 text-amber-800' :
                      markerColor === '#3B82F6' ? 'bg-blue-100 text-blue-800' :
                      markerColor === '#10B981' ? 'bg-green-100 text-green-800' :
                      markerColor === '#DC2626' ? 'bg-red-100 text-red-800' :
                      markerColor === '#EA580C' ? 'bg-orange-100 text-orange-800' :
                      markerColor === '#9333EA' ? 'bg-purple-100 text-purple-800' :
                      markerColor === '#4F46E5' ? 'bg-indigo-100 text-indigo-800' :
                      markerColor === '#CA8A04' ? 'bg-yellow-100 text-yellow-800' :
                      markerColor === '#D97706' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getLeagueName(stadium)}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{stadium.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">チーム:</span> {stadium.team}</p>
                    <p><span className="font-medium">収容人数:</span> {stadium.capacity?.toLocaleString()}人</p>
                    <p><span className="font-medium">開場年:</span> {stadium.opened}年</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Hotel Markers */}
        {category === 'hotel' && hotels.map((hotel, index) => {
          if (!hotel.coords) return null;
          
          const isSelected = selectedHotel === hotel.id;
          const markerColor = getHotelMarkerColor(hotel, isSelected);
          
          return (
            <Marker
              key={`hotel-${index}`}
              position={[hotel.coords.lat, hotel.coords.lng]}
              icon={createCustomIcon(markerColor, isSelected) || undefined}
              eventHandlers={{
                click: () => onHotelSelect?.(hotel.id),
              }}
            >
              <Popup>
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: markerColor}}></div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      isSelected ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      ホテル
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{hotel.name}</h3>
                  <div className="space-y-1 text-sm">
                    {hotel.city && <p><span className="font-medium">都市:</span> {hotel.city}</p>}
                    {hotel.rating && <p><span className="font-medium">評価:</span> {hotel.rating}/5</p>}
                    {hotel.price && <p><span className="font-medium">料金:</span> {hotel.price.toLocaleString()}円</p>}
                    {hotel.nights && <p><span className="font-medium">泊数:</span> {hotel.nights}泊</p>}
                    {hotel.bookingSite && <p><span className="font-medium">予約サイト:</span> {hotel.bookingSite}</p>}
                    <p><span className="font-medium">投稿者:</span> {hotel.author}</p>
                    <p><span className="font-medium">投稿:</span> {hotel.postTitle}</p>
                    {hotel.comment && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">{hotel.comment}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
