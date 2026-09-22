import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Flame, TriangleAlert } from 'lucide-react';
import { DangerZoneForm } from './danger-zone-form';
import { ToolCtaLink } from '@/components/tools/ToolCtaLink';
import { ToolViewTracker } from '@/components/tools/ToolViewTracker';
import { siteMetadata } from '@/lib/seo/metadata';
import { SITE_URL } from '@/lib/seo/site';

const TOOL = 'temp-danger-zone-checker';

export const metadata: Metadata = siteMetadata({
  title: 'Temp Danger Zone Checker — Solo Truck',
  description:
    'Free tool: enter a food temperature and how long it’s been sitting out to check if it’s still safe per the FDA Food Code danger zone rule.',
  path: '/tools/temp-danger-zone-checker',
  image: `${SITE_URL}/og/site/tools.png`,
});

export default function TempDangerZoneCheckerPage() {
  return (
    <main className="checker-page">
      <ToolViewTracker tool={TOOL} />
      <header className="checker-header">
        <Link href="/" className="checker-brand"><span><Flame size={17} fill="currentColor" /></span>Solo Truck</Link>
        <Link href="/tools" className="checker-back"><ArrowLeft size={14} /> All tools</Link>
      </header>

      <DangerZoneForm />

      <section className="checker-note">
        <TriangleAlert size={18} />
        <p>
          This is a general FDA Food Code guideline, not a substitute for your local health
          department&apos;s rules — verify with your local health authority.
        </p>
      </section>

      <section className="checker-closing">
        <p>
          Tracking this by memory during a rush is how honest mistakes turn into failed inspections.{' '}
          <ToolCtaLink tool={TOOL} href="/founding-trucks" style={{ color: 'var(--checker-orange)', fontWeight: 700 }}>
            Solo Truck logs every reading in 30 seconds
          </ToolCtaLink>
          , with a timestamp that holds up when an inspector asks.
        </p>
      </section>

      <footer className="checker-footer">
        <span>Free tool by Solo Truck — the 30-second daily compliance log for food trucks.</span>
        <Link href="/founding-trucks">Try Solo Truck free →</Link>
      </footer>
    </main>
  );
}
