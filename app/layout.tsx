import './globals.css'; // ✅ Tailwind＋共通スタイルを読み込む
import BottomNav from '@/components/BottomNav'; // ✅ フッタータブを読み込み

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-white text-black min-h-screen pb-20"> {/* ✅ ナビ分の余白 */}
        {children}
        <BottomNav /> {/* ✅ フッタータブを常に表示 */}
      </body>
    </html>
  );
}
