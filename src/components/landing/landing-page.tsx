import { Fragment } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, CircleCheck, FileText, Flame, Radio, ShieldCheck, Thermometer, WifiOff, Zap, Minus } from 'lucide-react';
import { NavMenu } from '@/components/paper/nav-menu';
import { FaqList } from './faq-list';
import { CtaLink } from '@/components/analytics/CtaLink';
import { buildFaqSchema } from '@/lib/seo/faq-schema';
import { SITE_URL } from '@/lib/seo/site';

const PAIN_CARDS = [
  {
    stamp: 'Every routine inspection',
    title: 'Paperwork first, fridge second',
    body: "Before an inspector opens a single cooler, they ask for your logs — and most expect 30–90 days of history. A soggy, half-filled clipboard is the fastest way to turn a routine visit into a deep dig.",
  },
  {
    stamp: 'Inspectors know this trick',
    title: '"Perfect" logs get you flagged',
    body: "A column of 38°F written in the same pen, five minutes before the inspector walked up? They've seen it a thousand times. Fake-perfect paper logs invite scrutiny. Honest ones with corrective actions pass.",
  },
  {
    stamp: 'One bad day',
    title: 'Failing costs more than a fine',
    body: "A cooler that quietly died overnight can mean $500 of product in the trash, a failing grade, and your truck's name in the local paper. The trucks that survive catch it at 44°F — not 49°F.",
  },
];

const STEPS = [
  {
    time: '~2 min · before you open',
    title: 'Run the pre-shift check',
    body: 'Tap through the 12 things inspectors actually look for — hand sink stocked, sanitizer at strength, raw below ready-to-eat, tanks tight. Open the window knowing you’d pass right now.',
  },
  {
    time: '~30 sec · a few times a day',
    title: 'Log temps as you cook',
    body: "Tap the fridge, punch the number, done. Out of range? The app asks what you did about it — moved food, adjusted the dial, tossed it — and saves the fix with the reading. No signal needed; it syncs later.",
  },
  {
    time: '1 tap · when it counts',
    title: 'Hand over Inspector Mode',
    body: 'Inspector at the window? One tap opens a clean, read-only report: 90 days of logs, checklists, permits, and corrective actions. Export a PDF on the spot if they want paper.',
  },
];

const FEATURES = [
  {
    title: 'Works with zero bars',
    body: "Log inside your steel box with no signal. Everything queues on your phone and syncs the moment you're back online — nothing is ever lost.",
  },
  {
    title: "Timestamps you can't fake",
    body: "Every entry is stamped the second you save it and can't be edited after the fact. That's not a limitation — that's what makes your records worth trusting.",
  },
  {
    title: 'Corrective actions, guided',
    body: 'Out-of-range readings walk you through the fix and attach it to the log — the exact paper trail inspectors respect most.',
  },
  {
    title: 'Permit & document vault',
    body: 'Permits, commissary agreement, food manager cert — photographed once, always on hand, with a heads-up 30 days before anything expires.',
  },
  {
    title: 'Reminders that respect your day',
    body: 'Nudges during your service hours only. Day off? Total silence. Your streak counter turns compliance into a habit you’ll actually keep.',
  },
  {
    title: 'Your data, always yours',
    body: 'Export everything to PDF or CSV any time. Even if you cancel, you can still read and export your records. No hostages here.',
  },
];

const COMPARE_ROWS = [
  ['Daily digital temp logs', 'Paper sheets to print', 'Yes — 30 sec/entry', 'Yes'],
  ['Works offline in the truck', '—', 'Yes, built for it', 'Varies'],
  ['One-tap inspector report', '—', 'Yes + PDF on the spot', 'Yes'],
  ['Setup time', 'Minutes', '5 minutes', 'Days + training'],
  ['Built for a 1–3 person truck', 'Partly', 'Entirely', 'No — chains & kitchens'],
  ['Price', '~$50–100 once', '$24/month', '$169+/month'],
];

const PRICING_PLANS = [
  { name: 'Monthly', price: '$24', period: '/month', note: 'Unlimited logs & checklists', highlight: false },
  { name: 'Yearly', price: '$190', period: '/year', note: 'Save 34% vs. monthly', highlight: true },
];

