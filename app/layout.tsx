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
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
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
