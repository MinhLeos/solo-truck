import type { MetadataRoute } from 'next';
import { SITE_URL, IS_PRODUCTION } from '@/lib/seo/site';

// Auth-gated app pages, API routes, and capability-link routes (the
// inspector-link token, SECURITY.md §6 — already `noindex` per-page) have
// nothing worth indexing.
const DISALLOW = [
  '/api/',
  '/auth/',
  '/login',
  '/signup',
  '/setup',
  '/today',
  '/checklist',
  '/history',
  '/documents',
  '/inspector',
  '/settings',
  '/i/',
];

// AI crawlers listed explicitly (not just relying on the `*` catch-all) so
// it's a deliberate, visible choice that Solo Truck wants to be citable by
// AI answer engines.
const AI_USER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-SearchBot',
  'Google-Extended',
  'PerplexityBot',
  'Applebot-Extended',
  'Amazonbot',
  'Meta-ExternalAgent',
];

export default function robots(): MetadataRoute.Robots {
  // Preview deploys and local dev must never get crawled — same reasoning
  // as the robots meta tag on the /i/[token] route.
  if (!IS_PRODUCTION) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...AI_USER_AGENTS.map((userAgent) => ({ userAgent, allow: '/', disallow: DISALLOW })),
      // Aggressive scraper with no search/AI-citation value.
      { userAgent: 'Bytespider', disallow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
