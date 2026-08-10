import type { SupabaseClient } from '@supabase/supabase-js';
import type { SubscriptionForAccess } from './access';

// Shared by layout.tsx (banner) and every offline-capable write surface
// (today/page.tsx, checklist/page.tsx) that needs to compute canWrite
// server-side before handing a boolean down to its client component.
export async function getSubscriptionForAccess(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  businessId: string,
): Promise<SubscriptionForAccess | null> {
  const { data } = await supabase
    .from('subscriptions')
    .select('status, trial_ends_at, current_period_end')
    .eq('business_id', businessId)
    .maybeSingle();

  if (!data) return null;
  return {
    status: data.status,
    trialEndsAt: data.trial_ends_at,
    currentPeriodEnd: data.current_period_end,
  };
}
