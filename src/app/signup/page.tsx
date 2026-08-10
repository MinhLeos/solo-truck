'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FormMessage } from '@/components/ui/form-message';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import { signUpWithPassword, type SignupState } from './actions';

const initialState: SignupState = { status: 'idle' };

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(
    signUpWithPassword,
    initialState,
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-steel px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Create an account
        </h1>
        <p className="mt-2 text-ink-soft">Set up your food truck.</p>

        <div className="mt-6">
          <GoogleSignInButton />
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-ink-soft">
          <span className="h-px flex-1 bg-steel-deep" />
          or
          <span className="h-px flex-1 bg-steel-deep" />
        </div>

        {state.status === 'sent' ? (
          <Card className="text-sm">
            Check your email to confirm your account, then sign in.
          </Card>
        ) : (
          <form action={formAction} className="flex flex-col gap-3">
            <Input
              label="Email"
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            {state.status === 'error' && (
              <FormMessage status="error">{state.message}</FormMessage>
            )}
            <Button type="submit" disabled={pending}>
              {pending ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
        )}

        <p className="mt-4 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-flame">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
