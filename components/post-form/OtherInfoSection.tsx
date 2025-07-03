'use client';
import React from 'react';
import { PostFormData, SectionProps } from '@/types/post';
import CollapsibleSection from './CollapsibleSection';

function OtherInfoSection({ formData, setFormData }: SectionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: PostFormData) => ({ ...prev, [name]: value }));
  };

  return (
    <CollapsibleSection title="その他の情報">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">YouTubeリンク</label>
          <input
            type="url"
            name="youtubeUrl"
            placeholder="https://www.youtube.com/watch?v=..."
            value={formData.youtubeUrl || ''}
            onChange={handleChange}
            className="form-input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">持ち物リスト</label>
          <textarea
            name="belongings"
            placeholder="旅行に持って行ったもの、観戦に役立ったものなど"
            value={formData.belongings || ''}
            onChange={handleChange}
            className="form-textarea w-full h-24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">購入したグッズ</label>
          <textarea
            name="goods"
            placeholder="スタジアムや現地で購入したグッズについて"
            value={formData.goods || ''}
            onChange={handleChange}
            className="form-textarea w-full h-24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">旅の思い出/エピソード</label>
          <textarea
            name="memories"
            placeholder="試合以外での楽しかったこと、印象に残った出来事など"
            value={formData.memories || ''}
            onChange={handleChange}
            className="form-textarea w-full h-32"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">これから初観戦行く人へメッセージ</label>
          <textarea
            name="message"
            placeholder="観戦の楽しみ方、アドバイス、おすすめの過ごし方など"
            value={formData.message || ''}
            onChange={handleChange}
            className="form-textarea w-full h-32"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}

export default OtherInfoSection;
