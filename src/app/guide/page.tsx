import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { siteMetadata } from '@/lib/seo/metadata';
import { ArrowRight, Check, Flame, Smartphone } from 'lucide-react';

export const metadata: Metadata = siteMetadata({
  title: 'Getting started — Solo Truck',
  description:
    'How to install Solo Truck on your phone or computer, and a walkthrough of the daily flow: logging temperatures, checklist, history, documents, and Inspector Mode.',
  path: '/guide',
});

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
    title: 'Log a temperature in 30 seconds',
    body: "Tap an equipment card, punch in the number on the big numpad, tap Save. That's it — no typing on a tiny keyboard.",
    screenshot: { src: '/guide/02-numpad.png', alt: 'Numpad for entering a temperature reading' },
  },
  {
    title: 'Out of range? Fix it, don’t hide it',
    body: 'If a reading is outside the safe range, Solo Truck stops you and asks what you did about it — moved the food, adjusted the thermostat, called for repair. Inspectors trust an honest log with a corrective action far more than a suspiciously perfect one.',
    screenshot: { src: '/guide/03-corrective-action.png', alt: 'Corrective action sheet after an out-of-range temperature reading' },
  },
  {
    title: "Today's board, at a glance",
    body: 'Every piece of equipment shows its last reading, the time, and a ✓ or ⚠ — so you know at a glance what still needs checking today.',
    screenshot: { src: '/guide/04-today-logged.png', alt: 'Today screen showing equipment cards with logged temperatures' },
  },
  {
    title: 'Pre-shift checklist',
    body: 'Run through the standard pre-shift checks before you open — hand sink stocked, sanitizer at the right concentration, permits present. Tap to check each one off.',
    screenshot: { src: '/guide/06-checklist-progress.png', alt: 'Pre-shift checklist with some items checked off' },
  },
  {
    title: 'History — nothing ever disappears',
    body: 'Every log stays on record, even the ones you got wrong. Made a mistake? Add a new entry explaining it — the old one stays visible, just marked. Nothing gets edited or deleted after the fact.',
    screenshot: { src: '/guide/07-history.png', alt: 'History screen listing past temperature logs' },
  },
  {
    title: 'Documents that don’t expire quietly',
    body: 'Keep your health permit, commissary agreement, food manager certificate, and insurance in one place, with expiry reminders.',
    screenshot: { src: '/guide/08-documents.png', alt: 'Documents screen for uploading permits and certificates' },
  },
  {
    title: 'Inspector Mode — one tap, ready to show',
    body: 'When an inspector shows up, open Inspector Mode: a clean read-only view of the last 30 or 90 days — logs, checklists, documents — plus a PDF export or a 24-hour read-only link you can share.',
    screenshot: { src: '/guide/09-inspector.png', alt: 'Inspector Mode showing a table of temperature logs and an export button' },
  },
  {
    title: 'Billing, when you’re ready',
    body: 'Every account starts with a 14-day free trial. Subscribe monthly or yearly whenever you’re ready — reading your own data and exporting it is never blocked, even if a subscription lapses.',
    screenshot: { src: '/guide/11-billing.png', alt: 'Billing screen showing trial status and subscribe options' },
  },
];

export default function GuidePage() {
  return (
    <main className="guide-page">
      <header className="guide-header">
        <Link className="guide-brand" href="/">
          <span className="guide-mark"><Flame size={17} fill="currentColor" /></span>
          Solo Truck
        </Link>
        <Link className="guide-header-link" href="/founding-trucks">
          Try Solo Truck free <ArrowRight size={15} />
        </Link>
      </header>

      <section className="guide-hero">
        <p className="guide-eyebrow">Getting started</p>
        <h1>Install Solo Truck and log your first temperature in a few minutes.</h1>
        <p>
          Solo Truck works best installed on your home screen, like an app — it opens
          instantly and keeps logging even with no signal in the kitchen. Here&apos;s how to
          get set up, and what the day-to-day looks like.
        </p>
      </section>

      <section className="guide-section guide-install">
        <div className="guide-section-heading">
          <h2>Install on your device</h2>
        </div>
        <div className="install-grid">
          {INSTALL_STEPS.map((group, index) => (
            <article className="install-card" key={group.device}>
              <div className="guide-card-top">
                <span className="guide-number">0{index + 1}</span>
                <Smartphone size={18} />
              </div>
              <h3>{group.device}</h3>
              <ol>
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
                  className="guide-screenshot"
                />
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="guide-section guide-day">
        <div className="guide-section-heading">
          <h2>How Solo Truck works, day to day</h2>
        </div>
        <div className="daily-list">
          {WALKTHROUGH.map((step, index) => (
            <article className="daily-step" key={step.title}>
              <div className="daily-index">{index + 1}.</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
              <div className="daily-check"><Check size={15} /></div>
              <Image
                src={step.screenshot.src}
                alt={step.screenshot.alt}
                width={390}
                height={844}
                className="guide-screenshot"
              />
            </article>
          ))}
        </div>
      </section>

      <section className="guide-closing">
        <h2>Ready to try it on your own truck?</h2>
        <Link className="guide-button" href="/founding-trucks">
          Apply for Founding Trucks — 3 months free <ArrowRight size={16} />
        </Link>
        <Link className="guide-signin" href="/login">
          Already have an account? Sign in →
        </Link>
      </section>

      <footer className="guide-footer">
        Solo Truck is a record-keeping tool, not legal or food-safety advice, and does not
        guarantee passing an inspection.
      </footer>
    </main>
  );
}
