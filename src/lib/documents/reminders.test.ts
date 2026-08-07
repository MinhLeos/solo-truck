import { describe, expect, it } from 'vitest';
import { isDocumentExpiryReminderDue } from './reminders';

const NOW = new Date('2026-08-07T12:00:00.000Z');

describe('isDocumentExpiryReminderDue', () => {
  it('thirty_day is due within 30 days of expiry', () => {
    expect(
      isDocumentExpiryReminderDue('2026-08-20T00:00:00.000Z', NOW, 'thirty_day', false),
    ).toBe(true);
  });

  it('thirty_day is NOT due more than 30 days out', () => {
    expect(
      isDocumentExpiryReminderDue('2026-10-01T00:00:00.000Z', NOW, 'thirty_day', false),
    ).toBe(false);
  });

  it('seven_day is NOT due when 10 days remain', () => {
    expect(
      isDocumentExpiryReminderDue('2026-08-17T00:00:00.000Z', NOW, 'seven_day', false),
    ).toBe(false);
  });

  it('seven_day is due within 7 days of expiry', () => {
    expect(
      isDocumentExpiryReminderDue('2026-08-12T00:00:00.000Z', NOW, 'seven_day', false),
    ).toBe(true);
  });

  it('is NOT due once already sent, regardless of timing', () => {
    expect(
      isDocumentExpiryReminderDue('2026-08-12T00:00:00.000Z', NOW, 'seven_day', true),
    ).toBe(false);
  });

  it('is NOT due once the document has already expired', () => {
    expect(
      isDocumentExpiryReminderDue('2026-08-01T00:00:00.000Z', NOW, 'seven_day', false),
    ).toBe(false);
  });
});
