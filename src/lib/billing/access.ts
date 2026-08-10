export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'cancelled' | 'expired';

export type SubscriptionForAccess = {
  status: SubscriptionStatus;
  trialEndsAt: string;
  currentPeriodEnd: string | null;
};

// Computed at call time rather than stored — no cron needs to flip status
// exactly at the trial boundary. SECURITY.md §4: this only ever gates
// WRITES. Reads, export, and syncing an already-queued item are never
// blocked here — see guard.ts and the offline write-queue for where that
// distinction is actually enforced.
export function hasWriteAccess(sub: SubscriptionForAccess | null, now: Date): boolean {
  if (!sub) return false;
  const nowMs = now.getTime();
  switch (sub.status) {
    case 'active':
    case 'past_due':
      return true;
    case 'trialing':
      return new Date(sub.trialEndsAt).getTime() > nowMs;
    case 'cancelled':
      return sub.currentPeriodEnd !== null && new Date(sub.currentPeriodEnd).getTime() > nowMs;
    case 'expired':
      return false;
  }
}

export type BillingBanner = { message: string; urgent: boolean };

const TRIAL_WARNING_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

// Pure so the "which message, how urgent" decision can be unit tested
// without a DB round-trip — the layout just renders whatever comes back.
export function billingBannerFor(sub: SubscriptionForAccess | null, now: Date): BillingBanner | null {
  if (!sub) return null;
  const nowMs = now.getTime();

  if (sub.status === 'trialing') {
    const trialEndsMs = new Date(sub.trialEndsAt).getTime();
    if (trialEndsMs <= nowMs) {
      return { message: 'Your trial has ended. Subscribe to keep logging new entries.', urgent: true };
    }
    if (trialEndsMs - nowMs <= TRIAL_WARNING_WINDOW_MS) {
      const daysLeft = Math.max(1, Math.ceil((trialEndsMs - nowMs) / (24 * 60 * 60 * 1000)));
      return {
        message: `Your trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Subscribe to keep using Solo Truck.`,
        urgent: false,
      };
    }
    return null;
  }

  if (sub.status === 'past_due') {
    return {
      message: "We couldn't process your last payment. Update your payment method to avoid losing access.",
      urgent: true,
    };
  }

  if (sub.status === 'cancelled') {
    if (sub.currentPeriodEnd && new Date(sub.currentPeriodEnd).getTime() > nowMs) {
      return { message: 'Your subscription is set to cancel at the end of the current period.', urgent: false };
    }
    return { message: 'Your subscription has ended. Subscribe to keep logging new entries.', urgent: true };
  }

  if (sub.status === 'expired') {
    return { message: 'Your subscription has ended. Subscribe to keep logging new entries.', urgent: true };
  }

  return null;
}
