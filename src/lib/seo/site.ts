// Single source of truth for the canonical production host — used by every
// page's canonical/OG/twitter metadata, sitemap.ts and robots.ts. Always the
// real production domain, deliberately NOT derived from NEXT_PUBLIC_APP_URL
// (which follows Preview deployments too): canonical/OG tags must keep
// pointing at production even when a Preview build renders the page, or
// Preview URLs risk getting indexed as their own separate pages.
export const SITE_URL = 'https://solotruck.app';

// Vercel sets VERCEL_ENV to 'production' only for the actual production
// deploy — Preview builds and local dev must never get indexed (duplicate
// content, unfinished pages), so robots meta tags and robots.txt both gate
// on this.
export const IS_PRODUCTION = process.env.VERCEL_ENV === 'production';
