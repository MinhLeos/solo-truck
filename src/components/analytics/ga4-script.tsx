import Script from 'next/script';
import { GA4_ID } from '@/lib/analytics/ga4-client';

// gtag.js's own automatic pageview fires once on script load, which misses
// every client-side route change under the App Router — GA4PageView (see
// ga4-pageview.tsx) sends the rest, so send_page_view is disabled here to
// avoid double-counting the first load.
export function GA4Script() {
  if (!GA4_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_ID}', { send_page_view: false });
          window.gtag = gtag;
        `}
      </Script>
    </>
  );
}
