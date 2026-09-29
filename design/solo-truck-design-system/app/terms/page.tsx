import styles from "./terms.module.css"

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <article className={styles.document}>
        <p className={styles.kicker}>Solo Truck</p>
        <h1>Terms of Service</h1>
        <p className={styles.updated}>Last updated September 2026. This is a general template, not legal advice — it should be reviewed by a professional before you rely on it with real, paying customers.</p>

        <section>
          <h2>What Solo Truck is</h2>
          <p>Software for logging temps/checklists/corrective actions/documents, generating Inspector Mode reports.</p>
        </section>
        <section>
          <h2>Your subscription and trial</h2>
          <p>14-day free trial, no card required. Billed monthly/yearly via Dodo Payments (merchant of record). Cancel any time, access continues until period paid for ends.</p>
        </section>
        <section>
          <h2>Records are append-only — by design</h2>
          <p>Can&apos;t be edited/deleted once saved; corrections recorded alongside, both stay visible.</p>
        </section>
        <section>
          <h2>Staff PIN is attribution, not a login</h2>
          <p>4-digit PIN identifies who logged an entry, not a security credential; device must be physically secured.</p>
        </section>
        <section>
          <h2>Inspector Mode links are your responsibility</h2>
          <p>Owner controls creation/expiry/revocation; treat like a printed report.</p>
        </section>
        <section>
          <h2>Not legal or food-safety advice</h2>
          <p>Record-keeping tool only, no guarantee of passing inspection; FDA Food Code defaults, verify with local authority.</p>
        </section>
        <section>
          <h2>Your data, always yours</h2>
          <p>Export any time; account closure deletes data within 30 days except billing-record retention needs.</p>
        </section>
        <section>
          <h2>Changes to these terms</h2>
          <p>Material changes announced by email first.</p>
        </section>
        <section>
          <h2>Contact</h2>
          <p><a href="mailto:hello@solotruck.app">hello@solotruck.app</a>, <a href="/privacy">Privacy Policy</a>.</p>
        </section>
      </article>
    </main>
  )
}