const FAQS = [
  {
    q: 'Will my inspector actually accept digital logs?',
    a: "Many health departments do, as long as you can pull them up on the spot — which is exactly what Inspector Mode is for. Some still prefer paper, so every report exports to a clean PDF you can print. Requirements vary by county; always verify with your local health authority.",
  },
  {
    q: 'What if I have no signal at my spot?',
    a: "That's the normal case, not the edge case. Solo Truck saves every log on your phone instantly and syncs when you're back in coverage. You'll see exactly what's waiting to sync — nothing disappears.",
  },
  {
    q: 'Do I need to buy sensors or special thermometers?',
    a: 'No. Use the probe thermometer you already own. You read it, you tap it in, done. No hardware to buy, pair, or replace.',
  },
  {
    q: 'Can I fix a log if I typed the wrong number?',
    a: "Yes — you add a correction with a note, and both entries stay visible. Records can't be silently edited or deleted, because that's precisely what makes them credible when an inspector is looking at them.",
  },
  {
    q: 'Is this a HACCP plan?',
    a: "No — and that's on purpose. If you need a HACCP plan or binder, tools exist for that (and they're good). Solo Truck is what happens after setup: the daily logging that keeps your operation inspection-ready, every single shift.",
  },
  {
    q: 'What happens to my records if I cancel?',
    a: "You keep read access and can export everything to PDF or CSV, forever. We don't hold your compliance history hostage — it's yours.",
  },
];

const TICKER_ITEMS = [
  { ok: true, text: '06:58 AM — Pre-shift checklist complete (12/12)' },
  { ok: true, text: '07:15 AM — Walk-in fridge 38.1°F' },
  { ok: false, text: '11:02 AM — Prep fridge 44.1°F → moved food, adjusted dial' },
  { ok: true, text: '11:26 AM — Prep fridge 39.8°F — back in range' },
  { ok: true, text: '02:30 PM — Hot hold 139°F' },
  { ok: true, text: '04:47 PM — Inspector Mode opened · 90-day report exported' },
];

const SOFTWARE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Solo Truck',
  url: SITE_URL,
  description:
    'Daily temperature logs, pre-shift checklists, corrective actions, and one-tap Inspector Mode for independent food trucks.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: [
    { '@type': 'Offer', name: 'Monthly', price: '24', priceCurrency: 'USD' },
    { '@type': 'Offer', name: 'Yearly', price: '190', priceCurrency: 'USD' },
  ],
};

const FAQ_SCHEMA = buildFaqSchema(FAQS.map((faq) => ({ question: faq.q, answer: faq.a })));

const FEATURE_ICONS = [WifiOff, Radio, ShieldCheck, FileText, Zap, Check];

const INCLUDED = [
  'Unlimited temp logs & checklists',
  'Inspector Mode + PDF export',
  'Document vault with expiry alerts',
  'Offline logging & sync',
  'Email support from a real human',
];

function TempRow({ name, time, temp, flagged = false }: { name: string; time: string; temp: string; flagged?: boolean }) {
  return (
    <div className={`temp-row ${flagged ? 'flagged' : ''}`}>
      <span className="status-dot" />
      <div>
        <strong>{name}</strong>
        <small>{time}</small>
      </div>
      <div className="temp-reading">
        <b>{temp}</b>
        <small>{flagged ? 'Action' : 'In range'}</small>
      </div>
    </div>
  );
}

function Brand({ href = '#top' }: { href?: string }) {
  return (
    <a href={href} className="brand" aria-label="Solo Truck home">
      <span className="brand-mark"><Flame size={19} fill="currentColor" /></span>
      Solo Truck
    </a>
  );
}

