import 'server-only';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';

const FROM_ADDRESS = 'Solo Truck <onboarding@resend.dev>'; // TODO: swap once a real domain is verified.
const MAX_ATTEMPTS = 3;

// Unconditional notifications_log write on every attempt, success or
// failure — the exact lesson SECURITY.md cites from Solo Sitter: a
// notification that fails silently is worse than one that never tried.
export async function sendEmail({
  businessId,
  to,
  subject,
  html,
  template,
}: {
  businessId: string;
  to: string;
  subject: string;
  html: string;
  template: string;
}): Promise<void> {
  const admin = createAdminClient();
  let status: 'sent' | 'failed' = 'failed';
  let error: string | null = null;

  if (!process.env.RESEND_API_KEY) {
    console.log('[sendEmail:dev]', { to, subject, template });
    status = 'sent';
  } else {
    const resend = new Resend(process.env.RESEND_API_KEY);
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const result = await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
      if (!result.error) {
        status = 'sent';
        break;
      }
      error = result.error.message;
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }
  }

  await admin.from('notifications_log').insert({
    business_id: businessId,
    channel: 'email',
    template,
    to_address: to,
    status,
    sent_at: status === 'sent' ? new Date().toISOString() : null,
    error,
  });

  if (status === 'failed') {
    console.error('[sendEmail] failed after retries', { to, template, error });
  }
}
