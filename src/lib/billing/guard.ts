import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { hasWriteAccess, type SubscriptionForAccess } from './access';

export const BILLING_LOCKED_MESSAGE =
  'Your Solo Truck trial has ended. Subscribe in Settings → Billing to keep making changes.';

// Guards the app's non-offline write paths (documents upload, staff
// management) — SECURITY.md §4 only requires blocking NEW writes, never
// reads/export/queued-sync, so this is deliberately not called from
// /api/sync/[entity]: that route's whole job is flushing offline items that
// may have been queued back when the subscription was still valid. The
// offline-capable flows (today/checklist) instead gate client-side, via the
// same hasWriteAccess() computed server-side and passed down as a prop —
// see today/page.tsx and checklist/page.tsx.
export async function checkWriteAccess(businessId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('subscriptions')
    .select('status, trial_ends_at, current_period_end')
    .eq('business_id', businessId)
    .maybeSingle();

  if (!data) return false;

  const sub: SubscriptionForAccess = {
    status: data.status,
    trialEndsAt: data.trial_ends_at,
    currentPeriodEnd: data.current_period_end,
  };
  return hasWriteAccess(sub, new Date());
}
