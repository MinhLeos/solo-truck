import type { Metadata } from 'next';
import { SITE_URL } from './site';

// Shared canonical/OG/Twitter-card builder for public pages — every one of
// them gets the same three things a social-share preview and search engine
// both need: canonical URL, an absolute og:image, and a twitter
// summary_large_image card. `image` defaults to the site-wide card (see
// scripts/generate-site-og-images.mjs); pass a page-specific one for pages
// worth sharing on their own.
export function siteMetadata({
  title,
  description,
  path,
  image = `${SITE_URL}/og/site/default.png`,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
