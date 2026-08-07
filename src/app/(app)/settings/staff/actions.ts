'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const addStaffSchema = z.object({
  name: z.string().trim().min(1).max(80),
  pin: z.string().regex(/^\d{4}$/, 'PIN must be exactly 4 digits'),
});

export type StaffFormState = { status: 'idle' | 'error'; message?: string };

export async function addStaff(
  _prevState: StaffFormState,
  formData: FormData,
): Promise<StaffFormState> {
  const parsed = addStaffSchema.safeParse({
    name: formData.get('name'),
    pin: formData.get('pin'),
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = await createClient();
  const { data: truck } = await supabase.from('trucks').select('business_id').maybeSingle();
  if (!truck) return { status: 'error', message: 'No truck found for this account.' };

  const { error } = await supabase
    .from('staff')
    .insert({ business_id: truck.business_id, name: parsed.data.name, pin: parsed.data.pin });

  if (error) {
    console.error('[addStaff]', error.code, error.message);
    return { status: 'error', message: 'Could not add staff member.' };
  }

  revalidatePath('/settings/staff');
  return { status: 'idle' };
}

export async function removeStaff(staffId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from('staff').update({ deleted_at: new Date().toISOString() }).eq('id', staffId);
  revalidatePath('/settings/staff');
}
