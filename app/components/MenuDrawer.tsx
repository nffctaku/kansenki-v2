'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BookOpen, BedDouble, MapPin, Plus } from 'lucide-react';

// 型定義を明確化
interface MenuItem {
  label: string;
  href: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
  isSingleLink?: boolean;
  href?: string;
}

const menuConfig: MenuSection[] = [
  {
    title: 'マイページ',
    items: [],
    isSingleLink: true,
    href: '/mypage',
  },
  {
    title: '観戦記を探す',
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
    items: [{ label: '更新履歴', href: '/updates' }],
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleSectionClick = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white dark:bg-black flex items-center justify-center px-4 border-b dark:border-gray-800">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="cursor-pointer">
            <div className="dark:hidden">
              <Image src="/footballtop-logo-12.png" alt="Football Top Logo" width={140} height={40} priority style={{ height: 'auto' }} sizes="140px" />
            </div>
            <div className="hidden dark:block">
              <Image src="/footballtop-logo-13.png" alt="Football Top Logo" width={140} height={40} priority style={{ height: 'auto' }} sizes="140px" />
            </div>
          </Link>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </header>

      {isOpen && <div className="fixed inset-0 z-[9999]" onClick={toggleMenu} />}

      <aside className={`fixed top-0 right-0 w-[70vw] h-screen z-[10000] bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${!isOpen ? 'invisible' : ''}`}>
        <div className="h-full overflow-y-auto pb-8 text-black dark:text-white font-sans">
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
            <button onClick={toggleMenu} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200 focus:outline-none" aria-label="メニューを閉じる">
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-4">
            {menuConfig.map((section) => (
              <div key={section.title} className="border-b border-gray-200 dark:border-gray-700">
                {section.isSingleLink ? (
                  <Link href={section.href!} onClick={toggleMenu} className="block w-full px-4 py-3 text-left text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200 rounded-md">
                    {section.title}
                  </Link>
                ) : (
                  <>
                    <button onClick={() => handleSectionClick(section.title)} className="w-full flex justify-between items-center px-4 py-3 text-left text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200 rounded-md">
                      <span>{section.title}</span>
                      <svg className={`w-5 h-5 transform transition-transform duration-200 ${openSection === section.title ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    {openSection === section.title && (
                      <div className="pl-4 mt-2 mb-3 space-y-2">
                        {section.items.map((item) => (
                          <Link key={item.label} href={item.href} onClick={toggleMenu} className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200">
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>


        </div>
      </aside>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-lg transition-transform transform hover:scale-110 ease-in-out duration-200">
            <Plus className="h-8 w-8" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>何を投稿しますか？</DialogTitle>
            <DialogDescription>
              共有したい情報の種類を選んでください。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="justify-start gap-2 text-base py-6"
              onClick={() => { setIsDialogOpen(false); router.push('/form'); }}
            >
              <BookOpen className="h-5 w-5" />
              観戦記を投稿
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2 text-base py-6"
              onClick={() => { setIsDialogOpen(false); router.push('/create-spot?type=spot'); }}
            >
              <MapPin className="h-5 w-5" />
              おススメスポットを投稿
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2 text-base py-6"
              onClick={() => { setIsDialogOpen(false); router.push('/create-spot?type=hotel'); }}
            >
              <BedDouble className="h-5 w-5" />
              宿泊先を投稿
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}