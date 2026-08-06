import { getDb, MUTATIONS_STORE } from './db';
import type { QueuedEntity, QueuedMutation } from './types';

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((cb) => cb());
}

// Tiny in-module pub-sub so use-sync-status.ts can react to queue changes
// without polling — every mutating function below calls this after it
// writes to IndexedDB.
export function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export async function enqueue<TPayload>(
  entity: QueuedEntity,
  payload: TPayload,
  recordedAt: string = new Date().toISOString(),
): Promise<string> {
  const clientId = crypto.randomUUID();
  const mutation: QueuedMutation<TPayload> = {
    clientId,
    entity,
    payload,
    recordedAt,
    createdAt: new Date().toISOString(),
    attemptCount: 0,
    status: 'pending',
  };

  const db = await getDb();
  await db.put(MUTATIONS_STORE, mutation);
  notify();
  return clientId;
}

export async function listPending(): Promise<QueuedMutation[]> {
  const db = await getDb();
  const all: QueuedMutation[] = await db.getAllFromIndex(MUTATIONS_STORE, 'by-created-at');
  return all.filter((item) => item.status === 'pending' || item.status === 'failed');
}

export async function markSyncing(clientId: string): Promise<void> {
  const db = await getDb();
  const item = await db.get(MUTATIONS_STORE, clientId);
  if (!item) return;
  await db.put(MUTATIONS_STORE, { ...item, status: 'syncing' });
  notify();
}

// Only ever called after the server has ack'd the write — removing before
// that would silently drop data if the tab closes mid-request (SECURITY.md
// §4).
export async function markSynced(clientId: string): Promise<void> {
  const db = await getDb();
  await db.delete(MUTATIONS_STORE, clientId);
  notify();
}

export async function markFailed(
  clientId: string,
  error: string,
  permanent = false,
): Promise<void> {
  const db = await getDb();
  const item = await db.get(MUTATIONS_STORE, clientId);
  if (!item) return;
  await db.put(MUTATIONS_STORE, {
    ...item,
    status: permanent ? 'blocked' : 'pending',
    attemptCount: item.attemptCount + 1,
    lastError: error,
  });
  notify();
}

// Includes 'blocked' items on purpose — they're still "waiting" from the
// user's point of view, just waiting on the user (e.g. renew subscription)
// rather than on connectivity. Never silently dropped (SECURITY.md §4).
export async function count(): Promise<number> {
  const db = await getDb();
  const all: QueuedMutation[] = await db.getAll(MUTATIONS_STORE);
  return all.length;
}

export async function hasBlocked(): Promise<boolean> {
  const db = await getDb();
  const all: QueuedMutation[] = await db.getAll(MUTATIONS_STORE);
  return all.some((item) => item.status === 'blocked');
}
