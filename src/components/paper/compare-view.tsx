import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Flame, X } from 'lucide-react';
import { CtaLink } from '@/components/analytics/CtaLink';

export type CompareItem = readonly [text: string, positive: boolean];

type Column = { title: string; subtitle: string; items: readonly CompareItem[] };

function CompareColumn({ column, solo = false }: { column: Column; solo?: boolean }) {
  return (
    <article className={`compare-column ${solo ? 'solo-column' : ''}`}>
      <div className="compare-column-head">
        <div className="compare-column-icon">
          <span>{solo ? <Flame size={22} fill="currentColor" /> : <span className="binder-lines" />}</span>
        </div>
        <div>
          <h2>{column.title}</h2>
          <p>{column.subtitle}</p>
        </div>
      </div>
      <ul>
        {column.items.map(([text, positive]) => (
          <li key={text} className={positive ? 'positive' : 'negative'}>
            <span>{positive ? <Check size={15} strokeWidth={3} /> : <X size={15} strokeWidth={3} />}</span>
            {text}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function CompareView({
  page,
  eyebrow,
  headline,
  headlineEm,
  intro,
  other,
  solo,
  closing,
  className = '',
}: {
  page: string;
  eyebrow: string;
  headline: string;
  headlineEm: string;
  intro: string;
  other: Column;
  solo: Column;
  closing: string;
  className?: string;
}) {
  return (
    <main className={`compare-page ${className}`}>
      <header className="compare-header">
        <Link href="/" className="compare-brand"><span><Flame size={17} fill="currentColor" /></span>Solo Truck</Link>
        <Link href="/tools" className="compare-back"><ArrowLeft size={15} /> All tools</Link>
      </header>
      <article className="compare-article">
        <div className="compare-hero">
          <p className="compare-eyebrow"><i />{eyebrow}</p>
          <h1>{headline}<br /><em>{headlineEm}</em></h1>
          <p className="compare-dek">{intro}</p>
        </div>
        <div className="compare-rule" />
        <section className="compare-grid" aria-label={`${other.title} and Solo Truck comparison`}>
          <CompareColumn column={other} />
          <CompareColumn column={solo} solo />
        </section>
        <section className="compare-closing">
          <p>{closing}</p>
          <CtaLink page={page} href="/founding-trucks" className="compare-cta">
            Try Solo Truck free <ArrowRight size={17} />
          </CtaLink>
        </section>
      </article>
      <footer className="compare-footer">
        <span>Solo Truck · Daily compliance, made practical.</span>
        <span>© 2026 Solo Truck</span>
      </footer>
    </main>
  );
}
