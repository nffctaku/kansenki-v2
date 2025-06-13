import './globals.css';
import BottomTabBar from './components/BottomTabBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>FOOTBALLTOP</title>
      </head>
     <body className="relative min-h-screen pb-32 bg-white text-black">
        {children}
        <BottomTabBar />
      </body>

    </html>
  );
}

