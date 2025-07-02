'use client';
import React from 'react';
import { SectionProps, Spot } from '@/types/post';
import { v4 as uuidv4 } from 'uuid';
import CollapsibleSection from './CollapsibleSection';

const SpotsSection: React.FC<SectionProps> = ({ formData, setFormData }) => {

  const handleAddSpot = () => {
    const newSpot: Spot = {
      id: uuidv4(),
      name: '',
      url: '',
      city: '',
      description: '',
    };
    setFormData({ ...formData, spots: [...(formData.spots || []), newSpot] });
  };

  const handleRemoveSpot = (id: string) => {
    const updatedSpots = (formData.spots || []).filter(spot => spot.id !== id);
    setFormData({ ...formData, spots: updatedSpots });
  };

  const handleSpotChange = (id: string, field: keyof Spot, value: string) => {
    const updatedSpots = (formData.spots || []).map(spot =>
      spot.id === id ? { ...spot, [field]: value } : spot
    );
    setFormData({ ...formData, spots: updatedSpots });
  };

  return (
    <CollapsibleSection title="観光・食事スポット">
      {(formData.spots || []).map((spot, index) => (
        <div key={spot.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">スポット {index + 1}</h3>
            <button type="button" onClick={() => handleRemoveSpot(spot.id)} className="text-red-500 hover:text-red-700 font-semibold">削除</button>
          </div>
          <input type="text" placeholder="スポット名" value={spot.name} onChange={(e) => handleSpotChange(spot.id, 'name', e.target.value)} className="form-input w-full" />
          <input type="url" placeholder="URL" value={spot.url || ''} onChange={(e) => handleSpotChange(spot.id, 'url', e.target.value)} className="form-input w-full" />
          <input type="text" placeholder="都市" value={spot.city || ''} onChange={(e) => handleSpotChange(spot.id, 'city', e.target.value)} className="form-input w-full" />
          <textarea placeholder="説明" value={spot.description} onChange={(e) => handleSpotChange(spot.id, 'description', e.target.value)} className="form-textarea w-full" />
        </div>
      ))}
      <button type="button" onClick={handleAddSpot} className="w-full text-center py-2 px-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
        + スポットを追加
      </button>
    </CollapsibleSection>
  );
};

export default SpotsSection;
