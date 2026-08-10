import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solo Truck vs. FoodDocs — when you have outgrown us',
  description:
    'FoodDocs is built for restaurant chains: sensors, staff training, multi-location dashboards, $169+/month. Solo Truck is built for one truck, one owner.',
};

export default function CompareFoodDocsPage() {
  return (
    <article className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-flame">Solo Truck vs. FoodDocs</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink">
          Built for one truck, not a restaurant chain.
        </h1>
      </div>

      <p className="text-ink-soft">
        FoodDocs is a real, capable platform — Bluetooth sensors, staff training modules,
        multi-location dashboards, the works. That&apos;s exactly right for a chain with a
        compliance manager and a budget. It&apos;s also $169+/month and more setup than a solo
        owner running one truck needs or wants.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-steel-deep p-4">
          <h2 className="font-semibold text-ink">FoodDocs</h2>
          <p className="mt-1 text-sm text-ink-soft">$169+/month — built for chains</p>
          <ul className="mt-3 flex flex-col gap-1 text-sm text-ink-soft">
            <li>✓ Bluetooth sensor integration</li>
            <li>✓ Staff training + multi-location</li>
            <li>✗ Overkill for a 1-3 person truck</li>
            <li>✗ Setup and training overhead</li>
          </ul>
        </div>
        <div className="rounded-lg border border-flame p-4">
          <h2 className="font-semibold text-ink">Solo Truck</h2>
          <p className="mt-1 text-sm text-ink-soft">$24/month — built for one truck</p>
          <ul className="mt-3 flex flex-col gap-1 text-sm text-ink-soft">
            <li>✓ Set up in 5 minutes, no training</li>
            <li>✓ Works offline in a metal box with weak signal</li>
            <li>✓ No sensors to buy or pair</li>
            <li>✗ No multi-location dashboard (yet)</li>
          </ul>
        </div>
      </div>

      <p className="text-ink-soft">
        If you&apos;re opening truck #2 or #3 and need a manager overseeing compliance across
        locations, FoodDocs is the right tool and we&apos;d say so. If it&apos;s still you, on one
        truck, logging with one thumb between orders — that&apos;s exactly who Solo Truck is
        built for.
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
