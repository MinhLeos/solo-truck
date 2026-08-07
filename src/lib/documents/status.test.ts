import { describe, expect, it } from 'vitest';
import { documentStatus } from './status';

const NOW = new Date('2026-08-07T12:00:00.000Z');

describe('documentStatus', () => {
  it('is no_expiry when expires_at is null', () => {
    expect(documentStatus(null, NOW)).toBe('no_expiry');
  });

  it('is valid when more than 30 days remain', () => {
    expect(documentStatus('2026-10-01T00:00:00.000Z', NOW)).toBe('valid');
  });

  it('is expiring_soon within 30 days', () => {
    expect(documentStatus('2026-08-20T00:00:00.000Z', NOW)).toBe('expiring_soon');
  });

  it('is expired once the date has passed', () => {
    expect(documentStatus('2026-08-01T00:00:00.000Z', NOW)).toBe('expired');
  });
});
