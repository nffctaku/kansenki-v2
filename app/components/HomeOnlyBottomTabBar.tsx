'use client';

import { usePathname } from 'next/navigation';
import BottomTabBar from './BottomTabBar';

export default function HomeOnlyBottomTabBar() {
  const pathname = usePathname();

  if (pathname !== '/home' && pathname !== '/timeline') return null;

  return <BottomTabBar />;
}
