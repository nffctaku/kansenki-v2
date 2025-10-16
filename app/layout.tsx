import './globals.css';
import MenuDrawer from './components/MenuDrawer';

import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>FOOTBALLTOP</title>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative min-h-screen">
              <MenuDrawer />
              <main className="pt-16 pb-24">
                {children}
              </main>

              <Analytics />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
