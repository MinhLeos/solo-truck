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
      <div className="flex gap-2 print:hidden">
        <Link
          href="/inspector?range=30"
          className={`rounded-[10px] px-4 py-2.5 text-[.82rem] font-extrabold ${rangeDays === 30 ? 'bg-[#1d6b45] text-white' : 'bg-[#e9efeb] text-[#31503f]'}`}
        >
          30 days
        </Link>
        <Link
          href="/inspector?range=90"
          className={`rounded-[10px] px-4 py-2.5 text-[.82rem] font-extrabold ${rangeDays === 90 ? 'bg-[#1d6b45] text-white' : 'bg-[#e9efeb] text-[#31503f]'}`}
        >
          90 days
        </Link>
      </div>

      <Card>
        <InspectorView truckName={truck.name} rangeDays={rangeDays} report={report} />
      </Card>

      <Card className="flex flex-col gap-3 print:hidden">
        <h3 className="text-base font-bold">Share a read-only link with an inspector</h3>
        <p className="text-sm text-[#6b7972]">Link expires in 24h. You can revoke it anytime.</p>
        {activeLinks.map((link) => (
          <div key={link.id} className="flex items-center justify-between gap-2 rounded-[10px] border border-[#dce4de] bg-[#fbfcfb] py-1 pl-3 pr-1 text-xs">
            <code className="truncate text-[#557164]">{`${appUrl}/i/${link.token}`}</code>
            <form action={revokeInspectorLink.bind(null, link.id)}>
              <Button type="submit" variant="ghost">
                Revoke
              </Button>
            </form>
          </div>
        ))}
        <form action={generateInspectorLink}>
          <Button type="submit">
            Generate new link
          </Button>
        </form>
      </Card>
    </div>
  );
}
