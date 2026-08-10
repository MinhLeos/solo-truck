import type { Metadata } from 'next';

// TODO: swap once a real domain + inbox is verified (Phase 0.1).
const FOUNDER_EMAIL = 'founder@solotruck.app';

export const metadata: Metadata = {
  title: 'Founding Trucks — Solo Truck',
  description:
    '3 months free on Solo Truck in exchange for a 15-minute feedback chat each week. 20 spots for the first food trucks on board.',
};

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
    'Truck/business name:\nCity, state:\nHow are you logging temperatures today (paper, nothing, another app)?\n',
  )}`;

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-6 px-6 py-16">
      <div>
        <p className="text-sm font-medium text-flame">Founding Trucks</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink">
          Be one of the first 20 trucks on Solo Truck — free for 3 months.
        </h1>
        <p className="mt-3 text-ink-soft">
          We&apos;re looking for 20 independent food trucks to use Solo Truck daily and tell us,
          weekly, what actually helps and what gets in the way. In exchange: 3 months free and a
          direct line to the person building it.
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

      <a
        href={mailtoHref}
        className="inline-flex items-center justify-center rounded-md bg-flame px-4 py-3 text-center text-sm font-medium text-white hover:bg-flame-deep"
      >
        Apply — email us your truck
      </a>

      <p className="text-xs text-ink-soft">
        No spam, no waitlist black hole — every application gets a real reply from the founder.
      </p>
    </main>
  );
}
