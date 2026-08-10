'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getClientIp } from '@/lib/get-client-ip';
import { checkRateLimit } from '@/lib/rate-limit';

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export type LoginState = { status: 'idle' | 'error'; message?: string };

export async function signInWithPassword(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Enter a valid email and password.' };
  }

  const ip = getClientIp(await headers());
  const withinLimit = await checkRateLimit('login', ip, 10);
  if (!withinLimit) {
    return { status: 'error', message: 'Too many attempts. Try again in a bit.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  // Same generic message for "wrong password" and "no such account" — don't
  // reveal which one it was.
  if (error) {
    return { status: 'error', message: 'Invalid email or password.' };
  }

  redirect('/today');
}
