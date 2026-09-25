'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { FormMessage } from '@/components/ui/form-message';
import styles from './forgot-password.module.css';
import { requestPasswordReset, type ForgotPasswordState } from './actions';

const initialState: ForgotPasswordState = { status: 'idle' };

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <Link className={styles.brand} href="/" aria-label="Solo Truck home">
        <span className={styles.brandMark}>ST</span>
        <span>Solo Truck</span>
      </Link>

      <section className={styles.card} aria-labelledby="reset-title">
        <div className={styles.cardIntro}>
          <h1 id="reset-title">Reset your password</h1>
          <p className={styles.subtext}>
            Enter your email — if you have an account, we&apos;ll send a reset link.
          </p>
        </div>

        {state.status === 'sent' ? (
          <div className={styles.success} role="status">
            <div className={styles.successIcon} aria-hidden="true">✓</div>
            <p>Check your email for a link to reset your password.</p>
          </div>
        ) : (
          <form action={formAction} className={styles.form}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" required placeholder="you@example.com" autoComplete="email" />
            {state.status === 'error' && (
              <FormMessage status="error">{state.message}</FormMessage>
            )}
            <button className={styles.submitButton} type="submit" disabled={pending}>
              {pending ? 'Sending…' : 'Send reset link'}
              {!pending && <span aria-hidden="true">→</span>}
            </button>
          </form>
        )}

        <Link className={styles.backLink} href="/login">Back to sign in</Link>
      </section>

      <p className={styles.footerNote}>Your shift starts here.</p>
    </main>
  );
}
