import type { Metadata } from 'next';
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
    <div className="flex flex-col gap-4">
      <ToolViewTracker tool={TOOL} />
      <div>
        <h1 className="text-xl font-semibold text-ink">Temp Danger Zone Checker</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Food between 40°F and 140°F is in the &quot;danger zone&quot; — bacteria grow fastest
          here. The FDA Food Code gives you 2 hours (1 on a hot day) before it&apos;s no longer
          safe to serve.
        </p>
      </div>

      <DangerZoneForm />

      <p className="mt-4 text-sm text-ink-soft">
        Tracking this by memory during a rush is how honest mistakes turn into failed inspections.{' '}
        <ToolCtaLink tool={TOOL} href="/founding-trucks" className="font-medium text-flame">
          Solo Truck logs every reading in 30 seconds
        </ToolCtaLink>
        , with a timestamp that holds up when an inspector asks.
      </p>
    </div>
  );
}
