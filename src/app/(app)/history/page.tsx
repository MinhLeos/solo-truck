import { createClient } from '@/lib/supabase/server';
import { utcToZonedDateString } from '@/lib/timezone';
import { HistoryClient, type HistoryEntry } from './history-client';

export default async function HistoryPage() {
  const supabase = await createClient();

  const { data: truck } = await supabase.from('trucks').select('timezone').maybeSingle();
  const timezone = truck?.timezone ?? 'UTC';

  const { data: rows } = await supabase
    .from('logs')
    .select(
      'id, equipment_id, temperature, recorded_at, logged_by, is_out_of_threshold, supersedes_log_id, supersede_reason, equipment(name)',
    )
    .order('recorded_at', { ascending: false })
    .limit(200);

  const supersededIds = new Set(
    (rows ?? []).map((row) => row.supersedes_log_id).filter((id): id is string => Boolean(id)),
  );

  // Supabase's untyped client infers embedded relations as arrays without a
  // generated types file, even though logs -> equipment is many-to-one.
  function equipmentName(embedded: unknown): string {
    const value = Array.isArray(embedded) ? embedded[0] : embedded;
    return (value as { name?: string } | null)?.name ?? 'Unknown equipment';
  }

  const entries: HistoryEntry[] = (rows ?? []).map((row) => ({
    id: row.id,
    equipmentId: row.equipment_id,
    equipmentName: equipmentName(row.equipment),
    temperature: row.temperature,
    recordedAt: row.recorded_at,
    loggedBy: row.logged_by,
    isOutOfThreshold: row.is_out_of_threshold,
    isSuperseded: supersededIds.has(row.id),
    supersedeReason: row.supersede_reason,
  }));

  const groupsMap = new Map<string, HistoryEntry[]>();
  for (const entry of entries) {
    const day = utcToZonedDateString(new Date(entry.recordedAt), timezone);
    const existing = groupsMap.get(day) ?? [];
    existing.push(entry);
    groupsMap.set(day, existing);
  }

  return <HistoryClient groups={Array.from(groupsMap.entries())} />;
}
