import './globals.css';
import MenuDrawer from './components/MenuDrawer';
import BottomTabBar from './components/BottomTabBar';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './components/ThemeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>FOOTBALLTOP</title>
      </head>
      <body className="bg-gray-50 text-black dark:bg-black dark:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">
            <MenuDrawer />
            <main className="pt-16 pb-24">
              {children}
            </main>
            <BottomTabBar />
            <Analytics />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
