import { gtagEvent } from './ga4-client';

export function getAttribution() {
  if (typeof window === 'undefined') {
    return { utm_source: '', utm_medium: '', utm_campaign: '', referrer: '', page: '' };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') ?? '',
    utm_medium: params.get('utm_medium') ?? '',
    utm_campaign: params.get('utm_campaign') ?? '',
    referrer: document.referrer || '',
    page: window.location.pathname,
  };
}

export function track(event: string, props: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_GA4_ID) {
    console.log('[track]', event, props);
    return;
  }
  gtagEvent(event, props);
}
