// Talks to GA4 via the standard gtag.js snippet (loaded once from the root
// layout — see src/components/analytics/ga4-script.tsx). No wrapper SDK:
// gtag() is queued on window.dataLayer by the snippet itself, so this file
// only needs to call it.
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function gtagEvent(event: string, properties: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || !GA4_ID || !window.gtag) return;
  window.gtag('event', event, properties);
}
