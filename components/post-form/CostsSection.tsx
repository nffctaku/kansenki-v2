'use client';
import React from 'react';
import { SectionProps, IndividualCost } from '@/types/post';
import { v4 as uuidv4 } from 'uuid';
import CollapsibleSection from './CollapsibleSection';

const costCategories = ['航空券', '宿泊費', '食費', '現地交通費', 'グッズ', 'その他'];

const CostsSection: React.FC<SectionProps> = ({ formData, setFormData }) => {

  React.useEffect(() => {
    // Initialize costs with predefined categories if they are not already set.
    // This runs only once when the component mounts.
    if (!formData.costs || formData.costs.length === 0) {
      const initialCosts: IndividualCost[] = costCategories.map(category => ({
        id: uuidv4(),
        category: category,
        amount: 0,
      }));
      setFormData(prev => ({ ...prev, costs: initialCosts }));
    }
  }, []);

  const handleCostChange = (id: string, field: keyof IndividualCost, value: string | number) => {
    const updatedCosts = (formData.costs || []).map(c =>
      c.id === id ? { ...c, [field]: field === 'amount' ? Number(value) : value } : c
    );
    setFormData({ ...formData, costs: updatedCosts });
  };

  const totalCost = (formData.costs || []).reduce((acc, cost) => acc + (Number(cost.amount) || 0), 0);
  const totalCostManYen = Math.round(totalCost / 10000);

  return (
    <CollapsibleSection title="費用">
      <div className="space-y-4">
        {(formData.costs || []).map((cost) => (
          <div key={cost.id} className="grid grid-cols-5 items-center gap-4">
            <label className="col-span-2 font-medium text-gray-700 dark:text-gray-200">{cost.category}</label>
            <div className="col-span-3 relative rounded-md shadow-sm">
              <input
                type="number"
                placeholder="0"
                value={cost.amount || ''}
                onChange={(e) => handleCostChange(cost.id, 'amount', e.target.value)}
                className="form-input w-full pr-12 text-right"
                min="0"
                pattern="[0-9]*"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">円</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end items-center">
        <span className="text-lg font-semibold text-gray-800 dark:text-white mr-4">合計</span>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          約 {totalCostManYen.toLocaleString()} 万円
        </span>
      </div>
    </CollapsibleSection>
  );
};

export default CostsSection;
