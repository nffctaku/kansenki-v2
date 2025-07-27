import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import StarRating from '@/components/StarRating';

// Define a unified interface for spots and hotels
export interface SpotData {
  id: string;
  spotName: string;
  comment: string;
  imageUrls: string[];
  createdAt: Date;
  url?: string;
  country?: string;
  category?: string;
  type: 'spot' | 'hotel';
  author?: string;
  authorAvatar?: string;
  // Spot specific
  rating?: number;
  // Hotel specific
  city?: string;
  overallRating?: number;
}

interface SpotCardProps {
  spot: SpotData;
}

const SpotCard: React.FC<SpotCardProps> = ({ spot }) => {
  const spotDate = spot.createdAt ? format(spot.createdAt, 'yyyy.MM.dd') : '';
  const rating = spot.type === 'hotel' ? spot.overallRating : spot.rating;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col h-full">
      <Link href={`/spots/${spot.id}`} className="no-underline flex flex-col flex-grow">
        <div className="w-full aspect-[4/3] relative">
          {spot.imageUrls && spot.imageUrls.length > 0 ? (
            <Image
              src={spot.imageUrls[0]}
              alt={spot.spotName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          {spot.country && (
            <div className="absolute top-1.5 left-1.5 bg-black bg-opacity-60 text-white text-[10px] px-2 py-0.5 rounded">
              {spot.country}
            </div>
          )}
        </div>
        <div className="p-2 flex flex-col flex-grow">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight h-10 mb-1">
            {spot.spotName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 h-4">
            {spot.type === 'hotel' ? spot.city : spot.category}
          </p>

          <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2">
            <span className="truncate">
              {spot.author}
            </span>
            <span>{spotDate}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SpotCard;
