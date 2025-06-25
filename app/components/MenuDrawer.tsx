'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function MenuDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const pathname = usePathname();

  return (
    <>
      {/* Conditional Header */}
      {pathname === '/' ? (
        <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white flex items-center justify-center px-4 border-b">
          {/* Centered Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Image src="/footballtop-logo-12.png" alt="Football Top Logo" width={140} height={40} />
          </div>
          {/* Right Menu Icon */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <button onClick={toggleMenu} className="focus:outline-none">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </header>
      ) : (
        <header className="bg-white h-14 flex items-center justify-end px-4 z-0 relative">
           <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[16px] font-bold text-black">
            現地観戦記
          </h1>
          <div onClick={toggleMenu} className="z-50 p-2 cursor-pointer" role="button" tabIndex={0}>
            <span className="text-4xl text-black">☰</span>
          </div>
        </header>
      )}

      {/* Overlay to close menu on click outside */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999]" onClick={toggleMenu} />
      )}

      {/* Side Menu */}
      {/* Side Menu: Use inline style for transform to ensure it works reliably */}
      <aside
        className={`fixed top-0 right-0 w-[70vw] h-screen z-[10000] bg-white transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${!isOpen ? 'invisible' : ''}`}
      >
      <div className="h-full overflow-y-auto pb-[72px] text-black text-sm font-sans">
        {/* 各カテゴリー */}
        <div className="px-6 py-4 text-xs font-bold text-gray-500 tracking-wide">
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
        <div className="px-6 py-4 text-xs font-bold text-gray-500 tracking-wide">
          現地観戦情報
        </div>
        <div className="border-b border-gray-200 px-6 py-8">
          <span className="block w-full">試合チケット情報</span>
        </div>
        <div className="border-b border-gray-200 px-6 py-8">
          <span className="block w-full">おススメスポット</span>
        </div>

        {/* SNS */}
        <div className="px-6 py-4 text-xs font-bold text-gray-500 tracking-wide">
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
<div className="px-6 py-6 text-xs font-bold text-gray-500 tracking-wide">
  その他
</div>

{[
  { label: 'FOOTBALL TOP', href: '/about' },
  { label: '利用規約', href: '/terms' },
  { label: 'ご利用ガイド', href: '/guide' },
].map((item) => (
  <div key={item.label} className="border-b border-gray-200 px-6 py-8">
   <Link
  href={item.href}
  className="block w-full text-sm text-black no-underline hover:text-gray-600 visited:text-black"
  style={{ color: 'black', textDecoration: 'none' }}
>
  {item.label}
</Link>



  </div>
))}
      </div>
    </aside>
  </>
);
}
