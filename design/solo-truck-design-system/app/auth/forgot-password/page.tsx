'use client'

import { FormEvent, useState } from 'react'
import styles from './forgot-password.module.css'

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    window.setTimeout(() => {
      setIsSubmitting(false)
      setIsSent(true)
    }, 900)
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
          <h1 id="reset-title">Reset your password</h1>
          <p className={styles.subtext}>Enter your email — if you have an account, we&apos;ll send a reset link.</p>
        </div>

        {isSent ? (
          <div className={styles.success} role="status">
            <div className={styles.successIcon} aria-hidden="true">✓</div>
            <p>Check your email for a link to reset your password.</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />

            <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send reset link'}
              {!isSubmitting && <span aria-hidden="true">→</span>}
            </button>
          </form>
        )}

        <a className={styles.backLink} href="/login">Back to sign in</a>
      </section>

      <p className={styles.footerNote}>Your shift starts here.</p>
    </main>
  )
}
