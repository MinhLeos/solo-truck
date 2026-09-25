'use client'

import { ArrowLeft, ArrowRight, Check, Flame, X } from 'lucide-react'

const foodDocsItems = [
  ['Bluetooth sensor integration', true],
  ['Staff training + multi-location', true],
  ['Overkill for a 1-3 person truck', false],
  ['Setup and training overhead', false],
] as const

const soloItems = [
  ['Set up in 5 minutes, no training', true],
  ['Works offline in a metal box with weak signal', true],
  ['No sensors to buy or pair', true],
  ['No multi-location dashboard (yet)', false],
] as const

export default function FoodDocsPage() {
  return (
    <main className="compare-page fooddocs-page">
      <header className="compare-header">
        <a href="/" className="compare-brand"><span><Flame size={17} fill="currentColor" /></span>Solo Truck</a>
        <a href="/tools" className="compare-back"><ArrowLeft size={15} /> All tools</a>
      </header>
      <article className="compare-article">
        <div className="compare-hero">
          <p className="compare-eyebrow"><i />Solo Truck vs. FoodDocs</p>
          <h1>Built for one truck,<br /><em>not a restaurant chain.</em></h1>
          <p className="compare-dek">FoodDocs is a real, capable platform — Bluetooth sensors, staff training modules, multi-location dashboards, the works. That&apos;s exactly right for a chain with a compliance manager and a budget. It&apos;s also $169+/month and more setup than a solo owner running one truck needs or wants.</p>
        </div>
        <div className="compare-rule" />
        <p className="compare-label">The chain platform vs. the one-truck habit</p>
        <section className="compare-grid" aria-label="FoodDocs and Solo Truck comparison">
          <CompareColumn title="FoodDocs" subtitle="$169+/month — built for chains" items={foodDocsItems} />
          <CompareColumn title="Solo Truck" subtitle="$24/month — built for one truck" items={soloItems} solo />
        </section>
        <section className="compare-closing">
          <p>If you&apos;re opening truck #2 or #3 and need a manager overseeing compliance across locations, FoodDocs is the right tool and we&apos;d say so. If it&apos;s still you, on one truck, logging with one thumb between orders — that&apos;s exactly who Solo Truck is built for.</p>
          <a href="/pricing" className="compare-cta">Try Solo Truck free <ArrowRight size={17} /></a>
        </section>
      </article>
      <footer className="compare-footer"><span>Solo Truck · Daily compliance, made practical.</span><span>© 2026 Solo Truck</span></footer>
    </main>
  )
}

function CompareColumn({ title, subtitle, items, solo = false }: { title: string; subtitle: string; items: readonly (readonly [string, boolean])[]; solo?: boolean }) {
  return <article className={`compare-column ${solo ? 'solo-column' : ''}`}><div className="compare-column-head"><div className="compare-column-icon"><span>{solo ? <Flame size={22} fill="currentColor" /> : <span className="binder-lines" />}</span></div><div><h2>{title}</h2><p>{subtitle}</p></div></div><ul>{items.map(([text, positive]) => <li key={text} className={positive ? 'positive' : 'negative'}><span>{positive ? <Check size={15} strokeWidth={3} /> : <X size={15} strokeWidth={3} />}</span>{text}</li>)}</ul></article>
}
