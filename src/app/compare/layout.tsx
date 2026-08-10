import Link from 'next/link';
import type { ReactNode } from 'react';

// Same "no DB, public, one CTA" shape as /tools — see /tools/layout.tsx for
// why the CTA points at /founding-trucks instead of "/".
export default function CompareLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-steel">
      <header className="border-b border-steel-deep bg-card">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-3">
          <span className="font-semibold text-ink">Solo Truck</span>
          <Link href="/founding-trucks" className="text-sm font-medium text-flame">
            Try Solo Truck free →
          </Link>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8">{children}</main>
    </div>
  );
}
