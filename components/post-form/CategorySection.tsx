'use client';
import React from 'react';
import { PostFormData, SectionProps } from '@/types/post';
import CollapsibleSection from './CollapsibleSection';



const availableCategories = [
  'イングランド', 'イタリア', 'スペイン', 'ドイツ', 'フランス', 'その他', 'クラブワールドカップ', 'ジャパンツアー'
];

function CategorySection({ formData, setFormData }: SectionProps) {
  React.useEffect(() => {
    if (!formData.categories || formData.categories.length === 0) {
      setFormData((prev: PostFormData) => ({ ...prev, categories: [availableCategories[0]] }));
    }
  }, [formData.categories, setFormData]);

  const handleCategoryChange = (category: string) => {
    setFormData({ ...formData, categories: [category] });
  };

  return (
    <CollapsibleSection title="カテゴリー選択">
      <div>
        <select
          value={(formData.categories && formData.categories[0]) || availableCategories[0]}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="form-select w-full"
          required
        >
          {availableCategories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </CollapsibleSection>
  );
}

export default CategorySection;
