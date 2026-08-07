import type { SupabaseClient } from '@supabase/supabase-js';
import { addDays, dayOfWeekInTimezone, utcToZonedDateString } from './timezone';

// Runtime-computed, not materialized (ARCHITECTURE.md §6.5 / BACKLOG.md —
// the reserved `streaks` table stays unused until this gets slow enough to
// need it). Pure and DB-free: callers supply "does this shift day-of-week
// exist" and "was there a log on this date" as plain functions/sets, so this
// is trivially unit-testable across timezones and DST without a database.
export function computeStreakFromDates(
  startDate: string,
  hasLogOnDate: (date: string) => boolean,
  isShiftDay: (dayOfWeek: number) => boolean,
  timezone: string,
  maxDays = 365,
): number {
  let streak = 0;
  let cursor = startDate;

  for (let i = 0; i < maxDays; i++) {
    const dow = dayOfWeekInTimezone(cursor, timezone);
    if (isShiftDay(dow)) {
      if (hasLogOnDate(cursor)) {
        streak++;
      } else {
        break;
      }
    }
    // Non-shift days don't break the streak — they're just skipped.
    cursor = addDays(cursor, -1);
  }

  return streak;
}

// DB-facing wrapper: yesterday is the starting point, not today — today's
// shift may still be in progress, and a streak shouldn't break on a day
// that hasn't finished yet.
export async function computeCurrentStreak(
  supabase: SupabaseClient,
  truckId: string,
  shiftDaysOfWeek: number[],
  timezone: string,
  today: string,
): Promise<number> {
  const since = addDays(today, -95);
  const { data: logs } = await supabase
    .from('logs')
    .select('recorded_at')
    .eq('truck_id', truckId)
    .gte('recorded_at', new Date(since).toISOString());

  const datesWithLogs = new Set(
    ((logs ?? []) as { recorded_at: string }[]).map((row) =>
      utcToZonedDateString(new Date(row.recorded_at), timezone),
    ),
  );
  const shiftDaySet = new Set(shiftDaysOfWeek);

  return computeStreakFromDates(
    addDays(today, -1),
    (date) => datesWithLogs.has(date),
    (dow) => shiftDaySet.has(dow),
    timezone,
  );
}
