import { dayOfWeekInTimezone, utcToZonedDateString, zonedTimeToUtc, type TimeOfDay } from './timezone';

export interface ShiftWindow {
  dayOfWeek: number;
  startTime: TimeOfDay;
  endTime: TimeOfDay;
}

function shiftBoundsUtc(now: Date, shift: ShiftWindow, timezone: string): [Date, Date] | null {
  const todayStr = utcToZonedDateString(now, timezone);
  if (dayOfWeekInTimezone(todayStr, timezone) !== shift.dayOfWeek) return null;
  return [
    zonedTimeToUtc(todayStr, shift.startTime, timezone),
    zonedTimeToUtc(todayStr, shift.endTime, timezone),
  ];
}

// Due during the window [shiftStart - reminderMinutes, shiftStart) — the
// caller is responsible for tracking `alreadySentToday` (via
// notifications_log) so a 15-minute cron cadence doesn't re-send on every
// tick within that window.
export function isPreShiftReminderDue(
  now: Date,
  shift: ShiftWindow,
  timezone: string,
  reminderMinutes: number,
  alreadySentToday: boolean,
): boolean {
  if (alreadySentToday) return false;
  const bounds = shiftBoundsUtc(now, shift, timezone);
  if (!bounds) return false;
  const [start] = bounds;
  const reminderAt = new Date(start.getTime() - reminderMinutes * 60_000);
  return now.getTime() >= reminderAt.getTime() && now.getTime() < start.getTime();
}

// Due once every `intervalMinutes` while the shift is active — measured
// from the last reminder actually SENT, not the last log recorded, so the
// cadence stays predictable regardless of how often the owner logs.
export function isTempLogReminderDue(
  now: Date,
  shift: ShiftWindow,
  timezone: string,
  intervalMinutes: number,
  lastReminderSentAt: Date | null,
): boolean {
  const bounds = shiftBoundsUtc(now, shift, timezone);
  if (!bounds) return false;
  const [start, end] = bounds;
  if (now < start || now >= end) return false;
  if (!lastReminderSentAt) return true;
  return now.getTime() - lastReminderSentAt.getTime() >= intervalMinutes * 60_000;
}
