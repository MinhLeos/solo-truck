import type { ReactNode } from 'react';
import Link from 'next/link';
import { barlow, barlowCondensed, ibmPlexMono } from '@/components/landing/fonts';
import { PublicAnalytics } from '@/components/analytics/public-analytics';

// Shared shell for the simple public content pages (about, privacy, terms)
// — the landing page at src/app/page.tsx stays separate since its
// hero/nav/JSON-LD don't apply here. Same brand fonts as the landing page,
// scoped to this route group only (rest of the app uses Geist).
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${barlow.variable} ${barlowCondensed.variable} ${ibmPlexMono.variable} font-landing-body flex min-h-dvh flex-col text-[17px] leading-relaxed text-ink`}
    >
      <PublicAnalytics />
      <header className="border-b border-steel-deep bg-white">
        <div className="mx-auto flex h-16 w-full max-w-[820px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 font-display text-2xl font-extrabold uppercase tracking-wide">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink font-mono text-xs text-led" aria-hidden>
              °F
            </span>
            Solo&nbsp;Truck
          </Link>
          <Link href="/signup" className="rounded-[10px] bg-flame px-4 py-2 text-sm font-semibold text-white hover:bg-flame-deep">
            Start free trial
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[820px] flex-1 px-6 py-14">{children}</main>

      <footer className="border-t border-steel-deep bg-ink py-10 text-sm text-[#AEB8BF]">
        <div className="mx-auto flex w-full max-w-[820px] flex-wrap justify-between gap-4 px-6">
          <span>© 2026 Solo Truck.</span>
          <nav className="flex flex-wrap gap-5">
            <Link href="/about" className="text-[#DDE3E7]">About</Link>
            <Link href="/pricing" className="text-[#DDE3E7]">Pricing</Link>
            <Link href="/privacy" className="text-[#DDE3E7]">Privacy</Link>
            <Link href="/terms" className="text-[#DDE3E7]">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
