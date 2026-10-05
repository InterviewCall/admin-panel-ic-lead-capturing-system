'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, ReactNode } from 'react';

const NAV_ITEMS = [
  { href: '/form-builder', label: 'Form Builder' },
  { href: '/submissions', label: 'Submissions' },
  { href: '/bookings', label: 'Bookings' },
];

type AdminShellProps = {
  children: ReactNode;
};

const AdminShell: FC<AdminShellProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-(--builder-bg) text-(--builder-text)">
      <header className="mx-auto flex w-[min(1280px,94%)] flex-wrap items-center justify-between gap-4 py-5">
        <div className="flex flex-wrap items-center gap-7">
          <Link href="/" className="text-[22px] font-black tracking-[-0.5px] text-[#020617]">
            Interview<span className="text-(--builder-blue)">Call</span>
          </Link>

          <nav aria-label="Admin sections" className="flex flex-wrap gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={clsx(
                    'inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold transition',
                    isActive
                      ? 'bg-[#0f172a] text-white'
                      : 'text-(--builder-muted) hover:bg-slate-100',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="rounded-full bg-[#dcfce7] px-4 py-2 text-[13px] font-black text-[#166534]">
          Admin Panel
        </div>
      </header>

      <main className="mx-auto flex w-[min(1280px,94%)] flex-col gap-5 pb-14">
        {children}
      </main>
    </div>
  );
};

export default AdminShell;
