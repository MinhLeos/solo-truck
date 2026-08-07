import type { SupabaseClient } from '@supabase/supabase-js';
import { utcToZonedDateString } from '@/lib/timezone';

export interface InspectorLogEntry {
  id: string;
  equipmentName: string;
  temperature: number;
  recordedAt: string;
  isOutOfThreshold: boolean;
  loggedOfflineSyncedLater: boolean;
  correctiveAction: { actionType: string; note: string | null } | null;
}

export interface InspectorChecklistRun {
  id: string;
  recordedAt: string;
  items: { label: string; checked: boolean }[];
}

export interface InspectorDocument {
  id: string;
  kind: string;
  expiresAt: string | null;
}

export interface InspectorReport {
  logs: InspectorLogEntry[];
  checklistRuns: InspectorChecklistRun[];
  documents: InspectorDocument[];
}

const SYNC_LAG_THRESHOLD_MS = 15 * 60 * 1000;

function equipmentName(embedded: unknown): string {
  const value = Array.isArray(embedded) ? embedded[0] : embedded;
  return (value as { name?: string } | null)?.name ?? 'Unknown equipment';
}

// Shared by both /inspector (owner, authenticated client) and /i/[token]
// (public, admin client) — same query shape either way is what makes the
// inspector-link view trustworthy: it's not a separate, potentially
// drifted, "public" rendering of the data.
export async function getInspectorReport(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  businessId: string,
  truckId: string,
  timezone: string,
  days: 30 | 90,
): Promise<InspectorReport> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data: logRows } = await supabase
    .from('logs')
    .select(
      'id, client_id, temperature, recorded_at, synced_at, is_out_of_threshold, equipment(name)',
    )
    .eq('truck_id', truckId)
    .gte('recorded_at', since)
    .order('recorded_at', { ascending: false });

  const { data: caRows } = await supabase
    .from('corrective_actions')
    .select('log_client_id, action_type, note')
    .eq('truck_id', truckId)
    .gte('recorded_at', since);

  const caByLogClientId = new Map(
    (caRows ?? []).map((ca) => [ca.log_client_id, { actionType: ca.action_type, note: ca.note }]),
  );

  const logs: InspectorLogEntry[] = (logRows ?? []).map((row) => ({
    id: row.id,
    equipmentName: equipmentName(row.equipment),
    temperature: row.temperature,
    recordedAt: row.recorded_at,
    isOutOfThreshold: row.is_out_of_threshold,
    loggedOfflineSyncedLater:
      new Date(row.synced_at).getTime() - new Date(row.recorded_at).getTime() >
      SYNC_LAG_THRESHOLD_MS,
    correctiveAction: caByLogClientId.get(row.client_id) ?? null,
  }));

  const { data: checklistRows } = await supabase
    .from('checklist_runs')
    .select('id, items, recorded_at')
    .eq('truck_id', truckId)
    .gte('recorded_at', since)
    .order('recorded_at', { ascending: false });

  // checklist_runs is append-only — every tap during a shift inserts a full
  // new snapshot (Phase 2.3), so a raw dump would show ~12 near-duplicate
  // rows per actual shift. Inspector Mode wants one row per truck-local day
  // (the latest snapshot, same "latest row is the current state" rule the
  // /checklist page itself already uses), not the tap-by-tap history.
  const latestRunByDay = new Map<string, NonNullable<typeof checklistRows>[number]>();
  for (const row of checklistRows ?? []) {
    const day = utcToZonedDateString(new Date(row.recorded_at), timezone);
    if (!latestRunByDay.has(day)) latestRunByDay.set(day, row); // already newest-first
  }

  const checklistRuns: InspectorChecklistRun[] = Array.from(latestRunByDay.values()).map(
    (row) => ({
      id: row.id,
      recordedAt: row.recorded_at,
      items: row.items as { label: string; checked: boolean }[],
    }),
  );

  const { data: documentRows } = await supabase
    .from('documents')
    .select('id, kind, expires_at')
    .eq('business_id', businessId)
    .is('deleted_at', null);

  const documents: InspectorDocument[] = (documentRows ?? []).map((row) => ({
    id: row.id,
    kind: row.kind,
    expiresAt: row.expires_at,
  }));

  return { logs, checklistRuns, documents };
}
