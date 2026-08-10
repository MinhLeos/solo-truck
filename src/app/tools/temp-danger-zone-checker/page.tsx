import Link from 'next/link';
import type { Metadata } from 'next';
import { DangerZoneForm } from './danger-zone-form';

export const metadata: Metadata = {
  title: 'Temp Danger Zone Checker — Solo Truck',
  description:
    'Free tool: enter a food temperature and how long it’s been sitting out to check if it’s still safe per the FDA Food Code danger zone rule.',
};

export default function TempDangerZoneCheckerPage() {
  return (
    <div className="flex flex-col gap-4">
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
        <Link href="/founding-trucks" className="font-medium text-flame">
          Solo Truck logs every reading in 30 seconds
        </Link>
        , with a timestamp that holds up when an inspector asks.
      </p>
    </div>
  );
}
