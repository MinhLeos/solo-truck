import { createClient } from '@/lib/supabase/server';
import { businessDayRangeUtc, todayInTimezone } from '@/lib/timezone';
import { hasWriteAccess } from '@/lib/billing/access';
import { getSubscriptionForAccess } from '@/lib/billing/get-subscription';
import type { ChecklistItemState } from '@/lib/checklist/types';
import { ChecklistClient } from './checklist-client';

export default async function ChecklistPage() {
  const supabase = await createClient();

  const { data: truck } = await supabase
    .from('trucks')
    .select('id, timezone, business_id')
    .maybeSingle();
  const timezone = truck?.timezone ?? 'UTC';

  const sub = truck ? await getSubscriptionForAccess(supabase, truck.business_id) : null;
  const canWrite = hasWriteAccess(sub, new Date());

  const { data: checklists } = await supabase
    .from('checklists')
    .select('id, label')
    .is('deleted_at', null)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  const [dayStart, dayEnd] = businessDayRangeUtc(todayInTimezone(timezone), timezone);

  const { data: latestRun } = await supabase
    .from('checklist_runs')
    .select('items')
    .gte('recorded_at', dayStart.toISOString())
    .lt('recorded_at', dayEnd.toISOString())
    .order('recorded_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const checkedByChecklistId = new Map<string, boolean>(
    ((latestRun?.items as ChecklistItemState[] | null) ?? []).map((item) => [
      item.checklistId,
      item.checked,
    ]),
  );

  const initialItems: ChecklistItemState[] = (checklists ?? []).map((item) => ({
    checklistId: item.id,
    label: item.label,
    checked: checkedByChecklistId.get(item.id) ?? false,
  }));

  return <ChecklistClient initialItems={initialItems} canWrite={canWrite} />;
}
