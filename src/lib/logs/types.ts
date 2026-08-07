// Shared shape for the 'log' offline-queue payload — used by the client
// (today-client.tsx) and the sync route (/api/sync/[entity]) so the two
// can't drift on field names.
export interface LogPayload {
  equipmentId: string;
  temperature: number;
  loggedBy?: string | null;
  supersedesLogId?: string;
  supersedeReason?: string;
}

export interface TodayLog {
  id: string;
  equipmentId: string;
  temperature: number;
  recordedAt: string;
  isOutOfThreshold: boolean;
  loggedBy: string | null;
}
