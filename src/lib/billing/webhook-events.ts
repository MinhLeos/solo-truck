import type { SubscriptionStatus } from './access';

// Only the event types that change subscription status; anything else
// (payment.succeeded, subscription.plan_changed, ...) returns null and is
// logged for idempotency but otherwise ignored.
export function statusForEventType(type: string): SubscriptionStatus | null {
  switch (type) {
    case 'subscription.active':
    case 'subscription.renewed':
      return 'active';
    case 'subscription.on_hold':
      return 'past_due';
    case 'subscription.cancelled':
      return 'cancelled';
    case 'subscription.expired':
    case 'subscription.failed':
      return 'expired';
    default:
      return null;
  }
}
