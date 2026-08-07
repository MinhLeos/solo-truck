import { listPending, markFailed, markSynced, markSyncing } from './queue';

const RETRY_INTERVAL_MS = 30_000;

let syncing = false;
let started = false;

// Deliberately not using the Background Sync API: iOS Safari has never
// implemented it, and food truck owners skew heavily toward iPhones — an
// approach that depends on it would silently fail exactly the audience this
// product targets. Instead: three plain triggers that work identically
// regardless of browser or PWA-install state.
export function startSyncEngine() {
  if (started || typeof window === 'undefined') return;
  started = true;

  window.addEventListener('online', () => void runSync());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void runSync();
  });
  setInterval(() => void runSync(), RETRY_INTERVAL_MS);

  void runSync();
}

// Any queued payload that carries a `photo` field (corrective actions, per
// src/lib/corrective-actions/types.ts — checked generically here so this
// module doesn't need to import entity-specific types) is sent as
// multipart/form-data instead of JSON, since IndexedDB can hold the actual
// File/Blob but JSON can't serialize one.
function buildRequestBody(clientId: string, recordedAt: string, payload: unknown) {
  if (typeof payload === 'object' && payload !== null && 'photo' in payload) {
    const { photo, ...rest } = payload as { photo: File | null; [key: string]: unknown };
    const formData = new FormData();
    formData.set('clientId', clientId);
    formData.set('recordedAt', recordedAt);
    formData.set('payload', JSON.stringify(rest));
    if (photo) formData.set('photo', photo, 'photo.jpg');
    return { body: formData, headers: undefined };
  }

  return {
    body: JSON.stringify({ clientId, recordedAt, payload }),
    headers: { 'content-type': 'application/json' },
  };
}

export async function runSync(): Promise<void> {
  // Guard only when `navigator.onLine` actually exists (real browsers always
  // have it) — Node's built-in `navigator` global (used under vitest) has no
  // `onLine` property at all, and treating that as "offline" would silently
  // skip every sync attempt in tests.
  if (syncing || (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine)) {
    return;
  }
  syncing = true;

  try {
    // Oldest recorded_at first (SECURITY.md §4: "sync theo thứ tự thời
    // gian") — a permanently-failed item is skipped, not retried in a tight
    // loop, but doesn't block items behind it either.
    const pending = await listPending();
    const sorted = [...pending].sort((a, b) => a.recordedAt.localeCompare(b.recordedAt));

    for (const item of sorted) {
      await markSyncing(item.clientId);

      try {
        const { body, headers } = buildRequestBody(item.clientId, item.recordedAt, item.payload);
        const response = await fetch(`/api/sync/${item.entity}`, { method: 'POST', headers, body });

        if (response.ok) {
          await markSynced(item.clientId);
          continue;
        }

        // A 401/403 here means the server itself refuses the insert (e.g.
        // expired subscription blocking new writes) — draining the queue
        // won't help until the user acts, so this item is permanently
        // blocked rather than retried forever. Other items keep going.
        const permanent = response.status === 401 || response.status === 403;
        await markFailed(item.clientId, `HTTP ${response.status}`, permanent);
      } catch (error) {
        await markFailed(item.clientId, error instanceof Error ? error.message : 'network error');
      }
    }
  } finally {
    syncing = false;
  }
}
