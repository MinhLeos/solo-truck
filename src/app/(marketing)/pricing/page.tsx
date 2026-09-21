import type { Metadata } from 'next';
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
    <article className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-wide text-ink">
          One truck, one flat price
        </h1>
        <p className="mt-3 text-ink-soft">
          No per-employee fees, no per-log fees, no enterprise sales call. $24/month or $190/year
          — same features either way. Every account starts with a 14-day free trial, no card
          required.
        </p>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-5 max-[520px]:grid-cols-1">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-[20px] p-8 text-center ${plan.highlight ? 'border-t-[6px] border-flame bg-ink text-white' : 'border border-steel-deep bg-white text-ink'}`}
          >
            <p className={`font-mono text-sm uppercase tracking-wide ${plan.highlight ? 'text-led' : 'text-flame-deep'}`}>
              {plan.name}
            </p>
            <div className={`mt-2 font-display text-5xl font-extrabold leading-none ${plan.highlight ? 'text-white' : 'text-ink'}`}>
              {plan.price}
              <small className={`text-lg font-semibold ${plan.highlight ? 'text-[#AEB8BF]' : 'text-ink-soft'}`}>
                {plan.period}
              </small>
            </div>
            <p className={`mt-2 text-sm ${plan.highlight ? 'text-[#AEB8BF]' : 'text-ink-soft'}`}>{plan.note}</p>
            <div className="mt-6">
              <CtaLink
                page="pricing"
                href="/signup"
                className={`inline-block w-full rounded-[10px] px-6 py-3 text-base font-semibold transition-transform active:scale-[.98] ${plan.highlight ? 'bg-flame text-white hover:bg-flame-deep' : 'bg-ink text-white hover:bg-black'}`}
              >
                Start free trial
              </CtaLink>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-8 font-display text-2xl font-bold uppercase tracking-wide text-ink">
        What&apos;s included, at every price
      </h2>
      <ul className="flex flex-col gap-1.5">
        {FEATURES.map((feature) => (
          <li key={feature} className="text-ink-soft before:mr-2 before:font-bold before:text-pass before:content-['✓']">
            {feature}
          </li>
        ))}
      </ul>

      <h2 className="mt-8 font-display text-2xl font-bold uppercase tracking-wide text-ink">
        What Solo Truck never does
      </h2>
      <p className="text-ink-soft">
        No per-staff pricing, no sensor add-on fees, no locked-in contract. Cancel any time — you
        keep read access and can export everything, whether or not you&apos;re still subscribed.
      </p>

      <p className="mt-4 text-ink-soft">
        Already talked to us and want a hand getting set up?{' '}
        <CtaLink page="pricing" href="/founding-trucks" className="font-medium text-flame">
          See what Founding Trucks get
        </CtaLink>{' '}
        — 3 months free in exchange for weekly feedback, limited to one 20-truck cohort across all
        referral sources.
      </p>
    </article>
  );
}
