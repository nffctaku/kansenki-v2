'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function BottomTabBar() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        zIndex: 9999,
        borderTop: '1px solid #e5e7eb',
        pointerEvents: 'none',

      }}
    >
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
    <div
      style={{
        background: 'transparent',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#6b7280',
        fontSize: '11px',
        cursor: href ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 4,
        }}
      >
        <Image
          src={icon}
          alt={label}
          width={20}
          height={20}
          style={{
            objectFit: 'contain',
            opacity: 0.8,
            filter: 'grayscale(30%)',
          }}
        />
      </div>
      <span>{label}</span>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
