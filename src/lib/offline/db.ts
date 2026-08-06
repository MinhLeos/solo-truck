import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'solo-truck-offline';
const DB_VERSION = 1;
export const MUTATIONS_STORE = 'mutations';
export const CACHE_STORE = 'cache';

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDb(): Promise<IDBPDatabase> {
  dbPromise ??= openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(MUTATIONS_STORE)) {
        const store = db.createObjectStore(MUTATIONS_STORE, { keyPath: 'clientId' });
        store.createIndex('by-created-at', 'createdAt');
      }
      if (!db.objectStoreNames.contains(CACHE_STORE)) {
        db.createObjectStore(CACHE_STORE);
      }
    },
  });
  return dbPromise;
}

// Read cache for offline viewing of /today (equipment + today's logs) — a
// separate flat key→value concern from the mutation queue below, same shape
// Solo Sitter uses for its own read cache.
export async function saveCache<T>(key: string, data: T): Promise<void> {
  const db = await getDb();
  await db.put(CACHE_STORE, { data, savedAt: Date.now() }, key);
}

export async function loadCache<T>(key: string): Promise<T | null> {
  const db = await getDb();
  const entry = await db.get(CACHE_STORE, key);
  return entry ? (entry.data as T) : null;
}
