import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getInspectorReport } from '@/lib/inspector/report';
import { InspectorView } from '@/components/inspector-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { generateInspectorLink, revokeInspectorLink } from './actions';

export default async function InspectorPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const rangeDays: 30 | 90 = range === '30' ? 30 : 90;

  const supabase = await createClient();
  const { data: truck } = await supabase
    .from('trucks')
    .select('id, business_id, name, timezone')
    .maybeSingle();
  if (!truck) return null;

  const report = await getInspectorReport(
    supabase,
    truck.business_id,
    truck.id,
    truck.timezone,
    rangeDays,
  );

  const { data: links } = await supabase
    .from('inspector_links')
    .select('id, token, expires_at, revoked_at, opened_at')
    .eq('business_id', truck.business_id)
    .order('created_at', { ascending: false })
    .limit(5);

  const now = new Date();
  const activeLinks = (links ?? []).filter(
    (link) => !link.revoked_at && new Date(link.expires_at).getTime() > now.getTime(),
  );
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 text-sm print:hidden">
        <Link
          href="/inspector?range=30"
          className={rangeDays === 30 ? 'font-semibold text-ink' : 'text-ink-soft'}
        >
          30 days
        </Link>
        <Link
          href="/inspector?range=90"
          className={rangeDays === 90 ? 'font-semibold text-ink' : 'text-ink-soft'}
        >
          90 days
        </Link>
      </div>

      <InspectorView truckName={truck.name} rangeDays={rangeDays} report={report} />

      <Card className="flex flex-col gap-2 print:hidden">
        <p className="text-sm font-medium text-ink">Share a read-only link with an inspector</p>
        <p className="text-xs text-ink-soft">Link expires in 24h. You can revoke it anytime.</p>
        {activeLinks.map((link) => (
          <div key={link.id} className="flex items-center justify-between gap-2 text-xs">
            <code className="truncate text-ink-soft">{`${appUrl}/i/${link.token}`}</code>
            <form action={revokeInspectorLink.bind(null, link.id)}>
              <Button type="submit" variant="ghost">
                Revoke
              </Button>
            </form>
          </div>
        ))}
        <form action={generateInspectorLink}>
          <Button type="submit" variant="secondary">
            Generate new link
          </Button>
        </form>
      </Card>
    </div>
  );
}
