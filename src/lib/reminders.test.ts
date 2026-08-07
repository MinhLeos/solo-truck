import { describe, expect, it } from 'vitest';
import { isPreShiftReminderDue, isTempLogReminderDue, type ShiftWindow } from './reminders';
import { dayOfWeekInTimezone } from './timezone';

const CHICAGO_DATE = '2026-01-12'; // Monday
const chicagoShift: ShiftWindow = {
  dayOfWeek: dayOfWeekInTimezone(CHICAGO_DATE, 'America/Chicago'),
  startTime: { hour: 11, minute: 0 },
  endTime: { hour: 19, minute: 0 },
};

const LA_DATE = '2026-01-13'; // Tuesday
const laShift: ShiftWindow = {
  dayOfWeek: dayOfWeekInTimezone(LA_DATE, 'America/Los_Angeles'),
  startTime: { hour: 9, minute: 0 },
  endTime: { hour: 17, minute: 0 },
};

describe('isPreShiftReminderDue', () => {
  it('is due exactly reminderMinutes before shift start, in America/Chicago', () => {
    const due = new Date('2026-01-12T16:30:00.000Z'); // 10:30am CST = 30 min before 11am open
    expect(isPreShiftReminderDue(due, chicagoShift, 'America/Chicago', 30, false)).toBe(true);
  });

  it('is NOT due before the reminder window opens', () => {
    const tooEarly = new Date('2026-01-12T16:29:00.000Z');
    expect(isPreShiftReminderDue(tooEarly, chicagoShift, 'America/Chicago', 30, false)).toBe(false);
  });

  it('is NOT due once the shift has actually started', () => {
    const shiftStart = new Date('2026-01-12T17:00:00.000Z'); // 11am CST
    expect(isPreShiftReminderDue(shiftStart, chicagoShift, 'America/Chicago', 30, false)).toBe(false);
  });

  it('respects alreadySentToday regardless of timing', () => {
    const due = new Date('2026-01-12T16:30:00.000Z');
    expect(isPreShiftReminderDue(due, chicagoShift, 'America/Chicago', 30, true)).toBe(false);
  });

  it('is NOT due on a day that does not match the shift (a second timezone case)', () => {
    const wrongDay = new Date('2026-01-14T16:30:00.000Z'); // Wednesday
    expect(isPreShiftReminderDue(wrongDay, chicagoShift, 'America/Chicago', 30, false)).toBe(false);
  });

  it('works correctly in a second timezone, America/Los_Angeles', () => {
    const due = new Date('2026-01-13T16:30:00.000Z'); // 8:30am PST, 30 min before 9am open
    expect(isPreShiftReminderDue(due, laShift, 'America/Los_Angeles', 30, false)).toBe(true);
  });
});

describe('isTempLogReminderDue', () => {
  it('is due immediately if no reminder has ever been sent, while shift is active', () => {
    const duringShift = new Date('2026-01-12T18:00:00.000Z'); // noon CST
    expect(
      isTempLogReminderDue(duringShift, chicagoShift, 'America/Chicago', 240, null),
    ).toBe(true);
  });

  it('is NOT due outside the shift window', () => {
    const beforeShift = new Date('2026-01-12T15:00:00.000Z'); // 9am CST, shift starts 11am
    expect(
      isTempLogReminderDue(beforeShift, chicagoShift, 'America/Chicago', 240, null),
    ).toBe(false);
  });

  it('is NOT due before the interval has elapsed since the last reminder', () => {
    const now = new Date('2026-01-12T19:00:00.000Z'); // 1pm CST
    const lastSent = new Date('2026-01-12T18:00:00.000Z'); // noon CST, 1h ago — interval is 4h
    expect(
      isTempLogReminderDue(now, chicagoShift, 'America/Chicago', 240, lastSent),
    ).toBe(false);
  });

  it('is due once the interval has elapsed since the last reminder', () => {
    const now = new Date('2026-01-12T22:00:00.000Z'); // 4pm CST
    const lastSent = new Date('2026-01-12T18:00:00.000Z'); // noon CST, exactly 4h ago
    expect(
      isTempLogReminderDue(now, chicagoShift, 'America/Chicago', 240, lastSent),
    ).toBe(true);
  });

  it('works correctly in a second timezone, America/Los_Angeles', () => {
    const duringShift = new Date('2026-01-13T20:00:00.000Z'); // noon PST
    expect(isTempLogReminderDue(duringShift, laShift, 'America/Los_Angeles', 240, null)).toBe(
      true,
    );
  });
});
