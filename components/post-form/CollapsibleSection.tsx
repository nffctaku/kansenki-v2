'use client';
import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl shadow-sm">
      <button
        type="button"
        className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
        <ChevronDownIcon
          className={`w-6 h-6 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2">
          <div className="border-t border-slate-200 dark:border-slate-700 -mx-6 mb-6"></div>
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
