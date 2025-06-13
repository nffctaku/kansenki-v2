import './globals.css';
import BottomTabBar from './components/BottomTabBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen pb-32 bg-white text-black">
        {children}
        <BottomTabBar />
      </body>
    </html>
  );
}

