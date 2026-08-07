import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/get-client-ip';
import { getInspectorReport } from '@/lib/inspector/report';
import { InspectorView } from '@/components/inspector-view';

// Never indexed, never crawled — this is a per-inspector, time-limited link
// (SECURITY.md §6), not a page anyone should stumble onto via search.
export const metadata = {
  robots: { index: false, follow: false },
};

const RANGE_DAYS = 90;

export default async function PublicInspectorLinkPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const ip = getClientIp(await headers());

  // Rate limit BEFORE the token lookup so a flood of guesses can't be used
  // to brute-force valid tokens by timing/volume.
  const allowed = await checkRateLimit('i_token', ip, 30);
  if (!allowed) notFound();

  const admin = createAdminClient();
  const { data: link } = await admin
    .from('inspector_links')
    .select('id, business_id, expires_at, revoked_at')
    .eq('token', token)
    .maybeSingle();

  // Same generic 404 whether the token is unknown, expired, or revoked —
  // SECURITY.md §6 requires not leaking which case it was.
  if (!link || link.revoked_at || new Date(link.expires_at).getTime() < new Date().getTime()) {
    notFound();
  }

  const { data: truck } = await admin
    .from('trucks')
    .select('id, name, timezone')
    .eq('business_id', link.business_id)
    .maybeSingle();
  if (!truck) notFound();

  await admin
    .from('inspector_links')
    .update({ opened_at: new Date().toISOString(), opened_ip: ip })
    .eq('id', link.id);

  const report = await getInspectorReport(
    admin,
    link.business_id,
    truck.id,
    truck.timezone,
    RANGE_DAYS,
  );

  return (
    <div className="mx-auto max-w-2xl p-4">
      <InspectorView truckName={truck.name} rangeDays={RANGE_DAYS} report={report} />
    </div>
  );
}
