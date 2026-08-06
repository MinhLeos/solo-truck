import { afterEach, describe, expect, it } from 'vitest';
import { openDB } from 'idb';
import { getDb, MUTATIONS_STORE } from './db';
import { count, enqueue, hasBlocked, listPending, markFailed, markSynced } from './queue';

// db.ts caches its connection at module scope (by design — that's what
// lets the queue survive a tab close), so between tests we clear the store
// through that SAME cached connection rather than deleting the database —
// deleting while a connection is still open just blocks indefinitely.
afterEach(async () => {
  const db = await getDb();
  await db.clear(MUTATIONS_STORE);
});

describe('offline queue', () => {
  it('enqueue persists a well-formed pending mutation', async () => {
    const clientId = await enqueue('log', { equipmentId: 'e1', temperature: 40 });
    const pending = await listPending();

    expect(pending).toHaveLength(1);
    expect(pending[0].clientId).toBe(clientId);
    expect(pending[0].status).toBe('pending');
    expect(pending[0].entity).toBe('log');
  });

  it('survives a simulated tab close — an independent DB connection can still read it', async () => {
    await enqueue('log', { equipmentId: 'e1', temperature: 40 });

    // A fresh, independent connection to the same underlying database is
    // the practical proxy, at the vitest level, for "the queue survives
    // closing the tab and reopening the app".
    const independentDb = await openDB('solo-truck-offline', 1);
    const all = await independentDb.getAll('mutations');
    expect(all).toHaveLength(1);
    independentDb.close();
  });

  it('marks a permanently failed item as blocked without removing it', async () => {
    const clientId = await enqueue('log', { equipmentId: 'e1', temperature: 40 });
    await markFailed(clientId, 'HTTP 401', true);

    expect(await count()).toBe(1);
    expect(await hasBlocked()).toBe(true);
    // 'blocked' is neither 'pending' nor 'failed' — it's still "waiting" for
    // the UI's count, but not something the sync engine should keep retrying.
    expect(await listPending()).toHaveLength(0);
  });

  it('a transient failure stays pending and visible for the next retry', async () => {
    const clientId = await enqueue('log', { equipmentId: 'e1', temperature: 40 });
    await markFailed(clientId, 'network error', false);

    const pending = await listPending();
    expect(pending).toHaveLength(1);
    expect(pending[0].attemptCount).toBe(1);
    expect(await hasBlocked()).toBe(false);
  });

  it('markSynced removes the item entirely — only after a server ack', async () => {
    await enqueue('log', { equipmentId: 'e1', temperature: 40 });
    const [item] = await listPending();
    await markSynced(item.clientId);

    expect(await count()).toBe(0);
  });
});
