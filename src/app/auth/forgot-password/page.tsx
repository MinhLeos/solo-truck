'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FormMessage } from '@/components/ui/form-message';
import { requestPasswordReset, type ForgotPasswordState } from './actions';

const initialState: ForgotPasswordState = { status: 'idle' };

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-steel px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Reset your password
        </h1>
        <p className="mt-2 text-ink-soft">
          Enter your email — if you have an account, we&apos;ll send a reset link.
        </p>

        {state.status === 'sent' ? (
          <Card className="mt-6 text-sm">
            Check your email for a link to reset your password.
          </Card>
        ) : (
          <form action={formAction} className="mt-6 flex flex-col gap-3">
            <Input
              label="Email"
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
            {state.status === 'error' && (
              <FormMessage status="error">{state.message}</FormMessage>
            )}
            <Button type="submit" disabled={pending}>
              {pending ? 'Sending…' : 'Send reset link'}
            </Button>
          </form>
        )}

        <p className="mt-4 text-sm">
          <Link href="/login" className="font-medium text-flame">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
