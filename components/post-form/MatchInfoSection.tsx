'use client';
import React from 'react';
import Select from 'react-select';
import { SectionProps } from '@/types/post';
import { MatchInfo } from '@/types/match';
import CollapsibleSection from './CollapsibleSection';
import { teamList, competitionOptions, seatOptions } from '../data';
import { selectStyles } from './selectStyles';

const MatchInfoSection: React.FC<SectionProps> = ({ formData, setFormData }) => {
  const { match } = formData;

  const handleAddMatch = () => {
    const newMatch: MatchInfo = {
      competition: '',
      season: '', // Set default season, to be updated by user
      date: '',
      kickoff: '',
      homeTeam: '',
      awayTeam: '',
      homeScore: '',
      awayScore: '',
      stadium: '',
      ticketPrice: '',
      ticketPurchaseRoute: '',
      seat: '',
      seatReview: '',
    };
    setFormData(prev => ({ ...prev, match: newMatch }));
  };

  const handleRemoveMatch = () => {
    setFormData(prev => ({ ...prev, match: null }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!match) return;
    const { name, value } = e.target;
    const updatedValue = (name === 'homeScore' || name === 'awayScore') ? (value === '' ? '' : Number(value)) : value;
    
    setFormData(prev => ({
      ...prev,
      match: { ...prev.match!, [name]: updatedValue },
    }));
  };

  const handleSelectChange = (name: string, selectedOption: { value: string; label: string } | null) => {
    if (!match) return;
    const value = selectedOption ? selectedOption.value : '';
    setFormData(prev => ({
      ...prev,
      match: { ...prev.match!, [name]: value },
    }));
  };

  return (
    <CollapsibleSection title="観戦試合">
      {!match ? (
        <button
          type="button"
          onClick={handleAddMatch}
          className="w-full text-center py-2 px-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
        >
          + 観戦情報を追加
        </button>
      ) : (
        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3 relative">
          <button
            type="button"
            onClick={handleRemoveMatch}
            className="absolute top-3 right-3 text-red-500 hover:text-red-700 font-semibold"
          >
            削除
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">試合日</label>
              <input type="date" value={match.date} onChange={handleChange} name="date" className="form-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">キックオフ時間</label>
              <input type="time" value={match.kickoff} onChange={handleChange} name="kickoff" className="form-input w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">大会名</label>
              <Select
                options={competitionOptions}
                value={competitionOptions.flatMap(g => g.options).find(o => o.value === match.competition)}
                onChange={(option) => handleSelectChange('competition', option)}
                placeholder="大会名を選択..."
                styles={selectStyles}
                isClearable
              />
            </div>
            <Select
              options={teamList}
              value={teamList.find(t => t.value === match.homeTeam)}
              onChange={(option) => handleSelectChange('homeTeam', option)}
              placeholder="ホームチームを選択/検索..."
              styles={selectStyles}
              isClearable
              isSearchable
            />
            <Select
              options={teamList}
              value={teamList.find(t => t.value === match.awayTeam)}
              onChange={(option) => handleSelectChange('awayTeam', option)}
              placeholder="アウェイチームを選択/検索..."
              styles={selectStyles}
              isClearable
              isSearchable
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">スコア</label>
              <div className="flex items-center gap-4">
                <select
                  value={match.homeScore}
                  onChange={handleChange}
                  name="homeScore"
                  className="form-select w-full"
                >
                  <option value="">-</option>
                  {Array.from({ length: 11 }, (_, i) => i).map(num => (
                    <option key={`home-${num}`} value={num}>{num}</option>
                  ))}
                </select>
                <span className="text-gray-500 dark:text-gray-400 font-bold text-lg">-</span>
                <select
                  value={match.awayScore}
                  onChange={handleChange}
                  name="awayScore"
                  className="form-select w-full"
                >
                  <option value="">-</option>
                  {Array.from({ length: 11 }, (_, i) => i).map(num => (
                    <option key={`away-${num}`} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">スタジアム</label>
              <input type="text" placeholder="スタジアム名を入力" name="stadium" value={match.stadium} onChange={handleChange} className="form-input w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">座席</label>
              <select
                name="seat"
                value={match.seat}
                onChange={handleChange}
                className="form-select w-full"
              >
                <option value="">座席を選択...</option>
                {seatOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">座席レビュー</label>
              <textarea placeholder="座席からの見え方や感想など" name="seatReview" value={match.seatReview} onChange={handleChange} className="form-textarea w-full" />
            </div>
          </div>
        </div>
      )}
    </CollapsibleSection>
  );
};

export default MatchInfoSection;
