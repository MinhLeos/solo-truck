'use client'

import { ArrowRight, Check, Flame, Mail } from 'lucide-react'

const subject = encodeURIComponent('Founding Truck application')
const body = encodeURIComponent('Truck/business name:\nCity/state:\nHow do you log temps today?\n')
const applyHref = `mailto:hello@solotruck.com?subject=${subject}&body=${body}`

const offer = [
  '3 months free — no card, no trial countdown',
  'Direct line to the founder — real answers, not a support queue',
  "15 minutes/week telling us what's broken or missing",
  'Your name (if you want it) as an early Solo Truck customer',
]

export default function FoundingTrucksPage() {
  return (
    <main className="founding-page">
      <div className="founding-grid" aria-hidden="true" />
      <header className="founding-header">
        <a className="founding-brand" href="/">
          <span><Flame size={16} fill="currentColor" /></span>
          Solo Truck
        </a>
        <span className="founding-status"><i />20 spots only</span>
      </header>

      <section className="founding-hero">
        <p className="founding-eyebrow"><span />Founding Trucks</p>
        <h1>Be one of the first 20 trucks on Solo Truck — <em>free for 3 months.</em></h1>
        <p className="founding-subtext">We&apos;re looking for 20 independent food trucks to use Solo Truck daily and tell us, weekly, what actually helps and what gets in the way. In exchange: 3 months free and a direct line to the person building it.</p>

        <div className="founding-card">
          <div className="founding-card-top"><span>What you get</span><b>01 — 04</b></div>
          <ul>{offer.map((item) => <li key={item}><span><Check size={15} strokeWidth={3} /></span>{item}</li>)}</ul>
          <a className="founding-cta" href={applyHref}><Mail size={18} />Apply — email us your truck<ArrowRight size={17} /></a>
          <p className="founding-note">No spam, no waitlist black hole — every application gets a real reply from the founder.</p>
        </div>

        <a className="founding-secondary" href="/guide">See how it works first <span>→</span></a>
      </section>

      <footer className="founding-footer"><span>SOLO TRUCK / 2026</span><span>Built for the people on the line.</span></footer>
    </main>
  )
}

<style>{`
  .founding-page { --founding-paper:#f6f1e7; --founding-ink:#1b1d1b; --founding-orange:#ed5a2b; --founding-mint:#bcebd0; min-height:100vh; position:relative; overflow:hidden; color:var(--founding-ink); background:var(--founding-paper); font-family:var(--font-body),sans-serif; }
  .founding-grid { position:absolute; inset:0; pointer-events:none; opacity:.38; background-image:linear-gradient(rgba(31,33,30,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(31,33,30,.08) 1px,transparent 1px); background-size:48px 48px; mask-image:linear-gradient(to bottom,rgba(0,0,0,.75),transparent 82%); }
  .founding-header { position:relative; z-index:1; display:flex; justify-content:space-between; align-items:center; max-width:1120px; margin:0 auto; padding:28px 5vw; border-bottom:1px solid rgba(27,29,27,.22); }
  .founding-brand { display:flex; align-items:center; gap:9px; color:inherit; font:800 22px/1 var(--font-display),sans-serif; letter-spacing:-.04em; text-decoration:none; }.founding-brand span { display:grid; place-items:center; width:29px; height:29px; color:var(--founding-paper); background:var(--founding-orange); border-radius:50%; }
  .founding-status { color:#77736b; font:700 10px var(--font-mono),monospace; letter-spacing:.1em; text-transform:uppercase; }.founding-status i { display:inline-block; width:7px; height:7px; margin-right:7px; background:var(--founding-orange); border-radius:50%; }
  .founding-hero { position:relative; z-index:1; max-width:780px; margin:0 auto; padding:105px 24px 100px; text-align:center; }.founding-eyebrow { margin:0 0 25px; color:var(--founding-orange); font:700 11px var(--font-mono),monospace; letter-spacing:.16em; text-transform:uppercase; }.founding-eyebrow span { display:inline-block; width:8px; height:8px; margin-right:9px; background:var(--founding-orange); border-radius:50%; }
  .founding-hero h1 { margin:0; font:800 clamp(54px,7vw,87px)/.86 var(--font-display),sans-serif; letter-spacing:-.06em; }.founding-hero h1 em { color:var(--founding-orange); font-style:normal; }.founding-subtext { max-width:640px; margin:31px auto 0; color:#64635c; font-size:17px; line-height:1.55; }
  .founding-card { max-width:590px; margin:55px auto 0; padding:25px 27px 24px; background:var(--founding-ink); color:var(--founding-paper); text-align:left; box-shadow:9px 9px 0 var(--founding-orange); }.founding-card-top { display:flex; justify-content:space-between; padding-bottom:18px; border-bottom:1px solid #4a4d47; color:var(--founding-mint); font:700 10px var(--font-mono),monospace; letter-spacing:.12em; text-transform:uppercase; }.founding-card-top b { color:#a5aaa0; font-weight:400; }.founding-card ul { display:grid; gap:16px; margin:24px 0 28px; padding:0; list-style:none; }.founding-card li { display:flex; align-items:flex-start; gap:12px; color:#f4f0e7; font-size:15px; line-height:1.35; }.founding-card li > span { display:grid; place-items:center; flex:none; width:23px; height:23px; color:var(--founding-ink); background:var(--founding-mint); border-radius:50%; }.founding-cta { display:flex; align-items:center; justify-content:center; gap:10px; min-height:56px; color:#fff; background:var(--founding-orange); font:700 12px var(--font-mono),monospace; text-transform:uppercase; text-decoration:none; transition:transform .2s,box-shadow .2s; }.founding-cta svg:last-child { margin-left:auto; margin-right:14px; }.founding-cta svg:first-child { margin-left:13px; }.founding-cta:hover { transform:translate(-2px,-2px); box-shadow:5px 5px 0 var(--founding-mint); }.founding-note { margin:18px 0 0; color:#a5aaa0; font:10px/1.5 var(--font-mono),monospace; text-align:center; }.founding-secondary { display:inline-flex; gap:9px; margin-top:43px; color:#69665e; font:700 11px var(--font-mono),monospace; text-transform:uppercase; text-decoration:underline; text-underline-offset:4px; }.founding-secondary span { color:var(--founding-orange); font-size:18px; line-height:10px; text-decoration:none; }.founding-footer { position:relative; z-index:1; display:flex; justify-content:space-between; max-width:1120px; margin:0 auto; padding:22px 5vw; border-top:1px solid rgba(27,29,27,.22); color:#8a8478; font:9px var(--font-mono),monospace; letter-spacing:.08em; text-transform:uppercase; }
  @media (max-width:760px) { .founding-header { padding:22px 20px; }.founding-status { font-size:9px; }.founding-hero { padding:73px 20px 75px; }.founding-hero h1 { font-size:clamp(53px,15vw,76px); }.founding-subtext { font-size:15px; }.founding-card { margin-top:42px; padding:22px 19px 20px; box-shadow:6px 6px 0 var(--founding-orange); }.founding-card li { font-size:14px; }.founding-cta { font-size:10px; }.founding-footer { display:block; padding:20px; line-height:2; }.founding-footer span { display:block; } }
`}</style>
