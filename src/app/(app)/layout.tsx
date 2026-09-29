import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { billingBannerFor } from '@/lib/billing/access';
import { getSubscriptionForAccess } from '@/lib/billing/get-subscription';
import { InstallPrompt } from '../install-prompt';
import { SyncStatus } from '../sync-status';
import { BottomNav } from './bottom-nav';
import { BillingBanner } from './billing-banner';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: truck } = await supabase
    .from('trucks')
    .select('id, name, business_id')
    .maybeSingle();

  if (!truck) redirect('/setup');

  const sub = await getSubscriptionForAccess(supabase, truck.business_id);
  const banner = billingBannerFor(sub, new Date());

  return (
    <div className="app-frame">
      <InstallPrompt />
      <header className="app-header">
        <div>
          <span className="app-eyebrow">Solo Truck</span>
          <strong>{truck.name}</strong>
        </div>
      </header>
      <BillingBanner banner={banner} />
      <SyncStatus />
      <main className="app-content">{children}</main>
      <BottomNav />
    </div>
  );
}
