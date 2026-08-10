import { describe, it, expect } from 'vitest';
import { hasWriteAccess, billingBannerFor } from './access';

describe('hasWriteAccess', () => {
  const now = new Date('2026-08-01T00:00:00Z');

  it('denies when there is no subscription row', () => {
    expect(hasWriteAccess(null, now)).toBe(false);
  });

  it('allows trialing before trial_ends_at', () => {
    expect(
      hasWriteAccess({ status: 'trialing', trialEndsAt: '2026-08-02T00:00:00Z', currentPeriodEnd: null }, now),
    ).toBe(true);
  });

  it('denies trialing once trial_ends_at has passed', () => {
    expect(
      hasWriteAccess({ status: 'trialing', trialEndsAt: '2026-07-31T00:00:00Z', currentPeriodEnd: null }, now),
    ).toBe(false);
  });

  it('allows active regardless of period end', () => {
    expect(
      hasWriteAccess(
        { status: 'active', trialEndsAt: '2026-01-01T00:00:00Z', currentPeriodEnd: '2026-01-01T00:00:00Z' },
        now,
      ),
    ).toBe(true);
  });

  it('allows past_due (payment retrying, still usable)', () => {
    expect(
      hasWriteAccess(
        { status: 'past_due', trialEndsAt: '2026-01-01T00:00:00Z', currentPeriodEnd: '2026-01-01T00:00:00Z' },
        now,
      ),
    ).toBe(true);
  });

  it('allows cancelled until current_period_end', () => {
    expect(
      hasWriteAccess(
        { status: 'cancelled', trialEndsAt: '2026-01-01T00:00:00Z', currentPeriodEnd: '2026-08-15T00:00:00Z' },
        now,
      ),
    ).toBe(true);
  });

  it('denies cancelled once current_period_end has passed', () => {
    expect(
      hasWriteAccess(
        { status: 'cancelled', trialEndsAt: '2026-01-01T00:00:00Z', currentPeriodEnd: '2026-07-30T00:00:00Z' },
        now,
      ),
    ).toBe(false);
  });

  it('denies cancelled with no current_period_end at all', () => {
    expect(
      hasWriteAccess({ status: 'cancelled', trialEndsAt: '2026-01-01T00:00:00Z', currentPeriodEnd: null }, now),
    ).toBe(false);
  });

  it('denies expired', () => {
    expect(
      hasWriteAccess(
        { status: 'expired', trialEndsAt: '2026-01-01T00:00:00Z', currentPeriodEnd: '2026-01-01T00:00:00Z' },
        now,
      ),
    ).toBe(false);
  });
});

describe('billingBannerFor', () => {
  const now = new Date('2026-08-01T00:00:00Z');

  it('is null with no subscription row', () => {
    expect(billingBannerFor(null, now)).toBeNull();
  });

  it('is null when trial has plenty of time left', () => {
    expect(
      billingBannerFor({ status: 'trialing', trialEndsAt: '2026-08-10T00:00:00Z', currentPeriodEnd: null }, now),
    ).toBeNull();
  });

  it('warns (non-urgent) when trial ends within 3 days', () => {
    const banner = billingBannerFor(
      { status: 'trialing', trialEndsAt: '2026-08-02T00:00:00Z', currentPeriodEnd: null },
      now,
    );
    expect(banner?.urgent).toBe(false);
    expect(banner?.message).toContain('trial ends');
  });

  it('is urgent once trial has ended', () => {
    const banner = billingBannerFor(
      { status: 'trialing', trialEndsAt: '2026-07-31T00:00:00Z', currentPeriodEnd: null },
      now,
    );
    expect(banner?.urgent).toBe(true);
  });

  it('is null when active', () => {
    expect(
      billingBannerFor({ status: 'active', trialEndsAt: '2026-01-01T00:00:00Z', currentPeriodEnd: null }, now),
    ).toBeNull();
  });

  it('is urgent when past_due', () => {
    const banner = billingBannerFor(
      { status: 'past_due', trialEndsAt: '2026-01-01T00:00:00Z', currentPeriodEnd: null },
      now,
    );
    expect(banner?.urgent).toBe(true);
  });

  it('is non-urgent when cancelled but still within the paid period', () => {
    const banner = billingBannerFor(
      { status: 'cancelled', trialEndsAt: '2026-01-01T00:00:00Z', currentPeriodEnd: '2026-08-15T00:00:00Z' },
      now,
    );
    expect(banner?.urgent).toBe(false);
  });

  it('is urgent when cancelled and past the paid period', () => {
    const banner = billingBannerFor(
      { status: 'cancelled', trialEndsAt: '2026-01-01T00:00:00Z', currentPeriodEnd: '2026-07-30T00:00:00Z' },
      now,
    );
    expect(banner?.urgent).toBe(true);
  });

  it('is urgent when expired', () => {
    const banner = billingBannerFor(
      { status: 'expired', trialEndsAt: '2026-01-01T00:00:00Z', currentPeriodEnd: null },
      now,
    );
    expect(banner?.urgent).toBe(true);
  });
});
