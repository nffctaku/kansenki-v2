import './globals.css';
import MenuDrawer from './components/MenuDrawer';
import BottomTabBar from './components/BottomTabBar';
import { Analytics } from '@vercel/analytics/react'; // ← 追加！

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>FOOTBALLTOP</title>
      </head>
      <body className="bg-gray-50 text-black">
        <div className="relative min-h-screen">
          <MenuDrawer />
          <main className="pt-16 pb-24">
            {children}
          </main>
          <BottomTabBar />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
