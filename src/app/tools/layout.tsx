import Link from 'next/link';
import type { ReactNode } from 'react';

// /tools iron rules (MARKETING-PLAN.md §2 kênh B, ported from Solo Sitter's
// TOOLS-PLAN.md §2): no DB, no imports from src/app/(app)/ or any product
// business logic — only shared pure UI (@/components/ui) — one CTA per
// tool pointed at /founding-trucks, and brand transparency in the footer.
// "/" isn't usable as the CTA target here: RootPage redirects it straight
// to /today, which the auth middleware then bounces to /login for anyone
// without a session — a dead end for an anonymous tool visitor.
export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-steel">
      <header className="border-b border-steel-deep bg-card">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-3">
          <span className="font-semibold text-ink">Solo Truck</span>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/tools" className="text-ink-soft hover:text-ink">
              All tools
            </Link>
            <Link href="/founding-trucks" className="font-medium text-flame">
              Try Solo Truck free →
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8">{children}</main>

      <footer className="border-t border-steel-deep bg-card px-4 py-6 text-center text-sm text-ink-soft">
        <p>Free tool by Solo Truck — the 30-second daily compliance log for food trucks.</p>
        <Link href="/founding-trucks" className="mt-2 inline-block font-medium text-flame">
          Try Solo Truck free →
        </Link>
      </footer>
    </div>
  );
}
