'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getAppUrl } from '@/lib/get-app-url';
import { getClientIp } from '@/lib/get-client-ip';
import { checkRateLimit } from '@/lib/rate-limit';

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export type SignupState = { status: 'idle' | 'sent' | 'error'; message?: string };

export async function signUpWithPassword(
  _prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Enter a valid email and password.',
    };
  }

  const ip = getClientIp(await headers());
  const withinLimit = await checkRateLimit('signup', ip, 5);
  if (!withinLimit) {
    return { status: 'error', message: 'Too many attempts. Try again in a bit.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { emailRedirectTo: `${getAppUrl()}/auth/callback` },
  });

  // Supabase itself returns the same success shape whether or not the email
  // is already registered (no duplicate confirmation email is sent) — this
  // response just mirrors that, so we never confirm/deny an existing account.
  if (error) {
    console.error('[signUp]', error.status, error.code, error.message);
  }

  return { status: 'sent' };
}
