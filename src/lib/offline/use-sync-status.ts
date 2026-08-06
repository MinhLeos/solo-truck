'use client';

import { useSyncExternalStore } from 'react';
import { useIsOffline } from '@/lib/use-is-offline';
import { count, hasBlocked as queueHasBlocked, subscribe as subscribeQueue } from './queue';

interface SyncSnapshot {
  pendingCount: number;
  hasBlocked: boolean;
}

// count()/hasBlocked() are async (IndexedDB), but useSyncExternalStore needs
// a synchronous getSnapshot — so this keeps a cached snapshot that's
// refreshed in the background whenever the queue changes, and just hands
// back the last-known value synchronously.
let snapshot: SyncSnapshot = { pendingCount: 0, hasBlocked: false };
const listeners = new Set<() => void>();
let initialized = false;

async function refresh() {
  const [pendingCount, blocked] = await Promise.all([count(), queueHasBlocked()]);
  snapshot = { pendingCount, hasBlocked: blocked };
  listeners.forEach((cb) => cb());
}

function subscribe(callback: () => void): () => void {
  if (!initialized) {
    initialized = true;
    subscribeQueue(() => void refresh());
    void refresh();
  }
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): SyncSnapshot {
  return snapshot;
}

function getServerSnapshot(): SyncSnapshot {
  return { pendingCount: 0, hasBlocked: false };
}

export function useSyncStatus() {
  const { pendingCount, hasBlocked } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const isOffline = useIsOffline();
  return { pendingCount, hasBlocked, isOffline };
}
