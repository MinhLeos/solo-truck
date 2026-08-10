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
    <div className="flex min-h-dvh flex-col bg-steel">
      <InstallPrompt />
      <header className="flex items-center justify-between border-b border-steel-deep bg-card px-4 py-3">
        <span className="font-semibold text-ink">{truck.name}</span>
      </header>
      <BillingBanner banner={banner} />
      <SyncStatus />
      <main className="flex flex-1 flex-col px-4 py-4 pb-20">{children}</main>
      <div className="fixed inset-x-0 bottom-0">
        <BottomNav />
      </div>
    </div>
  );
}
