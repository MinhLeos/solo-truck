import 'server-only';
import DodoPayments from 'dodopayments';

// Defaults to live_mode if unset — required explicitly so a missing env var
// can never silently start charging through the live account.
function environment(): 'test_mode' | 'live_mode' {
  const value = process.env.BILLING_ENVIRONMENT;
  if (value !== 'test_mode' && value !== 'live_mode') {
    throw new Error('BILLING_ENVIRONMENT must be set to "test_mode" or "live_mode"');
  }
  return value;
}

export function createBillingClient(): DodoPayments {
  return new DodoPayments({
    bearerToken: process.env.BILLING_PROVIDER_API_KEY,
    environment: environment(),
  });
}

export type BillingInterval = 'monthly' | 'yearly';

// Two products (not one product with two prices) — matches how Dodo's
// checkout API takes a single product_id per cart line, and keeps the
// monthly-vs-yearly choice a simple env-var-per-product lookup.
export function billingProductId(interval: BillingInterval): string {
  const id =
    interval === 'monthly'
      ? process.env.BILLING_PRODUCT_ID_MONTHLY
      : process.env.BILLING_PRODUCT_ID_YEARLY;
  if (!id) throw new Error(`BILLING_PRODUCT_ID_${interval.toUpperCase()} is not set`);
  return id;
}
