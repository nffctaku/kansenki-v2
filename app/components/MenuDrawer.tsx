'use client';

import { useState } from 'react';
import Link from 'next/link';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { usePostStats } from '@/hooks/usePostStats';

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
      { label: 'スタジアム・ホテル地図', href: '/map' },
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
  const { totalPosts, publicPosts, loading } = usePostStats();
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
          
          {/* 投稿数統計セクション */}
          <div className="mt-8 px-6 py-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 mx-4 rounded-xl">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full mr-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                  サイト統計
                </h3>
              </div>
              {loading ? (
                <div className="flex flex-col items-center py-6">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-500"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 animate-pulse"></div>
                  </div>
                  <span className="mt-3 text-xs text-gray-500 dark:text-gray-400 font-medium">統計を取得中...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">総投稿数</span>
                        </div>
                        <div className="text-xs text-blue-500 font-semibold">📝</div>
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                        {totalPosts.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">件の観戦記</div>
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-bl-full"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">公開投稿数</span>
                        </div>
                        <div className="text-xs text-green-500 font-semibold">🌟</div>
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
                        {publicPosts.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">件が公開中</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 追加の装飾要素 */}
              <div className="mt-4 flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
