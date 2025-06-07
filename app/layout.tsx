import './globals.css'; // ✅ Tailwind＋共通スタイルを読み込む

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-white text-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
