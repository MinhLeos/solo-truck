// SECURITY.md §4: every write goes into this queue first (optimistic UI),
// keyed by a device-generated client_id so retries never duplicate on the
// server. Phase 1 only has the 'log' entity wired end-to-end (schema exists
// for all three append-only tables, but corrective_action/checklist_run UI
// doesn't exist until Phase 2 — see src/app/api/sync/[entity]/route.ts).
export type QueuedEntity = 'log' | 'corrective_action' | 'checklist_run';

export type QueueItemStatus = 'pending' | 'syncing' | 'failed' | 'blocked';

export interface QueuedMutation<TPayload = Record<string, unknown>> {
  clientId: string;
  entity: QueuedEntity;
  payload: TPayload;
  // Device clock at the moment the user tapped save — never re-stamped on
  // retry (SECURITY.md §3: recorded_at must reflect when it actually
  // happened, not when it happened to sync).
  recordedAt: string;
  createdAt: string;
  attemptCount: number;
  status: QueueItemStatus;
  lastError?: string;
}
