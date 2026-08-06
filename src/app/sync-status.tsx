'use client';

import { useEffect } from 'react';
import { startSyncEngine } from '@/lib/offline/sync';
import { useSyncStatus } from '@/lib/offline/use-sync-status';

// Small, honest status text — no spinner theatrics. SECURITY.md §4: never
// silently drop data, so a permanently-blocked item gets its own message
// rather than being folded into the generic "waiting to sync" count.
export function SyncStatus() {
  useEffect(() => {
    startSyncEngine();
  }, []);

  const { pendingCount, hasBlocked, isOffline } = useSyncStatus();

  if (pendingCount === 0) {
    return isOffline ? (
      <p className="bg-steel px-4 py-1.5 text-center text-xs text-ink-soft">You&apos;re offline</p>
    ) : null;
  }

  if (hasBlocked) {
    return (
      <p className="bg-warn-bg px-4 py-1.5 text-center text-xs text-flame-deep">
        ⚠ {pendingCount} {pendingCount === 1 ? 'item' : 'items'} can&apos;t sync — check your
        subscription
      </p>
    );
  }

  return (
    <p className="bg-steel px-4 py-1.5 text-center text-xs text-ink-soft">
      {pendingCount} {pendingCount === 1 ? 'item' : 'items'} waiting to sync
    </p>
  );
}
