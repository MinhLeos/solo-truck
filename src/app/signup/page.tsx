'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { FormMessage } from '@/components/ui/form-message';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import styles from './signup.module.css';
import { signUpWithPassword, type SignupState } from './actions';

const initialState: SignupState = { status: 'idle' };

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(
    signUpWithPassword,
    initialState,
  );

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <Link className={styles.brand} href="/" aria-label="Solo Truck home">
        <span className={styles.brandMark}>ST</span>
        <span>Solo Truck</span>
      </Link>

      <section className={styles.card} aria-labelledby="signup-title">
        <div className={styles.cardIntro}>
          <h1 id="signup-title">Create an account</h1>
          <p className={styles.subtext}>Set up your food truck.</p>
        </div>

        <GoogleSignInButton className={styles.googleButton} iconClassName={styles.googleIcon} />

        <div className={styles.divider} role="separator"><span>or</span></div>

        {state.status === 'sent' ? (
          <div className={styles.success} role="status">
            <p className={styles.successMark} aria-hidden="true">✓</p>
            <p className={styles.successText}>Check your email to confirm your account, then sign in.</p>
          </div>
        ) : (
          <form action={formAction} className={styles.form}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" required placeholder="you@example.com" autoComplete="email" />
            <label htmlFor="password">Password</label>
            <input
              id="password"
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
            <button className={styles.submitButton} type="submit" disabled={pending}>
              {pending ? 'Creating account…' : 'Create account'}
              {!pending && <span aria-hidden="true">→</span>}
            </button>
          </form>
        )}

        <p className={styles.successLink}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </section>

      <p className={styles.footerNote}>Your shift starts here.</p>
    </main>
  );
}
