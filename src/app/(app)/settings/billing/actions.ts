'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutUrl, getPortalUrl } from '@/lib/billing/checkout';
import type { BillingInterval } from '@/lib/billing/client';

export async function startCheckoutAction(interval: BillingInterval): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) throw new Error('Not authenticated.');

  const { data: truck } = await supabase.from('trucks').select('business_id').maybeSingle();
  if (!truck) throw new Error('No truck found for this account.');

  const url = await createCheckoutUrl(truck.business_id, user.email, interval);
  redirect(url);
}

export async function openPortalAction(providerCustomerId: string): Promise<void> {
  const url = await getPortalUrl(providerCustomerId);
  redirect(url);
}
