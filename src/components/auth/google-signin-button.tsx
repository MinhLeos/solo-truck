'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export function GoogleSignInButton() {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    setPending(false);
  }

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleClick}
      disabled={pending}
      className="w-full"
    >
      {pending ? 'Redirecting…' : 'Continue with Google'}
    </Button>
  );
}
