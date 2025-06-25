'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const menuConfig = [
  {
    title: 'カテゴリー',
    items: [
      { label: 'イングランド', href: '/category/england' },
      { label: 'スペイン', href: '/category/spain' },
      { label: 'イタリア', href: '/category/italy' },
      { label: 'フランス', href: '/category/france' },
      { label: 'ドイツ', href: '/category/germany' },
      { label: 'その他', href: '/category/other' },
    ],
  },
  {
    title: '現地観戦情報',
    items: [
      { label: '試合チケット情報', href: '#' },
      { label: 'おススメスポット', href: '#' },
    ],
  },
  {
    title: 'SNS',
    items: [
      { label: 'Note', href: '#' },
      { label: 'X', href: '#' },
      { label: 'Youtube', href: '#' },
    ],
  },
  {
    title: 'FOOTBALLTOP',
    items: [
      { label: 'FOOTBALL TOP', href: '/about' },
      { label: '利用規約', href: '/terms' },
      { label: 'ご利用ガイド', href: '/guide' },
    ],
  },
];

export default function MenuDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggleMenu = () => setIsOpen(!isOpen);
  const handleSectionClick = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };
  const pathname = usePathname();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white flex items-center justify-center px-4 border-b">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Image src="/footballtop-logo-12.png" alt="Football Top Logo" width={140} height={40} />
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </header>

      {isOpen && <div className="fixed inset-0 z-[9999]" onClick={toggleMenu} />}

      <aside
        className={`fixed top-0 right-0 w-[70vw] h-screen z-[10000] bg-white transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${!isOpen ? 'invisible' : ''}`}
      >
        <div className="h-full overflow-y-auto pb-8 text-black font-sans">
          {menuConfig.map((section) => (
            <div key={section.title} className="border-b border-gray-200">
              <button
                onClick={() => handleSectionClick(section.title)}
                className="w-full px-6 py-4 text-left text-sm font-bold text-gray-800 flex justify-between items-center hover:bg-gray-50"
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
                      className="block w-full px-8 py-3 text-sm text-black no-underline hover:bg-gray-100 visited:text-black"
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
