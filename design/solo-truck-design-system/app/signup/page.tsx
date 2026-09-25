'use client'

import { FormEvent, useState } from 'react'
import styles from './signup.module.css'

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    window.setTimeout(() => {
      setIsSubmitting(false)
      setIsComplete(true)
    }, 900)
  }

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <a className={styles.brand} href="/" aria-label="Solo Truck home">
        <span className={styles.brandMark}>ST</span>
        <span>Solo Truck</span>
      </a>

      <section className={styles.card} aria-labelledby="signup-title">
        {!isComplete ? (
          <>
            <div className={styles.cardIntro}>
              <p className={styles.eyebrow}>Daily log access</p>
              <h1 id="signup-title">Create an account</h1>
              <p className={styles.subtext}>Set up your food truck.</p>
            </div>

            <button className={styles.googleButton} type="button">
              <span className={styles.googleIcon} aria-hidden="true">G</span>
              <span>Continue with Google</span>
            </button>

            <div className={styles.divider} role="separator"><span>or</span></div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />

              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" placeholder="At least 8 characters" minLength={8} autoComplete="new-password" required />

              <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account…' : 'Create account'}
                {!isSubmitting && <span aria-hidden="true">→</span>}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.success}>
            <p className={styles.successMark} aria-hidden="true">✓</p>
            <h1 id="signup-title">Check your email to confirm your account, then sign in.</h1>
            <p className={styles.successLink}><a href="/login">Already have an account? Sign in</a></p>
          </div>
        )}
      </section>

      <p className={styles.footerNote}>Your shift starts here.</p>
    </main>
  )
}
