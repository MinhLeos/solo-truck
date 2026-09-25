import { ArrowRight, Check, Flame, Smartphone } from 'lucide-react'

const installGroups = [
  { device: 'iPhone / iPad (Safari)', steps: ["Open solotruck.app in Safari and sign in.", "A bar at the top says \"Install this app: tap Share, then 'Add to Home Screen'\".", 'Tap the Share icon (square with an arrow) in Safari\'s toolbar.', 'Scroll down and tap \"Add to Home Screen\", then \"Add\".'], screenshot: true },
  { device: 'Android (Chrome)', steps: ['Open solotruck.app in Chrome and sign in.', 'Chrome shows an "Install" button in a bar at the bottom — tap it.', 'Or: tap the ⋮ menu (top right) → "Install app" / "Add to Home screen".'] },
  { device: 'Desktop (Chrome / Edge)', steps: ['Open solotruck.app and sign in.', 'Look for an install icon (a small monitor with a ↓) at the right end of the address bar.', 'Click it, then click "Install". Solo Truck opens in its own window from now on.'] },
]

const dailySteps = [
  ['Log a temperature in 30 seconds', 'Tap an equipment card, punch in the number on the big numpad, tap Save. That\'s it — no typing on a tiny keyboard.'],
  ['Out of range? Fix it, don\'t hide it', 'If a reading is outside the safe range, Solo Truck stops you and asks what you did about it — moved the food, adjusted the thermostat, called for repair. Inspectors trust an honest log with a corrective action far more than a suspiciously perfect one.'],
  ["Today's board, at a glance", 'Every piece of equipment shows its last reading, the time, and a ✓ or ⚠ — so you know at a glance what still needs checking today.'],
  ['Pre-shift checklist', 'Run through the standard pre-shift checks before you open — hand sink stocked, sanitizer at the right concentration, permits present. Tap to check each one off.'],
  ['History — nothing ever disappears', 'Every log stays on record, even the ones you got wrong. Made a mistake? Add a new entry explaining it — the old one stays visible, just marked. Nothing gets edited or deleted after the fact.'],
  ["Documents that don't expire quietly", 'Keep your health permit, commissary agreement, food manager certificate, and insurance in one place, with expiry reminders.'],
  ['Inspector Mode — one tap, ready to show', 'When an inspector shows up, open Inspector Mode: a clean read-only view of the last 30 or 90 days — logs, checklists, documents — plus a PDF export or a 24-hour read-only link you can share.'],
  ['Billing, when you\'re ready', 'Every account starts with a 14-day free trial. Subscribe monthly or yearly whenever you\'re ready — reading your own data and exporting it is never blocked, even if a subscription lapses.'],
]

export default function GuidePage() {
  return <main className="guide-page">
    <header className="guide-header"><a className="guide-brand" href="/"><span className="guide-mark"><Flame size={17} fill="currentColor" /></span>Solo Truck</a><a className="guide-header-link" href="/founding-trucks">Try Solo Truck free <ArrowRight size={15} /></a></header>
    <section className="guide-hero"><p className="guide-eyebrow">Getting started</p><h1>Install Solo Truck and log your first temperature in a few minutes.</h1><p>Solo Truck works best installed on your home screen, like an app — it opens instantly and keeps logging even with no signal in the kitchen. Here&apos;s how to get set up, and what the day-to-day looks like.</p></section>
    <section className="guide-section guide-install"><div className="guide-section-heading"><p className="guide-eyebrow">01 / Setup</p><h2>Install on your device</h2></div><div className="install-grid">{installGroups.map((group, index) => <article className="install-card" key={group.device}><div className="guide-card-top"><span className="guide-number">0{index + 1}</span><Smartphone size={18} /></div><h3>{group.device}</h3><ol>{group.steps.map(step => <li key={step}>{step}</li>)}</ol>{group.screenshot && <div className="guide-shot" aria-label="Screenshot placeholder" />}</article>)}</div></section>
    <section className="guide-section guide-day"><div className="guide-section-heading"><p className="guide-eyebrow">02 / In practice</p><h2>How Solo Truck works, day to day</h2></div><div className="daily-list">{dailySteps.map(([title, body], index) => <article className="daily-step" key={title}><div className="daily-index">{String(index + 1).padStart(2, '0')}</div><div><h3>{title}</h3><p>{body}</p></div><div className="daily-check"><Check size={15} /></div>{<div className="guide-shot guide-shot-small" aria-label="Screenshot placeholder" />}</article>)}</div></section>
    <section className="guide-closing"><p className="guide-eyebrow">Ready when you are</p><h2>Ready to try it on your own truck?</h2><a className="guide-button" href="/founding-trucks">Apply for Founding Trucks — 3 months free <ArrowRight size={16} /></a><a className="guide-signin" href="/login">Already have an account? Sign in <ArrowRight size={14} /></a></section>
    <footer className="guide-footer">Solo Truck is a record-keeping tool, not legal or food-safety advice, and does not guarantee passing an inspection.</footer>
  </main>
}

