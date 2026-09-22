import type { Metadata } from 'next';
import { CompareView } from '@/components/paper/compare-view';
import { siteMetadata } from '@/lib/seo/metadata';
import { SITE_URL } from '@/lib/seo/site';

export const metadata: Metadata = siteMetadata({
  title: 'Solo Truck vs. FoodDocs — when you have outgrown us',
  description:
    'FoodDocs is built for restaurant chains: sensors, staff training, multi-location dashboards, $169+/month. Solo Truck is built for one truck, one owner.',
  path: '/compare/fooddocs',
  image: `${SITE_URL}/og/site/compare-fooddocs.png`,
});

export default function CompareFoodDocsPage() {
  return (
    <CompareView
      page='compare_fooddocs'
      eyebrow='Solo Truck vs. FoodDocs'
      headline='Built for one truck,'
      headlineEm='not a restaurant chain.'
      intro={"FoodDocs is a real, capable platform — Bluetooth sensors, staff training modules, multi-location dashboards, the works. That's exactly right for a chain with a compliance manager and a budget. It's also $169+/month and more setup than a solo owner running one truck needs or wants."}
      other={{ title: 'FoodDocs', subtitle: '$169+/month — built for chains', items: [['Bluetooth sensor integration', true], ['Staff training + multi-location', true], ['Overkill for a 1-3 person truck', false], ['Setup and training overhead', false]] }}
      solo={{ title: 'Solo Truck', subtitle: '$24/month — built for one truck', items: [['Set up in 5 minutes, no training', true], ['Works offline in a metal box with weak signal', true], ['No sensors to buy or pair', true], ['No multi-location dashboard (yet)', false]] }}
      closing={"If you're opening truck #2 or #3 and need a manager overseeing compliance across locations, FoodDocs is the right tool and we'd say so. If it's still you, on one truck, logging with one thumb between orders — that's exactly who Solo Truck is built for."}
    />
  );
}
