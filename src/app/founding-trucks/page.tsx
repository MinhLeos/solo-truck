import Link from 'next/link';
import { ArrowRight, Check, Flame, Mail } from 'lucide-react';
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
    <main className="founding-page">
      <PublicAnalytics />
      <div className="founding-grid" aria-hidden="true" />
      <header className="founding-header">
        <Link className="founding-brand" href="/">
          <span><Flame size={16} fill="currentColor" /></span>
          Solo Truck
        </Link>
        <span className="founding-status"><i />20 spots only</span>
      </header>

      <section className="founding-hero">
        <p className="founding-eyebrow"><span />Founding Trucks</p>
        <h1>
          Apply for one of 20 Founding Trucks spots — <em>free for 3 months.</em>
        </h1>
        <p className="founding-subtext">
          We&apos;re selecting up to 20 independent food trucks across all referral sources to use
          Solo Truck daily and tell us, weekly, what actually helps and what gets in the way. In
          exchange: 3 months free and a direct line to the person building it.
        </p>

        <div className="founding-card">
          <div className="founding-card-top"><span>What you get</span><b>01 — 04</b></div>
          <ul>
            {OFFER.map((item) => (
              <li key={item}><span><Check size={15} strokeWidth={3} /></span>{item}</li>
            ))}
          </ul>
          <CtaAnchor page="founding_trucks" href={mailtoHref} className="founding-cta">
            <Mail size={18} />Apply — email us your truck<ArrowRight size={17} />
          </CtaAnchor>
          <p className="founding-note">
            Applying does not reserve a spot. If the relevant social/direct or partner allocation is
            full, qualified applicants may be waitlisted. Every application is reviewed and gets a
            real reply from the founder.
          </p>
        </div>

        <Link href="/guide" className="founding-secondary">See how it works first <span>→</span></Link>
      </section>

      <footer className="founding-footer"><span>SOLO TRUCK / 2026</span><span>Built for the people on the line.</span></footer>
    </main>
  );
}
