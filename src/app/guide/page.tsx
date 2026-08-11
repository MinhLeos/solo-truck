import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Getting started — Solo Truck',
  description:
    'How to install Solo Truck on your phone or computer, and a walkthrough of the daily flow: logging temperatures, checklist, history, documents, and Inspector Mode.',
};

const INSTALL_STEPS = [
  {
    device: 'iPhone / iPad (Safari)',
    steps: [
      'Open solotruck.app in Safari and sign in.',
      'A bar at the top says "Install this app: tap Share, then \'Add to Home Screen\'".',
      'Tap the Share icon (square with an arrow) in Safari\'s toolbar.',
      'Scroll down and tap "Add to Home Screen", then "Add".',
    ],
    screenshot: { src: '/guide/12-install-ios-hint.png', alt: 'Solo Truck showing the iOS install hint bar at the top of the screen' },
  },
  {
    device: 'Android (Chrome)',
    steps: [
      'Open solotruck.app in Chrome and sign in.',
      'Chrome shows an "Install" button in a bar at the bottom — tap it.',
      'Or: tap the ⋮ menu (top right) → "Install app" / "Add to Home screen".',
    ],
  },
  {
    device: 'Desktop (Chrome / Edge)',
    steps: [
      'Open solotruck.app and sign in.',
      'Look for an install icon (a small monitor with a ↓) at the right end of the address bar.',
      'Click it, then click "Install". Solo Truck opens in its own window from now on.',
    ],
  },
];

const WALKTHROUGH = [
  {
    title: '1. Log a temperature in 30 seconds',
    body: "Tap an equipment card, punch in the number on the big numpad, tap Save. That's it — no typing on a tiny keyboard.",
    screenshot: { src: '/guide/02-numpad.png', alt: 'Numpad for entering a temperature reading' },
  },
  {
    title: '2. Out of range? Fix it, don’t hide it',
    body: 'If a reading is outside the safe range, Solo Truck stops you and asks what you did about it — moved the food, adjusted the thermostat, called for repair. Inspectors trust an honest log with a corrective action far more than a suspiciously perfect one.',
    screenshot: { src: '/guide/03-corrective-action.png', alt: 'Corrective action sheet after an out-of-range temperature reading' },
  },
  {
    title: "3. Today's board, at a glance",
    body: 'Every piece of equipment shows its last reading, the time, and a ✓ or ⚠ — so you know at a glance what still needs checking today.',
    screenshot: { src: '/guide/04-today-logged.png', alt: 'Today screen showing equipment cards with logged temperatures' },
  },
  {
    title: '4. Pre-shift checklist',
    body: 'Run through the standard pre-shift checks before you open — hand sink stocked, sanitizer at the right concentration, permits present. Tap to check each one off.',
    screenshot: { src: '/guide/06-checklist-progress.png', alt: 'Pre-shift checklist with some items checked off' },
  },
  {
    title: '5. History — nothing ever disappears',
    body: 'Every log stays on record, even the ones you got wrong. Made a mistake? Add a new entry explaining it — the old one stays visible, just marked. Nothing gets edited or deleted after the fact.',
    screenshot: { src: '/guide/07-history.png', alt: 'History screen listing past temperature logs' },
  },
  {
    title: '6. Documents that don’t expire quietly',
    body: 'Keep your health permit, commissary agreement, food manager certificate, and insurance in one place, with expiry reminders.',
    screenshot: { src: '/guide/08-documents.png', alt: 'Documents screen for uploading permits and certificates' },
  },
  {
    title: '7. Inspector Mode — one tap, ready to show',
    body: 'When an inspector shows up, open Inspector Mode: a clean read-only view of the last 30 or 90 days — logs, checklists, documents — plus a PDF export or a 24-hour read-only link you can share.',
    screenshot: { src: '/guide/09-inspector.png', alt: 'Inspector Mode showing a table of temperature logs and an export button' },
  },
  {
    title: '8. Billing, when you’re ready',
    body: 'Every account starts with a 14-day free trial. Subscribe monthly or yearly whenever you’re ready — reading your own data and exporting it is never blocked, even if a subscription lapses.',
    screenshot: { src: '/guide/11-billing.png', alt: 'Billing screen showing trial status and subscribe options' },
  },
];

export default function GuidePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-steel">
      <header className="border-b border-steel-deep bg-card">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-3">
          <span className="font-semibold text-ink">Solo Truck</span>
          <Link href="/founding-trucks" className="text-sm font-medium text-flame">
            Try Solo Truck free →
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-12 px-4 py-10">
        <div>
          <p className="text-sm font-medium text-flame">Getting started</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink">
            Install Solo Truck and log your first temperature in a few minutes.
          </h1>
          <p className="mt-3 text-ink-soft">
            Solo Truck works best installed on your home screen, like an app — it opens
            instantly and keeps logging even with no signal in the kitchen. Here&apos;s how to
            get set up, and what the day-to-day looks like.
          </p>
        </div>

        <section className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold text-ink">Install on your device</h2>
          {INSTALL_STEPS.map((group) => (
            <div key={group.device} className="rounded-lg border border-steel-deep bg-card p-4">
              <p className="font-medium text-ink">{group.device}</p>
              <ol className="mt-2 flex list-decimal flex-col gap-1 pl-5 text-sm text-ink-soft">
                {group.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              {group.screenshot && (
                <Image
                  src={group.screenshot.src}
                  alt={group.screenshot.alt}
                  width={390}
                  height={844}
                  className="mt-3 w-full max-w-[280px] rounded-lg border border-steel-deep"
                />
              )}
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-8">
          <h2 className="text-lg font-semibold text-ink">How Solo Truck works, day to day</h2>
          {WALKTHROUGH.map((step) => (
            <div key={step.title} className="flex flex-col gap-3">
              <p className="font-medium text-ink">{step.title}</p>
              <p className="text-sm text-ink-soft">{step.body}</p>
              <Image
                src={step.screenshot.src}
                alt={step.screenshot.alt}
                width={390}
                height={844}
                className="w-full max-w-[320px] rounded-lg border border-steel-deep"
              />
            </div>
          ))}
        </section>

        <div className="flex flex-col items-start gap-3 rounded-lg border border-steel-deep bg-card p-4">
          <p className="font-medium text-ink">Ready to try it on your own truck?</p>
          <Link
            href="/founding-trucks"
            className="inline-flex items-center justify-center rounded-md bg-flame px-4 py-3 text-center text-sm font-medium text-white hover:bg-flame-deep"
          >
            Apply for Founding Trucks — 3 months free →
          </Link>
          <Link href="/login" className="text-sm font-medium text-flame">
            Already have an account? Sign in →
          </Link>
        </div>

        <p className="text-xs text-ink-soft">
          Solo Truck is a record-keeping tool, not legal or food-safety advice, and does not
          guarantee passing an inspection.
        </p>
      </main>
    </div>
  );
}
