'use client'

import { FormEvent, Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import styles from './reset-password.module.css'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    window.setTimeout(() => setIsSubmitting(false), 900)
  }

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <a className={styles.brand} href="/" aria-label="Solo Truck home">
        <span className={styles.brandMark}>ST</span>
        <span>Solo Truck</span>
      </a>

      <section className={styles.card} aria-labelledby="reset-title">
        <div className={styles.cardIntro}>
          <p className={styles.eyebrow}>Account utility</p>
          <h1 id="reset-title">Choose a new password</h1>
          <p className={styles.subtext}>For {email}.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="new-password">New password</label>
          <input id="new-password" name="new-password" type="password" autoComplete="new-password" required />

          <label htmlFor="confirm-password">Confirm password</label>
          <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required />

          <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save new password'}
            {!isSubmitting && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <a className={styles.backLink} href="/login">Back to sign in</a>
      </section>

      <p className={styles.footerNote}>Your shift starts here.</p>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
