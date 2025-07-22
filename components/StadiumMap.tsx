'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Stadium, premierLeagueStadiums } from '@/lib/stadiumData';
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
  selectedStadium?: string | null;
  onStadiumSelect?: (stadiumName: string) => void;
}

export default function StadiumMap({ stadiums, selectedStadium, onStadiumSelect }: StadiumMapProps) {
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
  
  // Helper function to determine if stadium is Premier League
  const isPremierLeague = (stadium: Stadium) => {
    return premierLeagueStadiums.some(pl => pl.name === stadium.name);
  };
  
  // Helper function to get marker color based on league
  const getMarkerColor = (stadium: Stadium) => {
    return isPremierLeague(stadium) ? '#3B82F6' : '#10B981'; // Blue for PL, Green for Championship
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
        
        {stadiums.map((stadium, index) => {
          const isPlStadium = isPremierLeague(stadium);
          return (
            <Marker
              key={index}
              position={[stadium.coords.lat, stadium.coords.lng]}
              eventHandlers={{
                click: () => onStadiumSelect?.(stadium.name),
              }}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      isPlStadium ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      isPlStadium 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {isPlStadium ? 'プレミアリーグ' : 'チャンピオンシップ'}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {stadium.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {stadium.team}
                  </p>
                  {stadium.capacity && (
                    <p className="text-xs text-gray-500">
                      座席数: {stadium.capacity.toLocaleString()}
                    </p>
                  )}
                  {stadium.opened && (
                    <p className="text-xs text-gray-500">
                      開場: {stadium.opened}年
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
