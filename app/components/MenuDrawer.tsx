'use client';

import { useState } from 'react';

export default function MenuDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

return (
  <>
    {/* ヘッダー */}
    <header className="bg-white border-b h-14 flex items-center px-4 z-0 relative">
      <button
        onClick={toggleMenu}
        className="text-xl bg-transparent border-none outline-none z-50"
      >
        ☰
      </button>
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-black">
        現地観戦記
      </h1>
    </header>

    {/* オーバーレイ */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/40 z-[9999]"
        onClick={toggleMenu}
      />
    )}

    {/* サイドメニュー本体 */}
    <aside
      className={`fixed top-0 left-0 w-[70vw] h-screen z-[10000] transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-[110%]'
      }`}
      style={{ backgroundColor: 'white' }}
    >
      <div className="h-full overflow-y-auto pb-[72px] text-black text-sm font-sans">
        {/* ヘッダー */}
        <div className="px-4 py-4 font-bold text-base border-b border-gray-200">
    
        </div>

        {/* === マイメニュー === */}
        <div className="bg-[#f1f1f1] px-4 py-2 text-xs font-bold text-gray-500 tracking-wide">
          各カテゴリー
        </div>
        <div className="border-b border-gray-200 px-4 py-4">
          <span className="block w-full">マイページ</span>
        </div>
        <div className="border-b border-gray-200 px-4 py-4">
          <span className="block w-full">クーポン</span>
        </div>
        <div className="border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <span className="block w-full">お知らせ</span>
          <span className="text-white bg-red-500 text-xs rounded-full px-2 py-0.5">3</span>
        </div>

        {/* === 店舗 === */}
        <div className="bg-[#f1f1f1] px-4 py-2 text-xs font-bold text-gray-500 tracking-wide">
          店舗
        </div>
        <div className="border-b border-gray-200 px-4 py-4">
          <span className="block w-full">店舗検索</span>
        </div>
        <div className="border-b border-gray-200 px-4 py-4">
          <span className="block w-full">お気に入り店舗の設定</span>
        </div>

        {/* === SNS === */}
        <div className="bg-[#f1f1f1] px-4 py-2 text-xs font-bold text-gray-500 tracking-wide">
          SNS
        </div>
        {[
          { label: 'Instagram', href: '#' },
          { label: 'twitter', href: '#' },
          { label: 'LINE', href: '#' },
          { label: 'Youtube', href: '#' },
          { label: 'Facebook', href: '#' },
        ].map(({ label, href }) => (
          <div key={label} className="border-b border-gray-200 px-4 py-4">
            <a href={href} className="block w-full text-black hover:opacity-80">
              {label}
            </a>
          </div>
        ))}

        {/* === その他 === */}
        <div className="bg-[#f1f1f1] px-4 py-2 text-xs font-bold text-gray-500 tracking-wide">
          その他
        </div>
        {[
          '会社概要',
          '利用規約',
          '個人情報の取り扱いについて',
          'ご利用ガイド',
        ].map((item) => (
          <div key={item} className="border-b border-gray-200 px-4 py-4">
            <span className="block w-full">{item}</span>
          </div>
        ))}
      </div>
    </aside>
  </>
);
}
