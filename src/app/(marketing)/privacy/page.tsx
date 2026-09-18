import type { Metadata } from 'next';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = siteMetadata({
  title: 'Privacy Policy — Solo Truck',
  description: 'How Solo Truck collects, uses, and protects your data.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <article className="flex flex-col gap-5 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-ink [&_p]:text-ink-soft [&_li]:text-ink-soft [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1">
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-wide text-ink">
        Privacy Policy
      </h1>
      <p className="text-sm text-ink-soft">
        Last updated September 2026. This is a general template, not legal advice — it should be
        reviewed by a professional before you rely on it with real, paying customers.
      </p>

      <h2>What we collect</h2>
      <p>
        <strong>From you (the truck owner):</strong> your email address (for signing in), business
        and truck name, city/state, and — when you subscribe — billing details handled entirely by
        our payment provider (we never see or store your card number).
      </p>
      <p>
        <strong>Operational records you or your staff enter:</strong> equipment names and
        temperature thresholds; temperature log entries; checklist run results; corrective actions
        (including photos, stored privately); permits and other documents (business license,
        commissary agreement, food manager certificate); and staff names used for PIN attribution
        (SECURITY.md §7 — the PIN identifies who logged an entry, it is not a login credential).
      </p>
      <p>
        <strong>Automatically, on public pages only:</strong> basic analytics (page views, which
        button was clicked) via Google Analytics — see &quot;Analytics&quot; below.
      </p>

      <h2>How we use it</h2>
      <p>
        Solely to run the app: showing your logs, checklists, and documents back to you, computing
        whether an equipment reading is in range, generating your Inspector Mode report, and
        sending trial/billing emails. We don&apos;t sell any of this data, and we don&apos;t use it
        to advertise to you.
      </p>

      <h2>Analytics — public pages only</h2>
      <p>
        We use Google Analytics (GA4) on the marketing site — this landing page, the free tools,
        the comparison pages, and this page — to see which pages and calls-to-action work. GA4 is
        <strong> never loaded inside the app itself.</strong> Once you&apos;re signed in and
        logging temperatures, checklists, or corrective actions, none of that activity is sent to
        Google Analytics or any third-party analytics tool. Your compliance records are not
        product-analytics data.
      </p>

      <h2>Records can&apos;t be silently edited or deleted</h2>
      <p>
        Temperature logs, checklist runs, and corrective actions are append-only by design — once
        saved, an entry can&apos;t be altered or removed, by you, your staff, or us. That&apos;s
        what makes the record worth trusting to an inspector. If you make a mistake, you add a
        correction with a note; both entries stay visible.
      </p>

      <h2>Inspector Mode links</h2>
      <p>
        When you generate an Inspector Mode link, it&apos;s a random, unguessable token with an
        expiry you control. Anyone with the link can view your compliance report while it&apos;s
        valid — no account, no personal data about the inspector is collected beyond the fact that
        the link was opened (timestamp and IP), which we show you so you know it was used.
      </p>

      <h2>Documents & photos</h2>
      <p>
        Permits, commissary agreements, certifications, and corrective-action photos are stored in
        a private bucket, accessed only through short-lived signed URLs generated after we verify
        you own the record. We don&apos;t scan, sell, or share these files.
      </p>

      <h2>Who we share data with</h2>
      <ul>
        <li>Supabase — database and file storage hosting.</li>
        <li>Dodo Payments — our merchant of record for subscription billing.</li>
        <li>Resend — sending trial/reminder/receipt emails.</li>
        <li>Sentry — error monitoring (scrubbed of names, emails, and permit numbers).</li>
        <li>Google Analytics — public marketing pages only, as described above.</li>
      </ul>
      <p>We don&apos;t sell your data to anyone, for any purpose.</p>

      <h2>Your data, always yours</h2>
      <p>
        Export everything to PDF or CSV any time from inside the app. Even if you cancel your
        subscription, you keep read access and can still export your records — we don&apos;t hold
        your compliance history hostage.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy or your data:{' '}
        <a href="mailto:privacy@solotruck.app">privacy@solotruck.app</a>.
      </p>
    </article>
  );
}
