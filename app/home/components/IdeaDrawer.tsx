'use client';

import Link from 'next/link';

type Widget = {
  title: string;
  items: { label: string; href?: string }[];
};

type Props = {
  widgets: Widget[];
  isOpen: boolean;
  onToggle: () => void;
};

export default function IdeaDrawer({ widgets, isOpen, onToggle }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <div className="text-sm font-bold text-gray-100">構想案（時事ネタなど）</div>
        <div className="text-xs font-semibold text-white/70">{isOpen ? '閉じる' : '開く'}</div>
      </button>

      {isOpen && (
        <div className="px-3 pb-3">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {widgets.map((widget) => (
              <div key={widget.title} className="bg-white/10 rounded-2xl shadow p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-bold text-gray-100">{widget.title}</div>
                  <div className="text-xs text-white/60">MENU</div>
                </div>

                {widget.items.length > 0 ? (
                  <div className="space-y-2">
                    {widget.items.map((item) =>
                      item.href ? (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="block rounded-xl px-3 py-2 text-sm bg-white/10 text-gray-100 hover:bg-white/15 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <div
                          key={item.label}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-sm bg-white/10 text-gray-200"
                        >
                          <span className="truncate">{item.label}</span>
                          <span className="ml-2 text-xs text-white/60">準備中</span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl px-3 py-2 text-sm bg-white/10 text-white/70">準備中</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
