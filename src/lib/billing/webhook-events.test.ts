import { describe, it, expect } from 'vitest';
import { statusForEventType } from './webhook-events';

describe('statusForEventType', () => {
  it('maps activation/renewal to active', () => {
    expect(statusForEventType('subscription.active')).toBe('active');
    expect(statusForEventType('subscription.renewed')).toBe('active');
  });

  it('maps on_hold to past_due', () => {
    expect(statusForEventType('subscription.on_hold')).toBe('past_due');
  });

  it('maps cancelled to cancelled', () => {
    expect(statusForEventType('subscription.cancelled')).toBe('cancelled');
  });

  it('maps expired/failed to expired', () => {
    expect(statusForEventType('subscription.expired')).toBe('expired');
    expect(statusForEventType('subscription.failed')).toBe('expired');
  });

  it('returns null for events that do not change status', () => {
    expect(statusForEventType('payment.succeeded')).toBeNull();
    expect(statusForEventType('payment.failed')).toBeNull();
    expect(statusForEventType('subscription.plan_changed')).toBeNull();
  });
});
