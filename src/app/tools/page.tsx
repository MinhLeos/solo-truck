import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, Check, Flame } from 'lucide-react';
import { siteMetadata } from '@/lib/seo/metadata';
import { SITE_URL } from '@/lib/seo/site';

export const metadata: Metadata = siteMetadata({
  title: 'Free Food Truck Compliance Tools — Solo Truck',
  description:
    'Free tools for food truck owners: check if food is still safe out of the danger zone, and see how ready you are for a health inspection.',
  path: '/tools',
  image: `${SITE_URL}/og/site/tools.png`,
});

const TOOLS = [
  {
    number: '01',
    icon: '°F',
    href: '/tools/temp-danger-zone-checker',
    title: 'Temp Danger Zone Checker',
    description:
      'Enter a temperature and how long it’s been sitting out — see if it’s still safe per the FDA Food Code.',
  },
  {
    number: '02',
    icon: '12',
    href: '/tools/inspection-readiness-quiz',
    title: 'Inspection Readiness Quiz',
    description: '12 quick questions → a score and a downloadable PDF you can act on before an inspector shows up.',
  },
];

export default function ToolsIndexPage() {
  return (
    <main className="tools-page">
      <header className="tools-header">
        <Link className="tools-brand" href="/">
          <span><Flame size={16} fill="currentColor" /></span>
          Solo Truck
        </Link>
        <nav className="tools-nav" aria-label="Tools navigation">
          <Link className="tools-all" href="/tools">All tools</Link>
          <Link className="tools-try" href="/founding-trucks">Try Solo Truck free →</Link>
        </nav>
      </header>

      <section className="tools-directory" aria-labelledby="tools-title">
        <div className="tools-intro">
          <h1 id="tools-title">Free tools for food truck owners</h1>
          <p className="tools-subtext">
            No signup, no login — just the calculator or quiz. Nothing here touches your Solo Truck
            account.
          </p>
        </div>

        <div className="tools-list">
          {TOOLS.map((tool) => (
            <Link className="tool-card" href={tool.href} key={tool.href}>
              <div className="tool-card-top">
                <span className="tool-number">{tool.number}</span>
                <span className="tool-mark" aria-hidden="true">{tool.icon}</span>
              </div>
              <div className="tool-card-copy">
                <h2>{tool.title}</h2>
                <p>{tool.description}</p>
              </div>
              <span className="tool-arrow" aria-hidden="true"><ArrowUpRight size={19} /></span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="tools-footer">
        <p><Check size={14} />Free tool by Solo Truck — the 30-second daily compliance log for food trucks.</p>
        <Link href="/founding-trucks">Try Solo Truck free →</Link>
      </footer>
    </main>
  );
}
