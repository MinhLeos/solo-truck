export type DocumentStatus = 'valid' | 'expiring_soon' | 'expired' | 'no_expiry';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Pure so the badge color (documents/page.tsx) and the expiry-reminder cron
// (documents/reminders.ts) can't drift on what "expiring soon" means.
export function documentStatus(expiresAt: string | null, now: Date): DocumentStatus {
  if (!expiresAt) return 'no_expiry';
  const diffMs = new Date(expiresAt).getTime() - now.getTime();
  if (diffMs < 0) return 'expired';
  if (diffMs <= THIRTY_DAYS_MS) return 'expiring_soon';
  return 'valid';
}
