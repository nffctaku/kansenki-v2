'use client';

import { useState } from 'react';
import Link from 'next/link';

import Image from 'next/image';
import { useTheme } from 'next-themes';

const menuConfig = [
  {
    title: 'カテゴリー',
    items: [
      { label: 'イングランド', href: '/category/england' },
      { label: 'スペイン', href: '/category/spain' },
      { label: 'イタリア', href: '/category/italy' },
      { label: 'フランス', href: '/category/france' },
      { label: 'ドイツ', href: '/category/germany' },
      { label: 'クラブワールドカップ', href: '/category/club-world-cup' },
      { label: 'ジャパンツアー', href: '/category/japan-tour' },
      { label: 'その他', href: '/category/other' },
    ],
  },
  {
    title: '現地観戦情報',
    items: [
      { label: '試合チケット情報', href: '/ticket-info' },
      { label: 'おススメスポット', href: '#' },
    ],
  },

  {
    title: 'SNS',
    items: [
      { label: 'Note', href: '#' },
      { label: 'X', href: 'https://x.com/FOOTBALLTOP2024' },
      { label: 'Youtube', href: '#' },
    ],
  },
  {
    title: 'アップデート情報',
    items: [
      { label: '更新履歴', href: '/updates' },
    ],
  },
  {
    title: 'FOOTBALLTOP',
    items: [
      { label: 'FOOTBALL TOP', href: 'https://www.locofootball.com/' },
      { label: '利用規約', href: '/terms' },
      { label: 'ご利用ガイド', href: '/guide' },
    ],
  },
];

export default function MenuDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  useTheme();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggleMenu = () => setIsOpen(!isOpen);
  const handleSectionClick = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };


  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white dark:bg-black flex items-center justify-center px-4 border-b dark:border-gray-800">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="dark:hidden">
            <Image src="/footballtop-logo-12.png" alt="Football Top Logo" width={140} height={40} />
          </div>
          <div className="hidden dark:block">
            <Image src="/footballtop-logo-13.png" alt="Football Top Logo" width={140} height={40} />
          </div>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </header>

      {isOpen && <div className="fixed inset-0 z-[9999]" onClick={toggleMenu} />}

      <aside
        className={`fixed top-0 right-0 w-[70vw] h-screen z-[10000] bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${!isOpen ? 'invisible' : ''}`}
      >
        <div className="h-full overflow-y-auto pb-8 text-black dark:text-white font-sans">
          {/* 閉じるボタンを一番上に配置 */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
            <button 
              onClick={toggleMenu} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200 focus:outline-none"
              aria-label="メニューを閉じる"
            >
              <svg 
                className="w-6 h-6 text-gray-700 dark:text-gray-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {menuConfig.map((section) => (
            <div key={section.title} className="border-b border-gray-200">
              <button
                onClick={() => handleSectionClick(section.title)}
                className="w-full px-6 py-4 text-left text-sm font-bold text-gray-800 dark:text-gray-200 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <span>{section.title}</span>
                <span className={`transform transition-transform duration-200 ${openSection === section.title ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === section.title ? 'max-h-screen' : 'max-h-0'}`}
              >
                <div className="py-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.href + item.label}
                      href={item.href}
                      className="block w-full px-8 py-3 text-sm text-black dark:text-white no-underline hover:bg-gray-100 dark:hover:bg-gray-700 visited:text-black dark:visited:text-white"
                      onClick={toggleMenu}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
