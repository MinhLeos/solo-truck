import { dayOfWeekInTimezone, utcToZonedDateString } from './timezone';

const MONDAY = 1;

// Fires once per truck-local Monday — the cron's existing "already sent
// today" query pattern (see reminders/route.ts) is enough to dedup within
// the day, so this only needs to gate on it being the right day of week.
export function isWeeklyDigestDue(now: Date, timezone: string, alreadySentThisWeek: boolean): boolean {
  if (alreadySentThisWeek) return false;
  const today = utcToZonedDateString(now, timezone);
  return dayOfWeekInTimezone(today, timezone) === MONDAY;
}
