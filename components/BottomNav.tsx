'use client';

import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex justify-around py-2">
      <NavItem
        label="トップ"
        imgSrc="/tab-home.png"
        active={isActive('/')}
        onClick={() => router.push('/')}
      />
      <NavItem
        label="投稿"
        imgSrc="/tab-plus.png"
        active={isActive('/form')}
        onClick={() => router.push('/form')}
      />
      <NavItem
        label="マイページ"
        imgSrc="/tab-mypage.png"
        active={isActive('/mypage')}
        onClick={() => router.push('/mypage')}
      />
    </div>
  );
}

function NavItem({
  label,
  imgSrc,
  active,
  onClick,
}: {
  label: string;
  imgSrc: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex flex-col items-center text-xs ${active ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
      onClick={onClick}
    >
      <div className="mb-1">
        <Image
          src={imgSrc}
          alt={label}
          width={24}
          height={24}
          className="object-contain"
        />
      </div>
      {label}
    </button>
  );
}

