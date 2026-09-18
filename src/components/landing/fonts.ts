import { Barlow, Barlow_Condensed, IBM_Plex_Mono } from 'next/font/google';

// Landing-page-only brand fonts (landing-page.html §head) — the rest of the
// app uses Geist (src/app/layout.tsx), so these are scoped to this route
// instead of loaded globally.
export const barlow = Barlow({
  variable: '--font-landing-body',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const barlowCondensed = Barlow_Condensed({
  variable: '--font-landing-display',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
});

export const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-landing-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});
