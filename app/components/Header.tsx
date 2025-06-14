'use client';

import MenuDrawer from './MenuDrawer';

export default function Header() {
  return (
    <header className="bg-white px-4 py-4 border-b border-gray-200">
      <div className="flex items-center max-w-screen-xl mx-auto">
        <MenuDrawer />
        
      </div>
    </header>
  );
}
