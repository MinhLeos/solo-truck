// `photo` is a real Blob/File stored directly in the IndexedDB queue item
// (structured clone supports Blob natively) — uploaded only at sync time,
// not before, so an offline-created CA doesn't need the upload to succeed
// just to be queued.
export interface CorrectiveActionPayload {
  logClientId: string;
  actionType: string;
  note: string;
  photo: File | null;
}
