import styles from "./privacy.module.css"

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <article className={styles.document}>
        <p className={styles.kicker}>Solo Truck</p>
        <h1>Privacy Policy</h1>
        <p className={styles.updated}>Last updated September 2026. This is a general template, not legal advice — it should be reviewed by a professional before you rely on it with real, paying customers.</p>

        <section>
          <h2>What we collect</h2>
          <p>From the truck owner (email, business/truck name, city/state, billing details handled by payment provider); operational records (equipment names/thresholds, temp logs, checklist runs, corrective actions with photos, permits/documents, staff names for PIN attribution); automatically on public pages only (GA4 analytics).</p>
        </section>
        <section>
          <h2>How we use it</h2>
          <p>Solely to run the app, showing logs/checklists/documents back, computing range status, generating Inspector Mode reports, sending trial/billing emails. Never sold, never used to advertise.</p>
        </section>
        <section>
          <h2>Analytics — public pages only</h2>
          <p>GA4 on marketing site only (landing, free tools, comparison pages, this page). Never loaded inside the app itself — once signed in and logging, nothing is sent to analytics. Compliance records are not product-analytics data.</p>
        </section>
        <section>
          <h2>Records can&apos;t be silently edited or deleted</h2>
          <p>Append-only by design, once saved an entry can&apos;t be altered/removed by anyone. Mistakes get a correction with a note; both entries stay visible.</p>
        </section>
        <section>
          <h2>Inspector Mode links</h2>
          <p>Random unguessable token, expiry the owner controls, opening logs timestamp+IP shown to the owner.</p>
        </section>
        <section>
          <h2>Documents &amp; photos</h2>
          <p>Private bucket, short-lived signed URLs, never scanned/sold/shared.</p>
        </section>
        <section>
          <h2>Who we share data with</h2>
          <ul>
            <li>Supabase (hosting)</li>
            <li>Dodo Payments (billing merchant of record)</li>
            <li>Resend (emails)</li>
            <li>Sentry (error monitoring, scrubbed of PII)</li>
            <li>Google Analytics (public pages only)</li>
          </ul>
          <p>We don&apos;t sell your data to anyone, for any purpose.</p>
        </section>
        <section>
          <h2>Your data, always yours</h2>
          <p>Export to PDF/CSV any time, keep read access after cancelling.</p>
        </section>
        <section>
          <h2>Contact</h2>
          <p><a href="mailto:privacy@solotruck.app">privacy@solotruck.app</a>.</p>
        </section>
      </article>
    </main>
  )
}
