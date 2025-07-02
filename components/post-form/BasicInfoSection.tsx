'use client';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SectionProps } from '@/types/post';
import CollapsibleSection from './CollapsibleSection';

// These should be imported from a shared components file later
const FormInput = ({ label, ...props }: any) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">{label}</label>
        <input {...props} className="w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600" />
    </div>
);

export default function BasicInfoSection({ formData, setFormData }: SectionProps) {
  return (
    <CollapsibleSection title="基本情報">
      <FormInput
        label="ニックネーム"
        type="text"
        value={formData.authorNickname || ''}
        readOnly
        className="bg-gray-200 dark:bg-gray-800 cursor-not-allowed"
      />
      <FormInput
        label="投稿タイトル"
        type="text"
        value={formData.title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
        placeholder="例: 2024年夏のプレミアリーグ観戦旅行"
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
            label="渡航期間（開始）"
            type="date"
            value={formData.travelStartDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, travelStartDate: e.target.value })}
        />
        <FormInput
            label="渡航期間（終了）"
            type="date"
            value={formData.travelEndDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, travelEndDate: e.target.value })}
        />
      </div>
      <FormInput
        label="訪問都市（カンマ区切りで入力）"
        type="text"
        value={formData.visitedCities.map(c => c.name).join(', ')}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const cityNames = e.target.value.split(',').map(name => name.trim()).filter(Boolean);
          const updatedCities = cityNames.map(name => {
            const existingCity = formData.visitedCities.find(c => c.name === name);
            return existingCity || { id: uuidv4(), name };
          });
          setFormData({ ...formData, visitedCities: updatedCities });
        }}
        placeholder="例: ロンドン, マンチェスター"
      />
    </CollapsibleSection>
  );
}
