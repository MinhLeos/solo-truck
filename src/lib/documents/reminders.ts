export type ExpiryMilestone = 'thirty_day' | 'seven_day';

const MILESTONE_DAYS: Record<ExpiryMilestone, number> = {
  thirty_day: 30,
  seven_day: 7,
};

// Fires once a document is within its milestone window and hasn't crossed
// expiry yet — the cron checks `alreadySent` per (document, milestone) via
// notifications_log.related_id, so this only decides the time-window part.
export function isDocumentExpiryReminderDue(
  expiresAt: string,
  now: Date,
  milestone: ExpiryMilestone,
  alreadySent: boolean,
): boolean {
  if (alreadySent) return false;
  const diffDays = (new Date(expiresAt).getTime() - now.getTime()) / (24 * 60 * 60 * 1000);
  return diffDays >= 0 && diffDays <= MILESTONE_DAYS[milestone];
}
