import { GA4Script } from './ga4-script';
import { GA4PageView } from './ga4-pageview';

// Mounted only on public/marketing pages (landing, about, privacy, terms,
// /tools, /compare, /founding-trucks) — never in the root layout, so
// authenticated app pages (today/checklist/history/documents/inspector/
// settings) never load GA4 or send a pageview. Those pages hold live
// compliance data for paying customers; product analytics has no reason to
// see how they're used.
export function PublicAnalytics() {
  return (
    <>
      <GA4Script />
      <GA4PageView />
    </>
  );
}
