'use client';
import React from 'react';
import Select from 'react-select';
import { SectionProps, Transport } from '@/types/post';
import { v4 as uuidv4 } from 'uuid';
import { airlineOptions, seatClassOptions, travelDurationOptions } from '../data';
import { selectStyles } from './selectStyles';
import CollapsibleSection from './CollapsibleSection';


function TravelInfoSection({ formData, setFormData }: SectionProps) {

  const handleAddTransport = (direction: 'outbound' | 'inbound') => {
    const newTransport: Transport = {
      id: uuidv4(),
      direction,
      method: '飛行機', // 移動手段を飛行機に固定
      from: '',
      to: '',
      departureTime: '',
      arrivalTime: '',
      airline: '',
      seatType: '',
    };
    setFormData({ ...formData, transports: [...(formData.transports || []), newTransport] });
  };

  const handleRemoveTransport = (id: string) => {
    setFormData({ ...formData, transports: formData.transports.filter(t => t.id !== id) });
  };

  const handleTransportChange = (id: string, field: keyof Transport, value: string) => {
    const updatedTransports = formData.transports.map(t =>
      t.id === id ? { ...t, [field]: value } : t
    );
    setFormData({ ...formData, transports: updatedTransports });
  };

  const renderTransportForm = (transport: Transport, index: number) => (
    <div key={transport.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">移動 {index + 1}</h3>
        <button type="button" onClick={() => handleRemoveTransport(transport.id)} className="text-red-500 hover:text-red-700 font-semibold">削除</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="出発地" value={transport.from} onChange={(e) => handleTransportChange(transport.id, 'from', e.target.value)} className="form-input" />
        <input type="text" placeholder="到着地" value={transport.to} onChange={(e) => handleTransportChange(transport.id, 'to', e.target.value)} className="form-input" />
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">出発時刻</label>
          <input type="time" value={transport.departureTime} onChange={(e) => handleTransportChange(transport.id, 'departureTime', e.target.value)} className="form-input w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">到着時刻</label>
          <input type="time" value={transport.arrivalTime} onChange={(e) => handleTransportChange(transport.id, 'arrivalTime', e.target.value)} className="form-input w-full" />
        </div>
        <Select
          options={airlineOptions}
          value={airlineOptions.find(o => o.value === transport.airline)}
          onChange={(option) => handleTransportChange(transport.id, 'airline', option ? option.value : '')}
          placeholder="航空会社を選択/検索..."
          styles={selectStyles}
          isClearable
          isSearchable
        />
        <select
          value={transport.seatType}
          onChange={(e) => handleTransportChange(transport.id, 'seatType', e.target.value)}
          className="form-select w-full"
        >
          <option value="">座席の種類を選択...</option>
          {seatClassOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const outboundTransports = formData.transports?.filter(t => t.direction === 'outbound') || [];
  const inboundTransports = formData.transports?.filter(t => t.direction === 'inbound') || [];

  return (
    <CollapsibleSection title="移動情報">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">往路</h3>
          <div className="space-y-4">
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">総移動時間</label>
                <Select
                    options={travelDurationOptions}
                    value={travelDurationOptions.find(o => o.value === formData.outboundTotalDuration) || null}
                    onChange={(option) => setFormData({ ...formData, outboundTotalDuration: option ? option.value : '' })}
                    placeholder="総移動時間を選択..."
                    styles={selectStyles}
                />
            </div>
            {outboundTransports.map(renderTransportForm)}
            <button type="button" onClick={() => handleAddTransport('outbound')} className="w-full text-center py-2 px-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
              + 往路の移動を追加
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">復路</h3>
          <div className="space-y-4">
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">総移動時間</label>
                <Select
                    options={travelDurationOptions}
                    value={travelDurationOptions.find(o => o.value === formData.inboundTotalDuration) || null}
                    onChange={(option) => setFormData({ ...formData, inboundTotalDuration: option ? option.value : '' })}
                    placeholder="総移動時間を選択..."
                    styles={selectStyles}
                />
            </div>
            {inboundTransports.map(renderTransportForm)}
            <button type="button" onClick={() => handleAddTransport('inbound')} className="w-full text-center py-2 px-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
              + 復路の移動を追加
            </button>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}

export default TravelInfoSection;
