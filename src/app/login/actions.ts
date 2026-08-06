'use server';

import { z } from 'zod';
import { getAppUrl } from '@/lib/get-app-url';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  email: z.string().trim().email(),
});

export type LoginState = { status: 'idle' | 'sent' | 'error'; message?: string };

export async function signInWithMagicLink(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = schema.safeParse({ email: formData.get('email') });

  if (!parsed.success) {
    return { status: 'error', message: 'Enter a valid email address.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${getAppUrl()}/auth/callback`,
    },
  });

  // Logged server-side only for debugging — the client-facing response
  // below must stay identical either way so it doesn't leak which emails
  // have an account (SECURITY.md #9).
  if (error) {
    console.error('[signInWithOtp]', error.status, error.code, error.message);
  }

  return { status: 'sent' };
}
