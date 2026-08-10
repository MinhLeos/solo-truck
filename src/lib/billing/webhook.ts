import 'server-only';
import { Webhook } from 'standardwebhooks';

export type BillingWebhookPayload = {
  business_id: string; // Dodo's own merchant id — not ours, do not confuse with our businesses.id
  type: string;
  timestamp: string;
  data: {
    payload_type: string;
    id?: string;
    status?: string;
    subscription_id?: string | null;
    metadata?: Record<string, string | number | boolean>;
    customer?: { customer_id: string };
    next_billing_date?: string;
  };
};

export async function verifyWebhook(
  rawBody: string,
  headers: { webhookId: string; webhookSignature: string; webhookTimestamp: string },
): Promise<BillingWebhookPayload> {
  const secret = process.env.BILLING_WEBHOOK_SECRET;
  if (!secret) throw new Error('BILLING_WEBHOOK_SECRET is not set');

  const webhook = new Webhook(secret);
  return webhook.verify(rawBody, {
    'webhook-id': headers.webhookId,
    'webhook-signature': headers.webhookSignature,
    'webhook-timestamp': headers.webhookTimestamp,
  }) as BillingWebhookPayload;
}
