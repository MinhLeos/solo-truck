import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solo Truck vs. AuditBinder — which one do you actually need?',
  description:
    'AuditBinder sets up your HACCP plan and paperwork once. Solo Truck logs your daily temps and checklists. Most trucks end up needing both.',
};

export default function CompareAuditBinderPage() {
  return (
    <article className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-flame">Solo Truck vs. AuditBinder</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink">
          Got your HACCP binder? Great — now keep it alive.
        </h1>
      </div>

      <p className="text-ink-soft">
        AuditBinder is good at what it does: a one-time $47-97 tool that generates your HACCP
        plan, CCP tables, SOPs, and a printable log sheet. It sets you up on day one. What it
        doesn&apos;t do is log anything for you after that — the binder just sits on the truck.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-steel-deep p-4">
          <h2 className="font-semibold text-ink">AuditBinder</h2>
          <p className="mt-1 text-sm text-ink-soft">Day 0 setup — one-time</p>
          <ul className="mt-3 flex flex-col gap-1 text-sm text-ink-soft">
            <li>✓ HACCP plan generated for you</li>
            <li>✓ Printable log sheets</li>
            <li>✗ No daily logging — paper stays paper</li>
            <li>✗ No corrective action tracking</li>
            <li>✗ No inspector-ready 90-day view</li>
          </ul>
        </div>
        <div className="rounded-lg border border-flame p-4">
          <h2 className="font-semibold text-ink">Solo Truck</h2>
          <p className="mt-1 text-sm text-ink-soft">Every shift, from day 1 onward</p>
          <ul className="mt-3 flex flex-col gap-1 text-sm text-ink-soft">
            <li>✓ 30-second temp + checklist logging</li>
            <li>✓ Corrective actions required on out-of-range readings</li>
            <li>✓ Inspector Mode: 90 days, one tap</li>
            <li>✗ Doesn&apos;t write your HACCP plan for you</li>
          </ul>
        </div>
      </div>

      <p className="text-ink-soft">
        Honestly? Most trucks end up wanting both — AuditBinder to get the paperwork right once,
        Solo Truck to prove, every day after, that you&apos;re actually following it. A binder an
        inspector can&apos;t see updated daily doesn&apos;t answer the question they actually ask:
        &quot;show me today&apos;s log.&quot;
      </p>

      <Link
        href="/founding-trucks"
        className="inline-flex w-fit items-center justify-center rounded-md bg-flame px-4 py-3 text-sm font-medium text-white hover:bg-flame-deep"
      >
        Try Solo Truck free →
      </Link>
    </article>
  );
}
