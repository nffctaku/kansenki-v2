'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { usePostStats } from '@/hooks/usePostStats';
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
  const { totalPosts, publicPosts, loading } = usePostStats();
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
              <Image src="/footballtop-logo-12.png" alt="Football Top Logo" width={140} height={40} />
            </div>
            <div className="hidden dark:block">
              <Image src="/footballtop-logo-13.png" alt="Football Top Logo" width={140} height={40} />
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

          {/* 投稿数統計セクション */}
          <div className="mt-8 px-6 py-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 mx-4 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">サイト統計</h3>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-24">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
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
              onClick={() => { setIsDialogOpen(false); router.push('/create-spot?type=hotel'); }}
            >
              <BedDouble className="h-5 w-5" />
              宿泊先を投稿
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2 text-base py-6"
              onClick={() => { setIsDialogOpen(false); router.push('/create-spot?type=spot'); }}
            >
              <MapPin className="h-5 w-5" />
              おススメスポットを投稿
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}