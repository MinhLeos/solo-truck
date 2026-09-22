import type { Metadata } from 'next';
import { CompareView } from '@/components/paper/compare-view';
import { siteMetadata } from '@/lib/seo/metadata';
import { SITE_URL } from '@/lib/seo/site';

export const metadata: Metadata = siteMetadata({
  title: 'Solo Truck vs. AuditBinder — which one do you actually need?',
  description:
    'AuditBinder sets up your HACCP plan and paperwork once. Solo Truck logs your daily temps and checklists. Most trucks end up needing both.',
  path: '/compare/auditbinder',
  image: `${SITE_URL}/og/site/compare-auditbinder.png`,
});

export default function CompareAuditBinderPage() {
  return (
    <CompareView
      page='compare_auditbinder'
      eyebrow='Solo Truck vs. AuditBinder'
      headline='Got your HACCP binder?'
      headlineEm='Great — now keep it alive.'
      intro={"AuditBinder is good at what it does: a one-time $47-97 tool that generates your HACCP plan, CCP tables, SOPs, and a printable log sheet. It sets you up on day one. What it doesn't do is log anything for you after that — the binder just sits on the truck."}
      other={{ title: 'AuditBinder', subtitle: 'Day 0 setup — one-time', items: [['HACCP plan generated for you', true], ['Printable log sheets', true], ['No daily logging — paper stays paper', false], ['No corrective action tracking', false], ['No inspector-ready 90-day view', false]] }}
      solo={{ title: 'Solo Truck', subtitle: 'Every shift, from day 1 onward', items: [['30-second temp + checklist logging', true], ['Corrective actions required on out-of-range readings', true], ['Inspector Mode: 90 days, one tap', true], ["Doesn't write your HACCP plan for you", false]] }}
      closing={'Honestly? Most trucks end up wanting both — AuditBinder to get the paperwork right once, Solo Truck to prove, every day after, that you\'re actually following it. A binder an inspector can\'t see updated daily doesn\'t answer the question they actually ask: "show me today\'s log."'}
    />
  );
}
