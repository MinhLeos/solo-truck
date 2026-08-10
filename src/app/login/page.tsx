'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/form-message';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import { signInWithPassword, type LoginState } from './actions';

const initialState: LoginState = { status: 'idle' };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    signInWithPassword,
    initialState,
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-steel px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Sign in
        </h1>
        <p className="mt-2 text-ink-soft">Welcome back.</p>

        <div className="mt-6">
          <GoogleSignInButton />
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-ink-soft">
          <span className="h-px flex-1 bg-steel-deep" />
          or
          <span className="h-px flex-1 bg-steel-deep" />
        </div>

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
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {state.status === 'error' && (
            <FormMessage status="error">{state.message}</FormMessage>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link href="/auth/forgot-password" className="font-medium text-flame">
            Forgot password?
          </Link>
          <Link href="/signup" className="font-medium text-flame">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
