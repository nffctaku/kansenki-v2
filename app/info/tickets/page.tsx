import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: '試合チケット情報 | 観戦記',
  description: '海外サッカーの試合チケット入手方法に関する情報まとめ。プレミアリーグ、ラ・リーガなど、各リーグの観戦チケットガイドはこちら。',
};

const TicketInfoPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            試合チケット情報
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            夢のスタジアム観戦を実現するためのチケット入手ガイド。
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            <Link href="/info/tickets/premier-league">
              <div className="block p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-red-600 dark:text-red-400">プレミアリーグ</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">観戦チケットガイド 2025-26</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            </Link>

            {/* 今後、他のリーグのガイドを追加する際のテンプレート */}
            {/*
            <Link href="#"> // e.g., /info/tickets/la-liga
              <div className="block p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md opacity-50 cursor-not-allowed">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">ラ・リーガ</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">準備中...</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            </Link>
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketInfoPage;
