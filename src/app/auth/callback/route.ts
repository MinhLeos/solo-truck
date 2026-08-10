import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Only the password-recovery link points anywhere other than /today after
// exchange — whitelisted explicitly so `next` can never become an open
// redirect to an arbitrary URL.
const ALLOWED_NEXT_PATHS = new Set(['/auth/reset-password']);

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const requestedNext = searchParams.get('next');
  const next = requestedNext && ALLOWED_NEXT_PATHS.has(requestedNext) ? requestedNext : '/today';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error(error);
  }

  return NextResponse.redirect(`${origin}/login`);
}
