'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export function GoogleSignInButton({
  className,
  iconClassName,
}: { className?: string; iconClassName?: string } = {}) {
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

  if (className) {
    return (
      <button type="button" onClick={handleClick} disabled={pending} className={className}>
        <span className={iconClassName} aria-hidden="true">G</span>
        <span>{pending ? 'Redirecting…' : 'Continue with Google'}</span>
      </button>
    );
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
