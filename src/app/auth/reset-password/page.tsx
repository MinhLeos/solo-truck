import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ResetPasswordForm } from './reset-password-form';
import styles from './reset-password.module.css';

export const metadata: Metadata = {
  title: 'Set a new password — Solo Truck',
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No active (recovery) session means the link was already used, expired,
  // or someone landed here directly — send them to request a fresh one.
  if (!user) redirect('/auth/forgot-password');

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <Link className={styles.brand} href="/" aria-label="Solo Truck home">
        <span className={styles.brandMark}>ST</span>
        <span>Solo Truck</span>
      </Link>

      <section className={styles.card} aria-labelledby="reset-title">
        <div className={styles.cardIntro}>
          <h1 id="reset-title">Choose a new password</h1>
          <p className={styles.subtext}>For {user.email}</p>
        </div>
        <ResetPasswordForm />
      </section>

      <p className={styles.footerNote}>Your shift starts here.</p>
    </main>
  );
}
