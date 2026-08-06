// vitest's `node` test environment has no real IndexedDB — the offline
// write-queue (src/lib/offline/*) uses `idb`, so tests need this shim.
import 'fake-indexeddb/auto';
