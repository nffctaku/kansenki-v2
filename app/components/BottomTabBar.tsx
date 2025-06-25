'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function BottomTabBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-gray-200 bg-white px-5 py-2.5">
      <Tab icon="/tab-mypage.png" label="ホーム" href="/" />
      <Tab icon="/新聞のフリーアイコン.png" label="特集" />
      <Tab icon="/tab-plus.png" label="投稿" href="/form" />
      <Tab icon="/チケットのフリーアイコン6.png" label="観戦情報" />
      <Tab icon="/位置情報アイコン4.png" label="マイページ" href="/mypage" />
    </div>
  );
}

type TabProps = {
  icon: string;
  label: string;
  href?: string;
};

function Tab({ icon, label, href }: TabProps) {
  const content = (
    <>
      <div className="mb-1 flex h-7 w-7 items-center justify-center">
        <Image
          src={icon}
          alt={label}
          width={20}
          height={20}
          className="object-contain opacity-80 grayscale-[30%]"
        />
      </div>
      <span>{label}</span>
    </>
  );

  const commonClasses =
    'flex flex-col items-center border-none bg-transparent text-[11px] text-gray-500';

  return href ? (
    <Link href={href} className={`${commonClasses} cursor-pointer`}>
      {content}
    </Link>
  ) : (
    <div className={`${commonClasses} cursor-default`}>{content}</div>
  );
}
