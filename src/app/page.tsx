import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LandingPage } from '@/components/landing/landing-page';
import { PublicAnalytics } from '@/components/analytics/public-analytics';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = siteMetadata({
  title: 'Solo Truck — Your paper temp log, but inspector-proof',
  description:
    'Daily temperature logs, pre-shift checklists, and one-tap Inspector Mode for food trucks. 30 seconds a day. Works offline. $24/month.',
  path: '/',
});

export default async function RootPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Signed-in visitors go straight to the app — (app)/layout.tsx and
  // /setup sort out where exactly they belong from there. Everyone else
  // sees the marketing landing page (Phase 0 step 0.5).
  if (user) redirect('/today');

  return (
    <>
      <PublicAnalytics />
      <LandingPage />
    </>
  );
}
