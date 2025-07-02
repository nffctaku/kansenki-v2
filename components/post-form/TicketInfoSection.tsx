'use client';

import React from 'react';
import { SectionProps } from '@/types/post';
import CollapsibleSection from './CollapsibleSection';

const purchaseRoutes = [
  '各公式サイト',
  '代理店',
  '友人/その他',
];

const TicketInfoSection: React.FC<SectionProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => {
      if (!prev.match) {
        return prev;
      }
      return {
        ...prev,
        match: {
          ...prev.match,
          [name]: inputValue,
        },
      };
    });
  };

  React.useEffect(() => {
    if (formData.match?.isTour) {
      setFormData(prev => {
        if (!prev.match || prev.match.ticketPrice === '') {
          return prev;
        }
        return {
          ...prev,
          match: {
            ...prev.match,
            ticketPrice: '',
          },
        };
      });
    }
  }, [formData.match?.isTour, setFormData]);

  if (!formData.match) {
    return null;
  }

  return (
    <CollapsibleSection title="チケット情報">
      <div className="space-y-4">
        <div>
          <label htmlFor="ticketTeam" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            購入したチケットのチーム
          </label>
          <select
            name="ticketTeam"
            id="ticketTeam"
            value={formData.match.ticketTeam || ''}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="">選択してください</option>
            <option value="home">ホーム</option>
            <option value="away">アウェイ</option>
          </select>
        </div>

        <div>
          <label htmlFor="ticketPurchaseRoute" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            購入経路
          </label>
          <select
            name="ticketPurchaseRoute"
            id="ticketPurchaseRoute"
            value={formData.match.ticketPurchaseRoute || ''}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="">選択してください</option>
            {purchaseRoutes.map(route => (
              <option key={route} value={route}>{route}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ticketPurchaseRouteUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            購入経路URL
          </label>
          <input
            type="url"
            name="ticketPurchaseRouteUrl"
            id="ticketPurchaseRouteUrl"
            value={formData.match.ticketPurchaseRouteUrl || ''}
            onChange={handleChange}
            className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            チケット価格
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              name="ticketPrice"
              id="ticketPrice"
              value={formData.match.ticketPrice || ''}
              onChange={handleChange}
              className="block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="例: 8000"
              disabled={formData.match.isTour}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">円</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="isTour"
              name="isTour"
              type="checkbox"
              checked={formData.match.isTour || false}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isTour" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              ツアー料金内の為不明
            </label>
          </div>
          <div>
            <div className="flex items-center">
              <input
                id="isHospitality"
                name="isHospitality"
                type="checkbox"
                checked={formData.match.isHospitality || false}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isHospitality" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                ホスピタリティチケット
              </label>
            </div>
            {formData.match.isHospitality && (
              <div className="mt-2">
                <textarea
                  id="hospitalityDetail"
                  name="hospitalityDetail"
                  rows={3}
                  value={formData.match.hospitalityDetail || ''}
                  onChange={handleChange}
                  className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                  placeholder="詳細（例: 食事、ドリンク、専用ラウンジアクセスなど）"
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </CollapsibleSection>
  );
};

export default TicketInfoSection;
