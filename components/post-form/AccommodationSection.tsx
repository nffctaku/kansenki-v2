'use client';
import React from 'react';
import { SectionProps } from '@/types/post';
import { Hotel } from '@/types/match';
import { v4 as uuidv4 } from 'uuid';
import CollapsibleSection from './CollapsibleSection';



type RatingCategory = {
  key: keyof Pick<Hotel, 'accessRating' | 'cleanlinessRating' | 'comfortRating' | 'facilityRating' | 'staffRating'>;
  label: string;
};

const ratingCategories: RatingCategory[] = [
  { key: 'accessRating', label: 'アクセス' },
  { key: 'cleanlinessRating', label: '清潔さ' },
  { key: 'comfortRating', label: '快適さ' },
  { key: 'facilityRating', label: '設備' },
  { key: 'staffRating', label: 'スタッフ' },
];

type StarRatingProps = {
  rating: number;
    setRating?: (rating: number) => void;
  readOnly?: boolean;
};

function StarRating({ rating, setRating, readOnly = false }: StarRatingProps) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const starClasses = ['w-7 h-7'];
        if (!readOnly) starClasses.push('cursor-pointer');
        if (rating >= star) {
          starClasses.push('text-yellow-400');
        } else {
          starClasses.push('text-gray-300 dark:text-gray-600');
        }

        return (
          <svg
            key={star}
            onClick={() => !readOnly && setRating && setRating(star)}
            className={starClasses.join(' ')}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.54 1.118l-3.368-2.446a1 1 0 00-1.175 0l-3.368 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.05 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
          </svg>
        );
      })}
    </div>
  );
}

type UpdatableHotelField = 'name' | 'url' | 'bookingSite' | 'city' | 'nights' | 'comment' | 'price';

const bookingSites = ['Booking.com', 'Agoda', 'Expedia', 'Hotels.com', 'Trip.com', 'Airbnb', 'その他'];

function AccommodationSection({ formData, setFormData }: SectionProps) {

  const handleAddHotel = () => {
    const newHotel: Hotel = {
      id: uuidv4(),
      name: '',
      city: '',
      nights: 1,
    };
    setFormData(prev => ({ ...prev, hotels: [...(prev.hotels || []), newHotel] }));
  };

  const handleRemoveHotel = (id: string) => {
    setFormData(prev => ({ ...prev, hotels: prev.hotels?.filter(h => h.id !== id) }));
  };

  const handleHotelChange = (id: string, field: UpdatableHotelField, value: string | number) => {
    const updatedHotels = formData.hotels?.map(h =>
      h.id === id ? { ...h, [field]: value } : h
    );
    setFormData(prev => ({ ...prev, hotels: updatedHotels }));
  };

  const handleRatingChange = (id: string, category: keyof Pick<Hotel, 'accessRating' | 'cleanlinessRating' | 'comfortRating' | 'facilityRating' | 'staffRating'>, value: number) => {
    const updatedHotels = formData.hotels?.map(h => {
      if (h.id === id) {
        const newHotel = { ...h, [category]: value };
        
        const ratingValues = ratingCategories
          .map(c => newHotel[c.key])
          .filter((v): v is number => typeof v === 'number' && v > 0);

        const overallRating = ratingValues.length > 0
          ? ratingValues.reduce((sum, current) => sum + current, 0) / ratingValues.length
          : 0;

        return { ...newHotel, overallRating: parseFloat(overallRating.toFixed(1)) };
      }
      return h;
    });
    setFormData(prev => ({ ...prev, hotels: updatedHotels }));
  };

  return (
    <CollapsibleSection title="宿泊先情報">
      {formData.hotels && formData.hotels.map((hotel, index) => (
        <div key={hotel.id} className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="md:col-span-2 flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">宿泊先 {index + 1}</h4>
              <button onClick={() => handleRemoveHotel(hotel.id)} className="text-red-500 hover:text-red-700 font-semibold">削除</button>
            </div>
            <div className="md:col-span-2">
                <input type="text" placeholder="ホテル名" value={hotel.name || ''} onChange={(e) => handleHotelChange(hotel.id, 'name', e.target.value)} className="form-input" />
            </div>
            <div className="md:col-span-2">
                <input type="url" placeholder="ホテルのURL" value={hotel.url || ''} onChange={(e) => handleHotelChange(hotel.id, 'url', e.target.value)} className="form-input" />
            </div>
            <div className="md:col-span-2">
              <select
                value={hotel.bookingSite || ''}
                onChange={(e) => handleHotelChange(hotel.id, 'bookingSite', e.target.value)}
                className="form-select w-full"
              >
                <option value="">予約サイトを選択</option>
                {bookingSites.map(site => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
            </div>
            <input type="text" placeholder="宿泊先の都市" value={hotel.city || ''} onChange={(e) => handleHotelChange(hotel.id, 'city', e.target.value)} className="form-input" />
            <select
                value={hotel.nights || 1}
                onChange={(e) => handleHotelChange(hotel.id, 'nights', parseInt(e.target.value, 10))}
                className="form-select w-full"
            >
                {Array.from({ length: 30 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n}泊</option>
                ))}
            </select>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">料金 (円)</label>
                <input type="number" placeholder="0" value={hotel.price || ''} onChange={(e) => handleHotelChange(hotel.id, 'price', parseInt(e.target.value, 10) || 0)} className="form-input text-right" min="0" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">総合評価</label>
              <div className="flex items-center gap-x-4">
                <StarRating rating={Math.round(hotel.overallRating || 0)} readOnly />
                <span className="text-xl font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                  {(hotel.overallRating || 0).toFixed(1)}
                </span>
              </div>
            </div>

            <div className="md:col-span-2 pt-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">詳細評価</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {ratingCategories.map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
                    <StarRating
                      rating={hotel[key] || 0}
                      setRating={(rating) => handleRatingChange(hotel.id, key, rating)}
                    />
                  </div>
                ))}
              </div>
            </div>
        
            <div className="md:col-span-2">
              <textarea placeholder="詳細コメント" value={hotel.comment || ''} onChange={(e) => handleHotelChange(hotel.id, 'comment', e.target.value)} className="form-textarea w-full" rows={3}></textarea>
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={handleAddHotel} className="w-full text-center py-2 px-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
        + 宿泊先を追加
      </button>
    </CollapsibleSection>
  );
};

export default AccommodationSection;
