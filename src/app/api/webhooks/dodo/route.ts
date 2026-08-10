import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyWebhook } from '@/lib/billing/webhook';
import { statusForEventType } from '@/lib/billing/webhook-events';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const webhookId = request.headers.get('webhook-id');
  const webhookSignature = request.headers.get('webhook-signature');
  const webhookTimestamp = request.headers.get('webhook-timestamp');

  if (!webhookId || !webhookSignature || !webhookTimestamp) {
    return NextResponse.json({ error: 'Missing webhook headers' }, { status: 400 });
  }

  let payload;
  try {
    payload = await verifyWebhook(rawBody, { webhookId, webhookSignature, webhookTimestamp });
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const admin = createAdminClient();

  const { error: insertError } = await admin
    .from('billing_webhook_events')
    .insert({ event_id: webhookId, type: payload.type });

  if (insertError) {
    if (insertError.code === '23505') {
      // Already processed this delivery — Dodo retries on anything but a 2xx.
      return NextResponse.json({ received: true, duplicate: true });
    }
    return NextResponse.json({ error: 'Could not record webhook event' }, { status: 500 });
  }

  const newStatus = statusForEventType(payload.type);
  if (newStatus) {
    const businessId = payload.data.metadata?.business_id;
    if (typeof businessId !== 'string') {
      return NextResponse.json({ error: 'Missing business_id in webhook metadata' }, { status: 400 });
    }

    await admin
      .from('subscriptions')
      .update({
        status: newStatus,
        provider_subscription_id: payload.data.id ?? null,
        provider_customer_id: payload.data.customer?.customer_id ?? null,
        current_period_end: payload.data.next_billing_date ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('business_id', businessId);
  }

  return NextResponse.json({ received: true });
}
