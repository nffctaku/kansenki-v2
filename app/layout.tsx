import './globals.css';
import MenuDrawer from './components/MenuDrawer';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoadingAnimationWrapper } from '@/components/ui/LoadingAnimationWrapper';

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
            <LoadingAnimationWrapper>
              <div className="relative min-h-screen">
                <MenuDrawer />
                <main className="pt-16 pb-24">
                  {children}
                </main>
                <Analytics />
              </div>
            </LoadingAnimationWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
