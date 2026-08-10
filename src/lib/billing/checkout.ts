import 'server-only';
import { createBillingClient, billingProductId, type BillingInterval } from './client';
import { getAppUrl } from '@/lib/get-app-url';

export async function createCheckoutUrl(
  businessId: string,
  customerEmail: string,
  interval: BillingInterval,
): Promise<string> {
  const client = createBillingClient();
  const session = await client.checkoutSessions.create({
    product_cart: [{ product_id: billingProductId(interval), quantity: 1 }],
    customer: { email: customerEmail },
    metadata: { business_id: businessId },
    return_url: `${getAppUrl()}/settings/billing`,
  });

  if (!session.checkout_url) throw new Error('Dodo did not return a checkout_url');
  return session.checkout_url;
}

export async function getPortalUrl(providerCustomerId: string): Promise<string> {
  const client = createBillingClient();
  const session = await client.customers.customerPortal.create(providerCustomerId, {
    return_url: `${getAppUrl()}/settings/billing`,
  });
  return session.link;
}
