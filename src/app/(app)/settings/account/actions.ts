'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export type AccountFormState = { status: 'idle' | 'success' | 'error'; message?: string };

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Enter your current password.'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
});

export async function changePassword(
  _prevState: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
  });

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return { status: 'error', message: 'Not signed in.' };
  }

  // Require the current password to change it — a session left open on an
  // unattended device shouldn't be enough on its own.
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  });
  if (verifyError) {
    return { status: 'error', message: 'Current password is incorrect.' };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.newPassword });
  if (error) {
    return { status: 'error', message: 'Could not update password.' };
  }

  return { status: 'success', message: 'Password updated.' };
}

const setPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
});

export async function setPassword(
  _prevState: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const parsed = setPasswordSchema.safeParse({ newPassword: formData.get('newPassword') });

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.newPassword });
  if (error) {
    return { status: 'error', message: 'Could not set password.' };
  }

  return { status: 'success', message: 'Password set — you can now also sign in with email + password.' };
}
