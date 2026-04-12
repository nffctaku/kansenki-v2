'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, User, Users, CalendarDays } from 'lucide-react';
import type { ComponentType } from 'react';

type TabItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

const tabs: TabItem[] = [
  { label: 'ホーム', href: '/home', icon: Home },
  { label: 'タイムライン', href: '/timeline', icon: LayoutGrid },
  { label: '日本代表', href: '/players', icon: Users },
  { label: 'イベント', href: '/events', icon: CalendarDays },
  { label: 'プロフィール', href: '/mypage', icon: User },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto grid max-w-xl grid-cols-5 px-2 py-2">
        {tabs.map((t) => {
          const active = pathname === t.href || (t.href !== '/' && pathname?.startsWith(`${t.href}/`));
          const Icon = t.icon;

          return (
            <Link
              key={t.href}
              href={t.href}
              className={
                `flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition-colors ` +
                (active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white/80')
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold leading-none">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
