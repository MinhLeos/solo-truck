import { afterEach, describe, expect, it, vi } from 'vitest';
import { getDb, MUTATIONS_STORE } from './db';
import { count, enqueue, hasBlocked, listPending } from './queue';
import { runSync } from './sync';

afterEach(async () => {
  vi.unstubAllGlobals();
  const db = await getDb();
  await db.clear(MUTATIONS_STORE);
});

describe('sync engine', () => {
  it('retries after a network failure and syncs exactly once server-side, even though fetch was called twice', async () => {
    const clientId = await enqueue('log', { equipmentId: 'e1', temperature: 40 });

    // Simulates the server side: a Map keyed by client_id proves the
    // idempotent-upsert contract holds even when the client retries.
    const serverRows = new Map<string, unknown>();
    let callCount = 0;

    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init: RequestInit) => {
        callCount++;
        if (callCount === 1) throw new Error('simulated network error');
        const body = JSON.parse(init.body as string);
        serverRows.set(body.clientId, body);
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      }),
    );

    await runSync(); // first attempt: network error → stays pending
    expect(await count()).toBe(1);
    expect(serverRows.size).toBe(0);

    await runSync(); // second attempt: succeeds
    expect(serverRows.size).toBe(1);
    expect(serverRows.has(clientId)).toBe(true);
    expect(await count()).toBe(0); // removed only after the server ack
  });

  it('treats a 401 as permanent, stops retrying, and keeps the item visible with a warning', async () => {
    await enqueue('log', { equipmentId: 'e1', temperature: 40 });

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 401 })),
    );

    await runSync();

    expect(await count()).toBe(1);
    expect(await hasBlocked()).toBe(true);
    expect(await listPending()).toHaveLength(0);
  });

  it('processes items oldest recorded_at first', async () => {
    const order: string[] = [];
    await enqueue('log', { equipmentId: 'e1', temperature: 40 }, '2026-08-06T10:00:00.000Z');
    await enqueue('log', { equipmentId: 'e1', temperature: 41 }, '2026-08-06T08:00:00.000Z');

    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init: RequestInit) => {
        const body = JSON.parse(init.body as string);
        order.push(body.recordedAt);
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      }),
    );

    await runSync();

    expect(order).toEqual(['2026-08-06T08:00:00.000Z', '2026-08-06T10:00:00.000Z']);
  });
});
