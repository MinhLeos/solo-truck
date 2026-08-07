import { describe, expect, it } from 'vitest';
import { isWeeklyDigestDue } from './digest';

describe('isWeeklyDigestDue', () => {
  it('is due on a Monday in America/Chicago', () => {
    const monday = new Date('2026-01-12T15:00:00.000Z'); // Monday 9am CST
    expect(isWeeklyDigestDue(monday, 'America/Chicago', false)).toBe(true);
  });

  it('is NOT due on a Tuesday', () => {
    const tuesday = new Date('2026-01-13T15:00:00.000Z');
    expect(isWeeklyDigestDue(tuesday, 'America/Chicago', false)).toBe(false);
  });

  it('respects alreadySentThisWeek regardless of day', () => {
    const monday = new Date('2026-01-12T15:00:00.000Z');
    expect(isWeeklyDigestDue(monday, 'America/Chicago', true)).toBe(false);
  });

  it('works correctly in a second timezone, America/Los_Angeles', () => {
    // 2026-01-12T07:00:00 UTC is still Sunday 11pm PST — the previous day
    // in this timezone, unlike in Chicago where the same instant is Monday.
    const stillSundayInLA = new Date('2026-01-12T07:00:00.000Z');
    expect(isWeeklyDigestDue(stillSundayInLA, 'America/Los_Angeles', false)).toBe(false);

    const mondayInLA = new Date('2026-01-12T18:00:00.000Z'); // 10am PST
    expect(isWeeklyDigestDue(mondayInLA, 'America/Los_Angeles', false)).toBe(true);
  });
});