export function LandingPage() {
  return (
    <div className="landing-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-0 focus:top-0 focus:z-100 focus:bg-[#1a1b1a] focus:px-[18px] focus:py-2.5 focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <header className="site-nav">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <CtaLink page="landing_nav" href="/signup" className="button button-dark nav-cta">
          Start free trial <ArrowRight size={16} />
        </CtaLink>
        <NavMenu buttonClassName="mobile-menu">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <Link href="/signup">Start free trial</Link>
        </NavMenu>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" />For independent food trucks · US</p>
            <h1>
              The inspector<br />doesn&apos;t call ahead.<br /><em>Be ready anyway.</em>
            </h1>
            <p className="hero-sub">
              Solo Truck replaces the greasy clipboard on your fridge. Log temps in 30 seconds, catch
              problems before they cost you product, and hand any inspector 90 days of honest,
              time-stamped records — in one tap.
            </p>
            <div className="hero-actions">
              <CtaLink page="landing_hero" href="/signup" className="button button-flame">
                Start your free trial <ArrowRight size={17} />
              </CtaLink>
              <a href="#how" className="button button-outline">See how it works</a>
            </div>
            <p className="microcopy"><Check size={14} />14-day free trial · No credit card · Works offline</p>
          </div>

          <div className="hero-visual">
            <div className="inspection-stamp" role="img" aria-label="Inspection result placard showing Passed">
              <CircleCheck size={16} /> A — INSPECTION<br /><strong>PASSED</strong>
            </div>
            <div
              className="phone"
              role="img"
              aria-label="App screen showing today's temperature logs: walk-in fridge 37.4 degrees in range, hot hold 141 degrees in range, prep fridge 44.1 degrees needs corrective action, with a 23-day logging streak"
            >
              <div aria-hidden>
                <div className="phone-top"><span>9:41</span><span>▮▮▮ ◉</span></div>
                <div className="phone-screen">
                  <div className="screen-head">
                    <div>
                      <span className="screen-label">Logs</span>
                      <strong>Today</strong>
                    </div>
                    <span className="sync"><span /> SYNCED</span>
                  </div>
                  <div className="streak">
                    <Flame size={18} fill="currentColor" /> <strong>23-day streak</strong><span>↗</span>
                  </div>
                  <div className="temp-list">
                    <TempRow name="Walk-in fridge" time="Logged 10:42 AM" temp="37.4°F" />
                    <TempRow name="Hot hold — chili" time="Logged 10:44 AM" temp="141°F" />
                    <TempRow name="Prep fridge" time="Logged 10:45 AM" temp="44.1°F" flagged />
                  </div>
                  <div className="temp-button"><Thermometer size={20} />Log a temp <ArrowRight size={17} /></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="ticker" aria-hidden>
          <div className="ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <Fragment key={i}>
                {item.text} {!item.ok && <b>(flagged)</b>}
                <span>◆</span>
              </Fragment>
            ))}
          </div>
        </div>

        <section className="section paper-section" id="how" aria-labelledby="pain-title">
          <div className="section-intro">
            <p className="eyebrow">Sound familiar?</p>
            <h2 id="pain-title">Paper logs are where<br /><em>good trucks go to fail.</em></h2>
          </div>
          <div className="story-grid">
            {PAIN_CARDS.map((card) => (
              <article className="story-card" key={card.title}>
                <span className="card-stamp">{card.stamp}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <Minus size={21} />
              </article>
            ))}
          </div>
        </section>

        <section className="truth-panel" aria-labelledby="truth-title">
          <div className="truth-copy">
            <p className="eyebrow mint">The part nobody tells you</p>
            <h2 id="truth-title">Honest logs pass.<br /><em>We make honest<br />the easy way.</em></h2>
            <p>
              Solo Truck doesn&apos;t help you look perfect — it helps you prove you&apos;re paying
              attention. Every entry gets a real timestamp the moment you tap save, even with zero
              signal inside your steel box. Caught a temp out of range? The app walks you through the
              corrective action and attaches it to the record. That&apos;s exactly the story inspectors
              want to see.
            </p>
          </div>
          <blockquote>
            <span>“</span>&quot;If it isn&apos;t documented, you didn&apos;t do it.&quot;
            <footer>
              Temperature logs are the first records most health inspectors review — and a log that
              shows a problem plus the fix reads better than a log that&apos;s suspiciously spotless.
            </footer>
          </blockquote>
        </section>

        <section className="section steps-section" aria-labelledby="how-title">
          <div className="section-intro">
            <p className="eyebrow">Built for a hot kitchen and one free hand</p>
            <h2 id="how-title">Three habits.<br /><em>Thirty seconds each.</em></h2>
          </div>
          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <article className="step" key={step.title}>
                <span className="step-number">{String(i + 1).padStart(2, '0')}</span>
                <p className="step-meta">{step.time}</p>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section feature-section" id="features" aria-labelledby="feat-title">
          <div className="section-intro centered">
            <p className="eyebrow">Everything you need. Nothing you don&apos;t.</p>
            <h2 id="feat-title">Built for one truck,<br /><em>not a restaurant chain.</em></h2>
            <p>
              No sensors to buy. No staff training day. No 40-page setup. If you can text, you can run
              Solo Truck.
            </p>
          </div>
          <div className="feature-grid">
            {FEATURES.map((feat, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <article className="feature-card" key={feat.title}>
                  <Icon size={22} />
                  <h3>{feat.title}</h3>
                  <p>{feat.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section compare-section" aria-labelledby="compare-title">
          <div className="section-intro">
            <p className="eyebrow">Where Solo Truck fits</p>
            <h2 id="compare-title">The missing <em>middle.</em></h2>
            <p>
              Binder generators set you up, then leave you with paper. Enterprise platforms start at
              $169/month and assume you have a staff. You need the layer in between.
            </p>
          </div>
          <div className="comparison" role="table" aria-label="Comparison of food safety tools for food trucks">
            <div className="compare-row compare-head" role="row">
              {['What you need', 'Binder generators', 'Solo Truck', 'Enterprise platforms'].map((h) => (
                <span key={h} role="columnheader">{h}</span>
              ))}
            </div>
            {COMPARE_ROWS.map((row) => (
              <div className="compare-row" role="row" key={row[0]}>
                {row.map((cell, i) => (
                  <span className={i === 2 ? 'solo-cell' : ''} role={i === 0 ? 'rowheader' : 'cell'} key={i}>
                    {cell}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <p className="caption">
            Already have a HACCP binder? Great — keep it. Solo Truck is what keeps it alive between
            inspections.
          </p>
        </section>

        <section className="section pricing-section" id="pricing" aria-labelledby="price-title">
          <div className="section-intro centered">
            <p className="eyebrow">Pricing</p>
            <h2 id="price-title">Less than one failed<br /><em>batch of chili.</em></h2>
          </div>
          <div className="plans">
            {PRICING_PLANS.map((plan) => (
              <article className={`plan ${plan.highlight ? 'featured' : ''}`} key={plan.name}>
                {plan.highlight && <span className="popular">BEST VALUE</span>}
                <p className="plan-title">{plan.name}</p>
                <h3>{plan.price}{plan.period}</h3>
                <p>{plan.note}</p>
                <CtaLink
                  page="landing_pricing"
                  href="/signup"
                  className={`button ${plan.highlight ? 'button-flame' : 'button-outline'}`}
                >
                  Start free trial <ArrowRight size={16} />
                </CtaLink>
              </article>
            ))}
          </div>
          <div className="included">
            {INCLUDED.map((item) => (
              <span key={item}><Check size={15} />{item}</span>
            ))}
          </div>
          <p className="pricing-note">
            14-day free trial · No credit card required ·{' '}
            <CtaLink page="landing_pricing" href="/pricing">Full pricing details</CtaLink>
          </p>
        </section>

        <section className="cta-section" id="start" aria-labelledby="start-title">
          <p className="eyebrow">Ready when you are</p>
          <h2 id="start-title">Start logging in<br /><em>5 minutes.</em></h2>
          <p>
            14 days free, no credit card. Set up your truck, log your first temp, and see for
            yourself whether it fits your shift.
          </p>
          <div className="hero-actions">
            <CtaLink page="landing_start" href="/signup" className="button button-light">
              Start your free trial <ArrowRight size={17} />
            </CtaLink>
            <CtaLink page="landing_start" href="/founding-trucks" className="button button-ghost">
              Or apply for Founding Trucks — 3 months free
            </CtaLink>
          </div>
          <small>
            Founding Trucks: one cohort of up to 20 accepted trucks gets 3 months free + a direct
            line to the founder, in exchange for 15 minutes of feedback a week.
          </small>
        </section>

        <section className="section faq-section" id="faq" aria-labelledby="faq-title">
          <div className="section-intro">
            <p className="eyebrow">Questions</p>
            <h2 id="faq-title">Fair questions,<br /><em>straight answers.</em></h2>
          </div>
          <FaqList items={FAQS} />
        </section>
      </main>

      <footer className="footer">
        <div>
          <Brand />
          <p>Inspector-proof daily logs for independent food trucks.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <CtaLink page="landing_footer" href="/signup">Start free trial</CtaLink>
          <CtaLink page="landing_footer" href="/founding-trucks">Founding Trucks</CtaLink>
          <Link href="/guide">Guide</Link>
        </nav>
        <p className="legal">
          Solo Truck is a record-keeping tool, not legal or food-safety advice, and does not
          guarantee inspection outcomes. Default thresholds follow the FDA Food Code; actual
          requirements vary by state and county — always verify with your local health authority. ©
          2026 Solo Truck.
        </p>
      </footer>
    </div>
  );
}
