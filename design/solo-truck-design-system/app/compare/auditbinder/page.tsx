'use client'

import { ArrowLeft, ArrowRight, Check, Flame, X } from 'lucide-react'

const auditItems = [['HACCP plan generated for you', true], ['Printable log sheets', true], ['No daily logging — paper stays paper', false], ['No corrective action tracking', false], ['No inspector-ready 90-day view', false]] as const
const soloItems = [['30-second temp + checklist logging', true], ['Corrective actions required on out-of-range readings', true], ['Inspector Mode: 90 days, one tap', true], ["Doesn't write your HACCP plan for you", false]] as const

export default function AuditBinderPage() {
  return <main className="compare-page">
    <header className="compare-header"><a href="/" className="compare-brand"><span><Flame size={17} fill="currentColor" /></span>Solo Truck</a><a href="/tools" className="compare-back"><ArrowLeft size={15} /> All tools</a></header>
    <article className="compare-article"><div className="compare-hero"><p className="compare-eyebrow"><i />Solo Truck vs. AuditBinder</p><h1>Got your HACCP binder?<br /><em>Great — now keep it alive.</em></h1><p className="compare-dek">AuditBinder is good at what it does: a one-time $47-97 tool that generates your HACCP plan, CCP tables, SOPs, and a printable log sheet. It sets you up on day one. What it doesn&apos;t do is log anything for you after that — the binder just sits on the truck.</p></div><div className="compare-rule" /><p className="compare-label">The day-one setup vs. the daily habit</p><section className="compare-grid" aria-label="AuditBinder and Solo Truck comparison"><CompareColumn title="AuditBinder" subtitle="Day 0 setup — one-time" items={auditItems} /><CompareColumn title="Solo Truck" subtitle="Every shift, from day 1 onward" items={soloItems} solo /></section><section className="compare-closing"><p>Honestly? Most trucks end up wanting both — AuditBinder to get the paperwork right once, Solo Truck to prove, every day after, that you&apos;re actually following it. A binder an inspector can&apos;t see updated daily doesn&apos;t answer the question they actually ask: &quot;show me today&apos;s log.&quot;</p><a href="/pricing" className="compare-cta">Try Solo Truck free <ArrowRight size={17} /></a></section></article>
    <footer className="compare-footer"><span>Solo Truck · Daily compliance, made practical.</span><span>© 2026 Solo Truck</span></footer>
  </main>
}

function CompareColumn({ title, subtitle, items, solo = false }: { title: string; subtitle: string; items: readonly (readonly [string, boolean])[]; solo?: boolean }) {
  return <article className={`compare-column ${solo ? 'solo-column' : ''}`}><div className="compare-column-head"><div className="compare-column-icon"><span>{solo ? <Flame size={22} fill="currentColor" /> : <span className="binder-lines" />}</span></div><div><h2>{title}</h2><p>{subtitle}</p></div></div><ul>{items.map(([text, positive]) => <li key={text} className={positive ? 'positive' : 'negative'}><span>{positive ? <Check size={15} strokeWidth={3} /> : <X size={15} strokeWidth={3} />}</span>{text}</li>)}</ul></article>
}
