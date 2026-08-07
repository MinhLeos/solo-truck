// Pure Intl.DateTimeFormat-based timezone math — no date-fns-tz/Temporal
// dependency needed. DST-correct by construction: the offset is derived by
// asking Intl what the wall-clock time actually is in that zone for a given
// instant, not by looking up a fixed UTC offset per zone.

export interface TimeOfDay {
  hour: number;
  minute: number;
}

function getTimezoneOffsetMinutes(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = Object.fromEntries(dtf.formatToParts(date).map((p) => [p.type, p.value]));
  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return (asIfUtc - date.getTime()) / 60000;
}

// A wall-clock date+time in a given IANA timezone -> the actual UTC instant.
export function zonedTimeToUtc(dateStr: string, time: TimeOfDay, timeZone: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const asIfUtc = Date.UTC(year, month - 1, day, time.hour, time.minute);
  const offsetMinutes = getTimezoneOffsetMinutes(new Date(asIfUtc), timeZone);
  return new Date(asIfUtc - offsetMinutes * 60000);
}

// A UTC instant -> its local calendar date (YYYY-MM-DD) in a given timezone.
export function utcToZonedDateString(date: Date, timeZone: string): string {
  const dtf = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return dtf.format(date);
}

export function todayInTimezone(timeZone: string): string {
  return utcToZonedDateString(new Date(), timeZone);
}

// [start, end) UTC range covering one local calendar day in a timezone.
export function businessDayRangeUtc(dateStr: string, timeZone: string): [Date, Date] {
  const start = zonedTimeToUtc(dateStr, { hour: 0, minute: 0 }, timeZone);
  const [year, month, day] = dateStr.split('-').map(Number);
  const nextDateStr = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
  const end = zonedTimeToUtc(nextDateStr, { hour: 0, minute: 0 }, timeZone);
  return [start, end];
}

// Plain calendar-date arithmetic — once you already have a local date
// string, shifting it by N days is timezone-independent (it's just a
// calendar, not an instant), so no Intl call is needed here.
export function addDays(dateStr: string, delta: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + delta)).toISOString().slice(0, 10);
}

// Local calendar date (YYYY-MM-DD) -> day of week, 0 (Sun) - 6 (Sat), matching
// the `shifts.day_of_week` convention — derived from the same UTC instant the
// rest of this module already computes, not `Date#getDay()` (which reads the
// SERVER's local timezone, not the truck's).
export function dayOfWeekInTimezone(dateStr: string, timeZone: string): number {
  const [start] = businessDayRangeUtc(dateStr, timeZone);
  const dtf = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' });
  const weekday = dtf.format(start);
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[weekday];
}
