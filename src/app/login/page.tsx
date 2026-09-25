'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { FormMessage } from '@/components/ui/form-message';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import styles from './login.module.css';
import { signInWithPassword, type LoginState } from './actions';

const initialState: LoginState = { status: 'idle' };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    signInWithPassword,
    initialState,
  );

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <Link className={styles.brand} href="/" aria-label="Solo Truck home">
        <span className={styles.brandMark}>ST</span>
        <span>Solo Truck</span>
      </Link>

      <section className={styles.card} aria-labelledby="login-title">
        <div className={styles.cardIntro}>
          <h1 id="login-title">Sign in</h1>
          <p className={styles.subtext}>Welcome back.</p>
        </div>

        <GoogleSignInButton className={styles.googleButton} iconClassName={styles.googleIcon} />

        <div className={styles.divider} role="separator"><span>or</span></div>

        <form action={formAction} className={styles.form}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required placeholder="you@example.com" autoComplete="email" />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" required placeholder="••••••••" autoComplete="current-password" />
          {state.status === 'error' && (
            <FormMessage status="error">{state.message}</FormMessage>
          )}
          <button className={styles.submitButton} type="submit" disabled={pending}>
            {pending ? 'Signing in…' : 'Sign in'}
            {!pending && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <nav className={styles.links} aria-label="Account links">
          <Link href="/auth/forgot-password">Forgot password?</Link>
          <Link href="/signup">Create an account</Link>
        </nav>
      </section>

      <p className={styles.footerNote}>Your shift starts here.</p>
    </main>
  );
}
