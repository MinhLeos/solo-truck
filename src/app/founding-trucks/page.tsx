import Link from 'next/link';
import type { Metadata } from 'next';
import { CtaAnchor } from '@/components/analytics/CtaAnchor';
import { PublicAnalytics } from '@/components/analytics/public-analytics';
import { siteMetadata } from '@/lib/seo/metadata';
import { SITE_URL } from '@/lib/seo/site';

// TODO: swap once a real domain + inbox is verified (Phase 0.1).
const FOUNDER_EMAIL = 'founder@solotruck.app';

export const metadata: Metadata = siteMetadata({
  title: 'Founding Trucks — Solo Truck',
  description:
    'Apply to the single 20-operator Founding Trucks cohort: 3 months free in exchange for a 15-minute feedback chat each week.',
  path: '/founding-trucks',
  image: `${SITE_URL}/og/site/founding-trucks.png`,
});

const OFFER = [
  '3 months free — no card, no trial countdown',
  'Direct line to the founder — real answers, not a support queue',
  '15 minutes/week telling us what’s broken or missing',
  'Your name (if you want it) as an early Solo Truck customer',
];

export default function FoundingTrucksPage() {
  const mailtoHref = `mailto:${FOUNDER_EMAIL}?subject=${encodeURIComponent(
    'Founding Truck application',
  )}&body=${encodeURIComponent(
    'Truck/business name:\nCity, state:\nHow are you logging temperatures today (paper, nothing, another app)?\nHow did you hear about Founding Trucks (Facebook, LinkedIn, organization name, direct, other)?\n',
  )}`;

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-6 px-6 py-16">
      <PublicAnalytics />
      <div>
        <p className="text-sm font-medium text-flame">Founding Trucks</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink">
          Apply for one of 20 Founding Trucks spots — free for 3 months.
        </h1>
        <p className="mt-3 text-ink-soft">
          We&apos;re selecting up to 20 independent food trucks across all referral sources to use
          Solo Truck daily and tell us, weekly, what actually helps and what gets in the way. In
          exchange: 3 months free and a direct line to the person building it.
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {OFFER.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-ink">
            <span className="text-pass">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <CtaAnchor
        page="founding_trucks"
        href={mailtoHref}
        className="inline-flex items-center justify-center rounded-md bg-flame px-4 py-3 text-center text-sm font-medium text-white hover:bg-flame-deep"
      >
        Apply — email us your truck
      </CtaAnchor>

      <p className="text-xs text-ink-soft">
        Applying does not reserve a spot. If the relevant social/direct or partner allocation is
        full, qualified applicants may be waitlisted. Every application is reviewed and gets a
        real reply from the founder.
      </p>

      <Link href="/guide" className="text-sm font-medium text-flame">
        See how it works first →
      </Link>
    </main>
  );
}
