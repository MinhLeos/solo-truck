'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/form-message';
import { signInWithMagicLink, type LoginState } from './actions';

const initialState: LoginState = { status: 'idle' };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    signInWithMagicLink,
    initialState,
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-steel px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Sign in
        </h1>
        <p className="mt-2 text-ink-soft">
          Enter your email — we&apos;ll send you a magic link.
        </p>

        {state.status === 'sent' ? (
          <Card className="mt-6 text-sm">
            Check your email for a sign-in link.
          </Card>
        ) : (
          <form action={formAction} className="mt-6 flex flex-col gap-3">
            <Input
              label="Email"
              type="email"
              name="email"
              required
              placeholder="you@example.com"
            />
            {state.status === 'error' && (
              <FormMessage status="error">{state.message}</FormMessage>
            )}
            <Button type="submit" disabled={pending}>
              {pending ? 'Sending…' : 'Send magic link'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
