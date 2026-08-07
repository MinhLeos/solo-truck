import { describe, expect, it } from 'vitest';
import { computeStreakFromDates } from './streaks';

const TIMEZONE = 'America/Chicago';
const MONDAY = 1;

describe('computeStreakFromDates', () => {
  it('counts consecutive shift-days with a log, stopping at the first miss', () => {
    // Mondays 2026-01-12, 01-19, 01-26 logged; 2026-01-05 (Monday before) missed.
    const logged = new Set(['2026-01-12', '2026-01-19', '2026-01-26']);
    const streak = computeStreakFromDates(
      '2026-01-27', // "yesterday" relative to a Tuesday
      (date) => logged.has(date),
      (dow) => dow === MONDAY,
      TIMEZONE,
    );
    expect(streak).toBe(3);
  });

  it('does not break the streak on non-shift days, even with no log that day', () => {
    // Shift days are Mon/Wed/Fri only; Tue/Thu/weekend have no logs at all
    // (isShiftDay is false for those, so hasLogOnDate is never even
    // consulted for them in a correct implementation).
    const shiftDays = new Set([1, 3, 5]); // Mon, Wed, Fri
    const logged = new Set(['2026-01-12', '2026-01-14', '2026-01-16']); // Mon, Wed, Fri
    const streak = computeStreakFromDates(
      '2026-01-17', // Saturday
      (date) => logged.has(date),
      (dow) => shiftDays.has(dow),
      TIMEZONE,
    );
    expect(streak).toBe(3);
  });

  it('breaks the streak on a missed shift day', () => {
    const logged = new Set(['2026-01-19', '2026-01-26']); // 01-12 missing
    const streak = computeStreakFromDates(
      '2026-01-27',
      (date) => logged.has(date),
      (dow) => dow === MONDAY,
      TIMEZONE,
    );
    expect(streak).toBe(2);
  });

  it('is zero when yesterday itself (a shift day) has no log', () => {
    const logged = new Set(['2026-01-19']);
    const streak = computeStreakFromDates(
      '2026-01-26', // Monday, unlogged
      (date) => logged.has(date),
      (dow) => dow === MONDAY,
      TIMEZONE,
    );
    expect(streak).toBe(0);
  });

  it('stays correct walking backward across a DST transition', () => {
    // America/Chicago springs forward 2026-03-08. A daily shift logged every
    // day from 03-05 through 03-10 should still show a clean 6-day streak —
    // the calendar-date walk must not skip/duplicate a day across the
    // transition.
    const logged = new Set([
      '2026-03-05',
      '2026-03-06',
      '2026-03-07',
      '2026-03-08',
      '2026-03-09',
      '2026-03-10',
    ]);
    const streak = computeStreakFromDates(
      '2026-03-10',
      (date) => logged.has(date),
      () => true, // every day is a shift day
      TIMEZONE,
    );
    expect(streak).toBe(6);
  });
});
