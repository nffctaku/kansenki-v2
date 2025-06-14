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
  className="bg-transparent border-none outline-none z-50"
>
  <span
    style={{
      fontSize: '32px',
      lineHeight: '1',
      display: 'inline-block',
      color: 'black',
    }}
  >
    ☰
  </span>
</button>


  <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[16px] font-bold text-black">
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
        {/* 各カテゴリー */}
        <div className="bg-[#f1f1f1] px-6 py-4 text-xs font-bold text-gray-500 tracking-wide">
          各カテゴリー
        </div>
        {[
          { label: 'イングランド', href: '/category/england' },
          { label: 'スペイン', href: '/category/spain' },
          { label: 'イタリア', href: '/category/italy' },
          { label: 'フランス', href: '/category/france' },
          { label: 'ドイツ', href: '/category/germany' },
          { label: 'その他', href: '/category/other' },
        ].map(({ label, href }) => (
          <div key={href} className="border-b border-gray-200 px-6 py-8">
            <a
              href={href}
              className="block w-full no-underline hover:opacity-80"
              style={{ color: 'black' }}
            >
              {label}
            </a>
          </div>
        ))}

        {/* 現地観戦情報 */}
        <div className="bg-[#f1f1f1] px-6 py-4 text-xs font-bold text-gray-500 tracking-wide">
          現地観戦情報
        </div>
        <div className="border-b border-gray-200 px-6 py-8">
          <span className="block w-full">試合チケット情報</span>
        </div>
        <div className="border-b border-gray-200 px-6 py-8">
          <span className="block w-full">おススメスポット</span>
        </div>

        {/* SNS */}
        <div className="bg-[#f1f1f1] px-6 py-4 text-xs font-bold text-gray-500 tracking-wide">
          SNS
        </div>
        {[
          { label: 'Note', href: '#' },
          { label: 'X', href: '#' },
          { label: 'Youtube', href: '#' },
        ].map(({ label, href }) => (
          <div key={label} className="border-b border-gray-200 px-6 py-8">
            <a
              href={href}
              className="block w-full no-underline hover:opacity-80"
              style={{ color: 'black' }}
            >
              {label}
            </a>
          </div>
        ))}

        {/* その他 */}
        <div className="bg-[#f1f1f1] px-6 py-6 text-xs font-bold text-gray-500 tracking-wide">
          その他
        </div>
        {['FOOTBALL TOP', '利用規約', 'ご利用ガイド'].map((item) => (
          <div key={item} className="border-b border-gray-200 px-6 py-8">
            <span className="block w-full">{item}</span>
          </div>
        ))}
      </div>
    </aside>
  </>
);
}
