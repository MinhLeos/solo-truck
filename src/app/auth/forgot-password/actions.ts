'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getAppUrl } from '@/lib/get-app-url';
import { getClientIp } from '@/lib/get-client-ip';
import { checkRateLimit } from '@/lib/rate-limit';

const schema = z.object({ email: z.string().trim().email() });

export type ForgotPasswordState = { status: 'idle' | 'sent' | 'error'; message?: string };

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const parsed = schema.safeParse({ email: formData.get('email') });

  if (!parsed.success) {
    return { status: 'error', message: 'Enter a valid email address.' };
  }

  const ip = getClientIp(await headers());
  const withinLimit = await checkRateLimit('forgot-password', ip, 5);
  if (!withinLimit) {
    return { status: 'error', message: 'Too many attempts. Try again in a bit.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getAppUrl()}/auth/callback?next=/auth/reset-password`,
  });

  // Logged server-side only — client response stays identical either way so
  // it doesn't leak which emails have an account.
  if (error) {
    console.error('[resetPasswordForEmail]', error.status, error.code, error.message);
  }

  return { status: 'sent' };
}
