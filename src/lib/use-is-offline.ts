'use client';

import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void): () => void {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot(): boolean {
  return !navigator.onLine;
}

// getServerSnapshot always returns false (the server has no `navigator`) —
// useSyncExternalStore renders that on the client's first pass too, then
// swaps to the real getSnapshot value right after, so server and client
// output always agree on the very first render (no hydration mismatch).
function getServerSnapshot(): boolean {
  return false;
}

export function useIsOffline(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
