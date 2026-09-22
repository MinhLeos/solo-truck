'use client'

import { useState } from 'react'
import { ArrowRight, Check, ChevronDown, Flame, Menu, ShieldCheck } from 'lucide-react'

const included = [
  'Unlimited temperature logs & checklists — no per-entry or per-truck limits',
  'Corrective actions with photo attachments',
  'Inspector Mode: one-tap read-only report, PDF export on the spot',
  'Document vault for permits, commissary agreement, certs — with expiry alerts',
  'Offline logging & sync — built for zero bars inside a steel truck',
  'Export everything to PDF/CSV, any time, even after you cancel',
  'Email support from the person actually building it',
]

export default function PricingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main className="pricing-page">
      <header className="pricing-nav">
        <a href="/" className="pricing-brand"><span><Flame size={17} fill="currentColor" /></span>Solo Truck</a>
        <nav className="pricing-links"><a href="/#how">How it works</a><a href="/#features">Features</a><a className="active" href="/pricing">Pricing</a><a href="/#faq">FAQ</a></nav>
        <a className="pricing-nav-cta" href="#plans">Start free trial <ArrowRight size={15} /></a>
        <button className="pricing-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu"><Menu size={21} /></button>
      </header>
      {menuOpen && <nav className="pricing-mobile-links"><a href="/#how">How it works</a><a href="/#features">Features</a><a href="/pricing">Pricing</a><a href="/#faq">FAQ</a></nav>}

      <section className="pricing-hero">
        <p className="pricing-kicker"><span />PRICING THAT DOESN&apos;T NEED A SALES CALL</p>
        <h1>One truck,<br /><em>one flat price.</em></h1>
        <p className="pricing-lede">No per-employee fees, no per-log fees, no enterprise sales call. $24/month or $190/year — same features either way. Every account starts with a 14-day free trial, no card required.</p>
      </section>

      <section className="pricing-plans" id="plans">
        <Plan title="Monthly" price="$24/month" detail="Cancel any time." />
        <Plan title="Yearly" price="$190/year" detail="Save 34% vs. paying monthly." featured />
      </section>

      <section className="included-section">
        <div className="included-heading"><p className="pricing-kicker">THE FULL TOOLKIT</p><h2>What&apos;s included,<br /><em>at every price.</em></h2></div>
        <div className="included-list">{included.map((item, index) => <div className="included-item" key={item}><span className="included-number">{String(index + 1).padStart(2, '0')}</span><span className="included-check"><Check size={17} strokeWidth={3} /></span><p>{item}</p></div>)}</div>
      </section>

      <section className="never-section"><div className="never-icon"><ShieldCheck size={27} /></div><div><p className="pricing-kicker">THE FINE PRINT, WITHOUT THE FINE PRINT</p><h2>What Solo Truck <em>never does.</em></h2><p className="never-copy">No per-staff pricing, no sensor add-on fees, no locked-in contract. Cancel any time — you keep read access and can export everything, whether or not you&apos;re still subscribed.</p></div></section>

      <section className="founding-section"><p>Already talked to us and want a hand getting set up? <a href="mailto:hello@solotruck.com">See what Founding Trucks get</a> — 3 months free in exchange for weekly feedback, first 20 trucks only. <ArrowRight size={16} /></p></section>

      <footer className="pricing-footer"><a href="/" className="pricing-brand"><span><Flame size={17} fill="currentColor" /></span>Solo Truck</a><p>Inspector-proof daily logs for independent food trucks.</p><a href="/#faq">Questions? Read the FAQ <ArrowRight size={14} /></a></footer>
    </main>
  )
}

function Plan({ title, price, detail, featured = false }: { title: string; price: string; detail: string; featured?: boolean }) {
  return <article className={`pricing-plan ${featured ? 'recommended' : ''}`}>
    {featured && <span className="recommended-badge">RECOMMENDED <span>✦</span></span>}
    <p className="plan-label">{title}</p><h2>{price}</h2><p className="plan-detail">{detail}</p>
    <a className={`plan-button ${featured ? 'orange-button' : ''}`} href="#plans">Start free trial <ArrowRight size={16} /></a>
    <p className="plan-trial"><Check size={14} />14-day free trial · No card required</p>
  </article>
}

export function PricingAccordion() { return <ChevronDown size={16} /> }

