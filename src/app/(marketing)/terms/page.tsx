import type { Metadata } from 'next';
import Link from 'next/link';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = siteMetadata({
  title: 'Terms of Service — Solo Truck',
  description: 'The terms for using Solo Truck.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <article className="flex flex-col gap-5 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-ink [&_p]:text-ink-soft [&_a]:font-medium [&_a]:text-flame">
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-wide text-ink">
        Terms of Service
      </h1>
      <p className="text-sm text-ink-soft">
        Last updated September 2026. This is a general template, not legal advice — it should be
        reviewed by a professional before you rely on it with real, paying customers.
      </p>

      <h2>1. What Solo Truck is</h2>
      <p>
        Solo Truck is software for independent food truck owners to log equipment temperatures,
        run pre-shift checklists, record corrective actions, store compliance documents, and
        generate a read-only report for health inspectors (&quot;Inspector Mode&quot;). By
        creating an account, you agree to these terms.
      </p>

      <h2>2. Your subscription and trial</h2>
      <p>
        New accounts get a 14-day free trial, no card required. After the trial, Solo Truck is
        billed as a recurring subscription — monthly or yearly — processed by our payment
        provider (currently Dodo Payments, acting as merchant of record). You can cancel any time;
        your access continues until the end of the period you&apos;ve already paid for, and does
        not renew after that.
      </p>
      <p>
        If your trial ends or your subscription lapses, you lose the ability to log{' '}
        <strong>new</strong> entries. You keep read access to everything already recorded and can
        export it to PDF or CSV at any time — we never hold your compliance history hostage.
      </p>

      <h2>3. Records are append-only — by design</h2>
      <p>
        Temperature logs, checklist runs, and corrective actions cannot be edited or deleted once
        saved, by you, your staff, or us. If an entry is wrong, you record a correction alongside
        it; both stay visible. This isn&apos;t a limitation — it&apos;s what makes your records
        credible to an inspector, and it means we can&apos;t alter your history even if asked to.
      </p>

      <h2>4. Staff PIN is attribution, not a login</h2>
      <p>
        The 4-digit PIN your staff enters when logging an entry identifies who logged it. It is
        not a security credential and should not be treated as one — anyone using your truck&apos;s
        device while you&apos;re signed in can log an entry under any PIN. Keep your device
        physically secured.
      </p>

      <h2>5. Inspector Mode links are your responsibility</h2>
      <p>
        You control when an Inspector Mode link is created, how long it&apos;s valid, and when
        it&apos;s revoked. Anyone holding a valid, unexpired link can view the report it points to.
        Treat the link like you would a printed report — don&apos;t post it publicly.
      </p>

      <h2>6. Not legal or food-safety advice</h2>
      <p>
        Solo Truck is a record-keeping tool, not legal or food-safety advice, and using it does
        not guarantee you will pass a health inspection. Default temperature thresholds follow the
        FDA Food Code; actual requirements vary by state and county — always verify with your
        local health authority.
      </p>

      <h2>7. Your data, always yours</h2>
      <p>
        You can export everything to PDF or CSV at any time, whether or not you&apos;re a current
        subscriber. If you close your account, we delete your data within 30 days except where we
        need to retain billing records for legal/tax reasons.
      </p>

      <h2>8. Changes to these terms</h2>
      <p>
        We may update these terms as the product changes. Material changes will be announced by
        email before they take effect.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about these terms: <a href="mailto:hello@solotruck.app">hello@solotruck.app</a>.
        See also our <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </article>
  );
}
