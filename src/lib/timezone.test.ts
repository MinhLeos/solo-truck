import { describe, expect, it } from 'vitest';
import {
  businessDayRangeUtc,
  dayOfWeekInTimezone,
  utcToZonedDateString,
  zonedTimeToUtc,
} from './timezone';

describe('timezone', () => {
  it('converts a wall-clock time in America/Chicago (CST, UTC-6) to UTC', () => {
    const utc = zonedTimeToUtc('2026-01-15', { hour: 9, minute: 0 }, 'America/Chicago');
    expect(utc.toISOString()).toBe('2026-01-15T15:00:00.000Z');
  });

  it('handles the spring-forward DST transition correctly (CDT, UTC-5)', () => {
    // 2026-03-08 is when America/Chicago springs forward to CDT.
    const beforeDst = zonedTimeToUtc('2026-03-07', { hour: 9, minute: 0 }, 'America/Chicago');
    const afterDst = zonedTimeToUtc('2026-03-09', { hour: 9, minute: 0 }, 'America/Chicago');
    expect(beforeDst.toISOString()).toBe('2026-03-07T15:00:00.000Z'); // still CST, UTC-6
    expect(afterDst.toISOString()).toBe('2026-03-09T14:00:00.000Z'); // now CDT, UTC-5
  });

  it('round-trips a UTC instant back to the correct local calendar date', () => {
    // 11pm Pacific on Jan 15 is already Jan 16 UTC — the local date must not
    // just be a naive UTC slice.
    const utc = zonedTimeToUtc('2026-01-15', { hour: 23, minute: 0 }, 'America/Los_Angeles');
    expect(utcToZonedDateString(utc, 'America/Los_Angeles')).toBe('2026-01-15');
    expect(utcToZonedDateString(utc, 'UTC')).toBe('2026-01-16');
  });

  it('computes a [start, end) UTC range for one local day, DST-correct', () => {
    const [start, end] = businessDayRangeUtc('2026-03-08', 'America/Chicago');
    expect(start.toISOString()).toBe('2026-03-08T06:00:00.000Z'); // midnight CST
    expect(end.toISOString()).toBe('2026-03-09T05:00:00.000Z'); // midnight CDT next day
  });

  it('derives the correct day-of-week for a timezone far from the server clock', () => {
    // 11pm Jan 15 Pacific is already Jan 16 (Friday) in UTC/most other zones.
    expect(dayOfWeekInTimezone('2026-01-15', 'America/Los_Angeles')).toBe(4); // Thursday
  });
});
