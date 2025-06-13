// components/BottomTabBar.tsx
'use client';

export default function BottomTabBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-md">
      <button className="text-xs text-gray-600">🏠 ホーム</button>
      <button className="text-xs text-gray-600">🔍 みつける</button>
      <button className="text-xs text-gray-600">✏️ 投稿</button>
      <button className="text-xs text-gray-600">🔔 通知</button>
      <button className="text-xs text-gray-600">👤 マイページ</button>
    </div>
  );
}
