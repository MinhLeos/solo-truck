import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { NavMenu } from '@/components/paper/nav-menu';
import { CtaLink } from '@/components/analytics/CtaLink';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = siteMetadata({
  title: 'About — Solo Truck',
  description:
    'Why an independent developer is building daily compliance logging and Inspector Mode for solo food trucks, built in public with a 20-operator Founding Trucks cohort.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <main className="about-page">
      <header className="about-nav">
        <Link href="/" className="about-brand"><span><Flame size={18} fill="currentColor" /></span>Solo Truck</Link>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about" className="current">About</Link>
        </nav>
        <CtaLink page="about_nav" href="/signup" className="about-nav-cta">
          Start free trial <ArrowRight size={15} />
        </CtaLink>
        <NavMenu buttonClassName="about-menu">
          <Link href="/">Home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">About</Link>
        </NavMenu>
      </header>

      <article className="about-article">
        <header className="about-hero">
          <h1>Why I&apos;m building<br /><em>Solo Truck</em></h1>
          <p className="about-dek">The short version lives on the homepage — this is the long one.</p>
          <div className="about-rule" />
        </header>

        <div className="about-body">
          <aside className="about-aside"><span>01</span><span className="aside-line" /></aside>
          <section className="about-section">
            <h2>How I got here</h2>
            <p>
              I spent time in food truck communities — r/foodtrucks, local Facebook groups, health
              inspection horror-story threads — before writing a line of code. The pattern that stood
              out wasn&apos;t that owners didn&apos;t know the rules. It was that keeping honest, daily
              proof of following them meant a soggy clipboard on the fridge, filled in from memory at
              the end of a rush, if at all.
            </p>
            <p>
              A missed temperature check doesn&apos;t just risk a bad grade — it risks product in the
              trash, a shut-down for the day, or worse. The trucks that pass consistently aren&apos;t
              the ones with perfect-looking logs. They&apos;re the ones that catch a problem early and
              write down what they did about it.
            </p>
          </section>

          <aside className="about-aside"><span>02</span><span className="aside-line" /></aside>
          <section className="about-section">
            <h2>Why not just use a HACCP binder generator?</h2>
            <p>
              Tools like AuditBinder are good at what they do: they get your food safety plan and
              paperwork right on day one. What they don&apos;t do is help you keep proving, every
              shift, that you&apos;re still following it. That&apos;s a different job — the daily one —
              and it&apos;s the one Solo Truck is built for.
            </p>
            <p>
              Enterprise platforms built for restaurant chains solve a different problem too: multiple
              locations, sensor fleets, a compliance manager. A one-truck owner running the line
              themselves doesn&apos;t need any of that, and shouldn&apos;t have to pay for it.
            </p>
          </section>

          <aside className="about-aside"><span>03</span><span className="aside-line" /></aside>
          <section className="about-section">
            <h2>How I&apos;m building it</h2>
            <p>
              Solo Truck is built with up to 20 accepted trucks in the{' '}
              <CtaLink page="about" href="/founding-trucks">Founding Trucks program</CtaLink> — talking
              to them directly, shipping what they actually hit friction on, skipping what sounds nice
              but nobody asked for. I share real numbers and real mistakes, not a highlight reel.
            </p>
          </section>

          <aside className="about-aside"><span>04</span><span className="aside-line" /></aside>
          <section className="about-section about-final">
            <h2>Want to help shape it?</h2>
            <p>
              Start your free trial or apply for Founding Trucks — either way, feedback goes straight
              to me, not a support queue.
            </p>
            <div className="about-actions">
              <CtaLink page="about" href="/signup" className="about-button">
                Start your free trial <ArrowRight size={16} />
              </CtaLink>
              <CtaLink page="about" href="/founding-trucks" className="about-text-link">
                Apply for Founding Trucks <ArrowRight size={14} />
              </CtaLink>
            </div>
          </section>
        </div>
      </article>

      <footer className="about-footer">
        <Link href="/" className="about-brand"><span><Flame size={18} fill="currentColor" /></span>Solo Truck</Link>
        <p>Inspector-proof daily logs for independent food trucks.</p>
        <Link href="/pricing">See pricing <ArrowRight size={14} /></Link>
      </footer>
    </main>
  );
}
