import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '/about',
    '/pricing',
    '/privacy',
    '/terms',
    '/founding-trucks',
    '/guide',
    '/tools',
    '/tools/temp-danger-zone-checker',
    '/tools/inspection-readiness-quiz',
    '/compare/auditbinder',
    '/compare/fooddocs',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  return [{ url: SITE_URL, lastModified: new Date() }, ...pages];
}
