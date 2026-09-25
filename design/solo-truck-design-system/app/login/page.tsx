'use client'

import { FormEvent, useState } from 'react'
import styles from './login.module.css'

export default function LoginPage() {
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

      <section className={styles.card} aria-labelledby="login-title">
        <div className={styles.cardIntro}>
          <p className={styles.eyebrow}>Daily log access</p>
          <h1 id="login-title">Sign in</h1>
          <p className={styles.subtext}>Welcome back.</p>
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
          <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" required />

          <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
            {!isSubmitting && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <nav className={styles.links} aria-label="Account links">
          <a href="/forgot-password">Forgot password?</a>
          <a href="/signup">Create an account</a>
        </nav>
      </section>

      <p className={styles.footerNote}>Your shift starts here.</p>
    </main>
  )
}
