'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function generateInspectorLink(): Promise<void> {
  const supabase = await createClient();
  const { data: truck } = await supabase.from('trucks').select('business_id').maybeSingle();
  if (!truck) return;

  const token = randomBytes(32).toString('base64url');
  await supabase.from('inspector_links').insert({
    business_id: truck.business_id,
    token,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });

  revalidatePath('/inspector');
}

export async function revokeInspectorLink(linkId: string): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from('inspector_links')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', linkId);
  revalidatePath('/inspector');
}
