import Link from 'next/link';
import { barlow, barlowCondensed, ibmPlexMono } from './fonts';
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

function SectionEyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`mb-3 font-mono text-[13px] tracking-[1.5px] uppercase text-flame-deep ${className}`}>
      {children}
    </p>
  );
}

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

export function LandingPage() {
  return (
    <div
      className={`${barlow.variable} ${barlowCondensed.variable} ${ibmPlexMono.variable} font-landing-body text-[17px] leading-relaxed text-ink`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-0 focus:top-0 focus:z-100 focus:rounded-br-lg focus:bg-ink focus:px-[18px] focus:py-2.5 focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b border-steel-deep bg-white/92 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
          <a href="#" aria-label="Solo Truck home" className="flex items-center gap-2.5 font-display text-[26px] font-extrabold uppercase tracking-wide">
            <span className="grid h-[34px] w-[34px] place-items-center rounded-lg bg-ink font-mono text-[13px] text-led" aria-hidden>
              °F
            </span>
            Solo&nbsp;Truck
          </a>
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-7 max-[640px]:gap-0">
              <li className="max-[640px]:hidden">
                <a href="#how" className="text-[15px] font-medium text-ink-soft hover:text-ink">How it works</a>
              </li>
              <li className="max-[640px]:hidden">
                <a href="#features" className="text-[15px] font-medium text-ink-soft hover:text-ink">Features</a>
              </li>
              <li className="max-[640px]:hidden">
                <a href="#pricing" className="text-[15px] font-medium text-ink-soft hover:text-ink">Pricing</a>
              </li>
              <li className="max-[640px]:hidden">
                <a href="#faq" className="text-[15px] font-medium text-ink-soft hover:text-ink">FAQ</a>
              </li>
              <li>
                <CtaLink page="landing_nav" href="/signup" className="inline-block rounded-[10px] bg-flame px-[18px] py-2.5 text-[15px] font-semibold text-white transition-transform active:scale-[.98] hover:bg-flame-deep">
                  Start free trial
                </CtaLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main">
        {/* HERO */}
        <section className="overflow-hidden border-b border-steel-deep bg-steel">
          <div className="mx-auto grid max-w-[1120px] grid-cols-[1.05fr_.95fr] items-center gap-12 px-6 py-18 max-[960px]:grid-cols-1 max-[960px]:gap-14 max-[960px]:py-14">
            <div>
              <span className="mb-[18px] inline-block rounded-md bg-warn-bg px-3 py-1.5 font-mono text-[13px] uppercase tracking-wide text-flame-deep">
                For independent food trucks · US
              </span>
              <h1 className="font-display text-[clamp(44px,6vw,74px)] font-extrabold uppercase leading-[.98] tracking-wide">
                The inspector
                <br />
                doesn&apos;t call ahead.
                <br />
                <span className="text-flame">Be ready anyway.</span>
              </h1>
              <p className="mt-[22px] max-w-[34em] text-xl text-ink-soft">
                Solo Truck replaces the greasy clipboard on your fridge. Log temps in 30 seconds, catch
                problems before they cost you product, and hand any inspector 90 days of honest,
                time-stamped records — in one tap.
              </p>
              <div className="mt-[30px] flex flex-wrap items-center gap-3.5">
                <CtaLink page="landing_hero" href="/signup" className="rounded-[10px] bg-flame px-[26px] py-[13px] text-base font-semibold text-white transition-transform active:scale-[.98] hover:bg-flame-deep">
                  Start your free trial
                </CtaLink>
                <a href="#how" className="rounded-[10px] border-2 border-ink px-[26px] py-[13px] text-base font-semibold text-ink transition-transform active:scale-[.98] hover:bg-ink hover:text-white">
                  See how it works
                </a>
              </div>
              <p className="mt-3.5 font-mono text-sm text-ink-soft">
                14-day free trial · No credit card · Works offline
              </p>
            </div>

            <div className="relative flex justify-center max-[960px]:order-2">
              <div
                className="absolute -right-2 -top-4.5 rotate-6 rounded-xl border-[3px] border-pass-deep bg-white px-[18px] py-3.5 text-center shadow-[0_12px_30px_rgba(21,24,27,.18)] max-[640px]:right-1"
                role="img"
                aria-label="Inspection result placard showing Passed"
              >
                <div className="font-display text-[44px] font-extrabold leading-none text-pass-deep">A</div>
                <div className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">Inspection · Passed</div>
              </div>
              <div
                className="w-[300px] rounded-[36px] bg-ink p-3.5 shadow-[0_24px_60px_rgba(21,24,27,.28)]"
                role="img"
                aria-label="App screen showing today's temperature logs: walk-in fridge 37.4 degrees in range, hot hold 141 degrees in range, prep fridge 44.1 degrees needs corrective action, with a 23-day logging streak"
              >
                <div className="rounded-[26px] bg-[#1C2126] p-3.5 text-white" aria-hidden>
                  <div className="mb-3.5 flex items-center justify-between">
                    <span className="font-display text-xl font-bold uppercase tracking-wide">Today</span>
                    <span className="rounded-full bg-[#2A3138] px-2.5 py-1 font-mono text-xs text-led">🔥 23-day streak</span>
                  </div>
                  <div className="mb-2.5 flex items-center justify-between rounded-xl border-l-4 border-pass bg-[#242B31] px-3.5 py-3">
                    <div>
                      <div className="text-sm font-semibold">Walk-in fridge</div>
                      <div className="mt-0.5 font-mono text-[11px] text-[#8B959D]">Logged 10:42 AM</div>
                    </div>
                    <div>
                      <span className="font-mono text-[22px] font-medium text-led">37.4°F</span>
                      <span className="ml-2 rounded-md bg-pass/20 px-2 py-0.5 text-[11px] font-semibold text-[#7FE0BD]">In range</span>
                    </div>
                  </div>
                  <div className="mb-2.5 flex items-center justify-between rounded-xl border-l-4 border-pass bg-[#242B31] px-3.5 py-3">
                    <div>
                      <div className="text-sm font-semibold">Hot hold — chili</div>
                      <div className="mt-0.5 font-mono text-[11px] text-[#8B959D]">Logged 10:44 AM</div>
                    </div>
                    <div>
                      <span className="font-mono text-[22px] font-medium text-led">141°F</span>
                      <span className="ml-2 rounded-md bg-pass/20 px-2 py-0.5 text-[11px] font-semibold text-[#7FE0BD]">In range</span>
                    </div>
                  </div>
                  <div className="mb-2.5 flex items-center justify-between rounded-xl border-l-4 border-flame bg-[#242B31] px-3.5 py-3">
                    <div>
                      <div className="text-sm font-semibold">Prep fridge</div>
                      <div className="mt-0.5 font-mono text-[11px] text-[#8B959D]">Logged 10:45 AM</div>
                    </div>
                    <div>
                      <span className="font-mono text-[22px] font-medium text-[#FF9C7A]">44.1°F</span>
                      <span className="ml-2 rounded-md bg-flame/20 px-2 py-0.5 text-[11px] font-semibold text-[#FF9C7A]">Action</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="mt-1.5 w-full rounded-xl bg-flame py-3.5 font-display text-lg font-bold uppercase tracking-wide text-white"
                  >
                    Log a temp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div className="overflow-hidden whitespace-nowrap border-b-4 border-flame bg-ink py-2.5 font-mono text-[13px] text-led" aria-hidden>
          <div className="motion-reduce:animate-none inline-block animate-[landing-ticker_36s_linear_infinite] pl-[100%] motion-reduce:pl-6">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="mr-14">
                {item.ok ? (
                  <span className="text-[#7FE0BD]">✓ </span>
                ) : (
                  <span className="text-[#FF9C7A]">⚠ </span>
                )}
                {item.text}
              </span>
            ))}
          </div>
        </div>

        {/* PAIN */}
        <section className="bg-white py-22" aria-labelledby="pain-title">
          <div className="mx-auto max-w-[1120px] px-6">
            <SectionEyebrow>Sound familiar?</SectionEyebrow>
            <h2 id="pain-title" className="max-w-[18em] font-display text-[clamp(32px,4vw,48px)] font-extrabold uppercase leading-[1.04] tracking-wide">
              Paper logs are where good trucks go to fail
            </h2>
            <div className="mt-11 grid grid-cols-3 gap-5.5 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1">
              {PAIN_CARDS.map((card) => (
                <article key={card.title} className="rounded-[14px] border-t-4 border-flame bg-steel p-7">
                  <span className="mb-3 inline-block rounded-md bg-warn-bg px-2.5 py-1 font-mono text-xs text-flame-deep">
                    {card.stamp}
                  </span>
                  <h3 className="mb-2.5 font-display text-2xl font-bold uppercase tracking-wide">{card.title}</h3>
                  <p className="text-base text-ink-soft">{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TRUTH */}
        <section className="bg-ink py-22 text-white" aria-labelledby="truth-title">
          <div className="mx-auto grid max-w-[1120px] grid-cols-2 items-center gap-10 px-6 max-[960px]:grid-cols-1">
            <div>
              <SectionEyebrow>The part nobody tells you</SectionEyebrow>
              <h2 id="truth-title" className="max-w-[18em] font-display text-[clamp(32px,4vw,48px)] font-extrabold uppercase leading-[1.04] tracking-wide text-white">
                Honest logs pass. We make honest the easy way.
              </h2>
              <p className="mt-4 max-w-[40em] text-lg text-[#AEB8BF]">
                Solo Truck doesn&apos;t help you look perfect — it helps you prove you&apos;re paying
                attention. Every entry gets a real timestamp the moment you tap save, even with zero
                signal inside your steel box. Caught a temp out of range? The app walks you through the
                corrective action and attaches it to the record. That&apos;s exactly the story inspectors
                want to see.
              </p>
            </div>
            <blockquote className="rounded-r-[14px] border-l-4 border-flame bg-[#20262C] p-6.5 font-mono text-[15px] leading-loose text-[#C9D2D8]">
              &quot;If it isn&apos;t documented, you didn&apos;t do it.&quot;
              <br />
              <br />
              Temperature logs are the <strong className="font-medium text-led">first records</strong> most
              health inspectors review — and a log that shows a problem{' '}
              <strong className="font-medium text-led">plus the fix</strong> reads better than a log
              that&apos;s suspiciously spotless.
            </blockquote>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="bg-steel py-22" aria-labelledby="how-title">
          <div className="mx-auto max-w-[1120px] px-6">
            <SectionEyebrow>Built for a hot kitchen and one free hand</SectionEyebrow>
            <h2 id="how-title" className="max-w-[18em] font-display text-[clamp(32px,4vw,48px)] font-extrabold uppercase leading-[1.04] tracking-wide">
              Three habits. Thirty seconds each.
            </h2>
            <div className="mt-11 grid grid-cols-3 gap-5.5 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1">
              {STEPS.map((step) => (
                <article key={step.title} className="rounded-[14px] border border-steel-deep bg-white p-7.5">
                  <span className="mb-3.5 inline-block rounded-md bg-pass-bg px-2.5 py-1 font-mono text-[13px] text-pass-deep">
                    {step.time}
                  </span>
                  <h3 className="mb-2 font-display text-2xl font-bold uppercase tracking-wide">{step.title}</h3>
                  <p className="text-base text-ink-soft">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-22" aria-labelledby="feat-title">
          <div className="mx-auto max-w-[1120px] px-6">
            <SectionEyebrow>Everything you need. Nothing you don&apos;t.</SectionEyebrow>
            <h2 id="feat-title" className="max-w-[18em] font-display text-[clamp(32px,4vw,48px)] font-extrabold uppercase leading-[1.04] tracking-wide">
              Built for one truck, not a restaurant chain
            </h2>
            <p className="mt-4 max-w-[40em] text-lg text-ink-soft">
              No sensors to buy. No staff training day. No 40-page setup. If you can text, you can run
              Solo Truck.
            </p>
            <div className="mt-11 grid grid-cols-3 gap-5 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1">
              {FEATURES.map((feat) => (
                <div key={feat.title} className="rounded-[14px] border border-steel-deep p-6">
                  <h3 className="mb-1.5 flex items-center gap-2.5 text-lg font-semibold">
                    <span className="h-2.5 w-2.5 flex-none rounded-full bg-pass" aria-hidden />
                    {feat.title}
                  </h3>
                  <p className="text-[15px] text-ink-soft">{feat.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARE */}
        <section className="bg-steel py-22" aria-labelledby="compare-title">
          <div className="mx-auto max-w-[1120px] px-6">
            <SectionEyebrow>Where Solo Truck fits</SectionEyebrow>
            <h2 id="compare-title" className="max-w-[18em] font-display text-[clamp(32px,4vw,48px)] font-extrabold uppercase leading-[1.04] tracking-wide">
              The missing middle
            </h2>
            <p className="mt-4 max-w-[40em] text-lg text-ink-soft">
              Binder generators set you up, then leave you with paper. Enterprise platforms start at
              $169/month and assume you have a staff. You need the layer in between.
            </p>
            <table className="mt-11 w-full border-separate border-spacing-0 overflow-hidden rounded-[14px] border border-steel-deep bg-white">
              <caption className="sr-only">Comparison of food safety tools for food trucks</caption>
              <thead>
                <tr>
                  <th scope="col" className="bg-ink px-4.5 py-4 text-left font-display text-lg uppercase tracking-wide text-white">
                    What you need
                  </th>
                  <th scope="col" className="bg-ink px-4.5 py-4 text-left font-display text-lg uppercase tracking-wide text-white">
                    Binder generators
                  </th>
                  <th scope="col" className="bg-flame px-4.5 py-4 text-left font-display text-lg uppercase tracking-wide text-white">
                    Solo Truck
                  </th>
                  <th scope="col" className="bg-ink px-4.5 py-4 text-left font-display text-lg uppercase tracking-wide text-white">
                    Enterprise platforms
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={row[0]} className={i === COMPARE_ROWS.length - 1 ? '' : 'border-b border-steel-deep'}>
                    <th scope="row" className="px-4.5 py-4 text-left text-[15px] font-medium">
                      {row[0]}
                    </th>
                    <td className="border-b border-steel-deep px-4.5 py-4 text-[15px]">{row[1]}</td>
                    <td className="border-b border-steel-deep bg-warn-bg px-4.5 py-4 text-[15px] font-semibold">
                      {row[2]}
                    </td>
                    <td className="border-b border-steel-deep px-4.5 py-4 text-[15px]">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3.5 font-mono text-sm text-ink-soft">
              Already have a HACCP binder? Great — keep it. Solo Truck is what keeps it alive between
              inspections.
            </p>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-22" aria-labelledby="price-title">
          <div className="mx-auto max-w-[1120px] px-6">
            <SectionEyebrow>Pricing</SectionEyebrow>
            <h2 id="price-title" className="max-w-[18em] font-display text-[clamp(32px,4vw,48px)] font-extrabold uppercase leading-[1.04] tracking-wide">
              Less than one failed batch of chili
            </h2>
            <div className="mx-auto mt-11 grid max-w-[760px] grid-cols-2 gap-6 max-[640px]:grid-cols-1">
              {PRICING_PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-[20px] p-9 text-center ${plan.highlight ? 'border-t-[6px] border-flame bg-ink text-white' : 'border border-steel-deep bg-white text-ink'}`}
                >
                  <p className={`font-mono text-sm uppercase tracking-wide ${plan.highlight ? 'text-led' : 'text-flame-deep'}`}>
                    {plan.name}
                  </p>
                  <div className={`mt-2 font-display text-[52px] font-extrabold leading-none ${plan.highlight ? 'text-white' : 'text-ink'}`}>
                    {plan.price}
                    <small className={`text-lg font-semibold ${plan.highlight ? 'text-[#AEB8BF]' : 'text-ink-soft'}`}>
                      {plan.period}
                    </small>
                  </div>
                  <p className={`mt-2 font-mono text-sm ${plan.highlight ? 'text-[#AEB8BF]' : 'text-ink-soft'}`}>{plan.note}</p>
                  <div className="mt-6">
                    <CtaLink
                      page="landing_pricing"
                      href="/signup"
                      className={`inline-block w-full rounded-[10px] px-[26px] py-[13px] text-base font-semibold transition-transform active:scale-[.98] ${plan.highlight ? 'bg-flame text-white hover:bg-flame-deep' : 'bg-ink text-white hover:bg-black'}`}
                    >
                      Start free trial
                    </CtaLink>
                  </div>
                </div>
              ))}
            </div>
            <ul className="mx-auto mt-8 flex max-w-[520px] flex-col gap-1.5">
              {[
                'Unlimited temp logs & checklists',
                'Inspector Mode + PDF export',
                'Document vault with expiry alerts',
                'Offline logging & sync',
                'Email support from a real human',
              ].map((item) => (
                <li key={item} className="text-base text-ink-soft before:mr-2 before:font-bold before:text-pass before:content-['✓']">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3.5 font-mono text-sm text-ink-soft">
              14-day free trial · No credit card required ·{' '}
              <CtaLink page="landing_pricing" href="/pricing" className="font-medium text-flame">
                Full pricing details
              </CtaLink>
            </p>
          </div>
        </section>

        {/* START */}
        <section id="start" className="bg-flame py-22 text-center text-white" aria-labelledby="start-title">
          <div className="mx-auto max-w-[1120px] px-6">
            <SectionEyebrow className="text-[#FFE3D7]">Ready when you are</SectionEyebrow>
            <h2 id="start-title" className="mx-auto max-w-[18em] font-display text-[clamp(32px,4vw,48px)] font-extrabold uppercase leading-[1.04] tracking-wide text-white">
              Start logging in 5 minutes
            </h2>
            <p className="mx-auto mt-4 max-w-[40em] text-lg text-[#FFE3D7]">
              14 days free, no credit card. Set up your truck, log your first temp, and see for
              yourself whether it fits your shift.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <CtaLink page="landing_start" href="/signup" className="rounded-[10px] bg-ink px-[26px] py-[13px] text-base font-semibold text-white transition-transform active:scale-[.98] hover:bg-black">
                Start your free trial
              </CtaLink>
              <CtaLink page="landing_start" href="/founding-trucks" className="rounded-[10px] border-2 border-white px-[26px] py-[13px] text-base font-semibold text-white transition-transform active:scale-[.98] hover:bg-white hover:text-flame">
                Or apply for Founding Trucks — 3 months free
              </CtaLink>
            </div>
            <p className="mt-3.5 font-mono text-sm text-[#FFE3D7]">
              Founding Trucks: first 20 trucks get 3 months free + a direct line to the founder, in
              exchange for 15 minutes of feedback a week.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-22" aria-labelledby="faq-title">
          <div className="mx-auto max-w-[820px] px-6">
            <SectionEyebrow>Questions</SectionEyebrow>
            <h2 id="faq-title" className="max-w-[18em] font-display text-[clamp(32px,4vw,48px)] font-extrabold uppercase leading-[1.04] tracking-wide">
              Fair questions, straight answers
            </h2>
            <div className="mt-3.5 flex flex-col gap-3.5">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group rounded-xl border border-steel-deep bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5.5 py-4.5 text-[17px] font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="flex-none font-display text-2xl text-flame group-open:hidden">+</span>
                    <span className="hidden flex-none font-display text-2xl text-flame group-open:inline">–</span>
                  </summary>
                  <p className="px-5.5 pb-5 text-base text-ink-soft">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-ink py-12 text-sm text-[#AEB8BF]">
        <div className="mx-auto max-w-[1120px] px-6">
          <div className="flex flex-wrap justify-between gap-8">
            <div>
              <div className="font-display text-[22px] font-extrabold uppercase tracking-wide text-white">Solo Truck</div>
              <p>Inspector-proof daily logs for independent food trucks.</p>
            </div>
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-6">
                <li><a href="#how" className="text-[#DDE3E7]">How it works</a></li>
                <li><a href="#pricing" className="text-[#DDE3E7]">Pricing</a></li>
                <li><a href="#faq" className="text-[#DDE3E7]">FAQ</a></li>
                <li>
                  <CtaLink page="landing_footer" href="/signup" className="text-[#DDE3E7]">
                    Start free trial
                  </CtaLink>
                </li>
                <li>
                  <CtaLink page="landing_footer" href="/founding-trucks" className="text-[#DDE3E7]">
                    Founding Trucks
                  </CtaLink>
                </li>
                <li><Link href="/guide" className="text-[#DDE3E7]">Guide</Link></li>
              </ul>
            </nav>
          </div>
          <p className="mt-5 max-w-[60em] text-[13px] leading-relaxed text-[#7E888F]">
            Solo Truck is a record-keeping tool, not legal or food-safety advice, and does not
            guarantee inspection outcomes. Default thresholds follow the FDA Food Code; actual
            requirements vary by state and county — always verify with your local health authority. ©
            2026 Solo Truck.
          </p>
        </div>
      </footer>
    </div>
  );
}
