import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Flame, ShieldCheck } from 'lucide-react';
import { NavMenu } from '@/components/paper/nav-menu';
import { CtaLink } from '@/components/analytics/CtaLink';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = siteMetadata({
  title: 'Pricing — Solo Truck',
  description:
    'One flat price for one truck: $24/month or $190/year. Unlimited logs, checklists, and Inspector Mode. 14-day free trial, no card required.',
  path: '/pricing',
});

const PLANS = [
  { name: 'Monthly', price: '$24', period: '/month', note: 'Cancel any time.', highlight: false },
  { name: 'Yearly', price: '$190', period: '/year', note: 'Save 34% vs. paying monthly.', highlight: true },
];

const FEATURES = [
  'Unlimited temperature logs & checklists — no per-entry or per-truck limits',
  'Corrective actions with photo attachments',
  'Inspector Mode: one-tap read-only report, PDF export on the spot',
  'Document vault for permits, commissary agreement, certs — with expiry alerts',
  'Offline logging & sync — built for zero bars inside a steel truck',
  'Export everything to PDF/CSV, any time, even after you cancel',
  'Email support from the person actually building it',
];

export default function PricingPage() {
  return (
    <main className="pricing-page">
      <header className="pricing-nav">
        <Link href="/" className="pricing-brand"><span><Flame size={17} fill="currentColor" /></span>Solo Truck</Link>
        <nav className="pricing-links">
          <Link href="/#how">How it works</Link>
          <Link href="/#features">Features</Link>
          <Link className="active" href="/pricing">Pricing</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
        <CtaLink page="pricing_nav" href="/signup" className="pricing-nav-cta">
          Start free trial <ArrowRight size={15} />
        </CtaLink>
        <NavMenu buttonClassName="pricing-menu">
          <Link href="/#how">How it works</Link>
          <Link href="/#features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/#faq">FAQ</Link>
        </NavMenu>
      </header>

      <section className="pricing-hero">
        <h1>One truck,<br /><em>one flat price.</em></h1>
        <p className="pricing-lede">
          No per-employee fees, no per-log fees, no enterprise sales call. $24/month or $190/year
          — same features either way. Every account starts with a 14-day free trial, no card
          required.
        </p>
      </section>

      <section className="pricing-plans" id="plans">
        {PLANS.map((plan) => (
          <article className={`pricing-plan ${plan.highlight ? 'recommended' : ''}`} key={plan.name}>
            {plan.highlight && <span className="recommended-badge">RECOMMENDED <span>✦</span></span>}
            <p className="plan-label">{plan.name}</p>
            <h2>{plan.price}{plan.period}</h2>
            <p className="plan-detail">{plan.note}</p>
            <CtaLink
              page="pricing"
              href="/signup"
              className={`plan-button ${plan.highlight ? 'orange-button' : ''}`}
            >
              Start free trial <ArrowRight size={16} />
            </CtaLink>
            <p className="plan-trial"><Check size={14} />14-day free trial · No card required</p>
          </article>
        ))}
      </section>

      <section className="included-section">
        <div className="included-heading">
          <h2>What&apos;s included,<br /><em>at every price.</em></h2>
        </div>
        <div className="included-list">
          {FEATURES.map((feature, index) => (
            <div className="included-item" key={feature}>
              <span className="included-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="included-check"><Check size={17} strokeWidth={3} /></span>
              <p>{feature}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="never-section">
        <div className="never-icon"><ShieldCheck size={27} /></div>
        <div>
          <h2>What Solo Truck <em>never does.</em></h2>
          <p className="never-copy">
            No per-staff pricing, no sensor add-on fees, no locked-in contract. Cancel any time — you
            keep read access and can export everything, whether or not you&apos;re still subscribed.
          </p>
        </div>
      </section>

      <section className="founding-section">
        <p>
          <span>
            Already talked to us and want a hand getting set up?{' '}
            <CtaLink page="pricing" href="/founding-trucks">See what Founding Trucks get</CtaLink>{' '}
            — 3 months free in exchange for weekly feedback, limited to one 20-truck cohort across
            all referral sources.
          </span>
        </p>
      </section>

      <footer className="pricing-footer">
        <Link href="/" className="pricing-brand"><span><Flame size={17} fill="currentColor" /></span>Solo Truck</Link>
        <p>Inspector-proof daily logs for independent food trucks.</p>
        <Link href="/#faq">Questions? Read the FAQ <ArrowRight size={14} /></Link>
      </footer>
    </main>
  );
}
