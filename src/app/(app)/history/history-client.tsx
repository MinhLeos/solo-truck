'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SupersedeForm } from './supersede-form';

export interface HistoryEntry {
  id: string;
  equipmentId: string;
  equipmentName: string;
  temperature: number;
  recordedAt: string;
  loggedBy: string | null;
  isOutOfThreshold: boolean;
  isSuperseded: boolean;
  supersedeReason: string | null;
}

export function HistoryClient({ groups }: { groups: [string, HistoryEntry[]][] }) {
  const [openFormId, setOpenFormId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-ink">History</h1>
      {groups.map(([day, entries]) => (
        <div key={day}>
          <p className="mb-2 text-xs font-medium text-ink-soft">{day}</p>
          <div className="flex flex-col gap-2">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <div className="flex items-center justify-between">
                  <div className={entry.isSuperseded ? 'opacity-50 line-through' : ''}>
                    <p className="font-medium text-ink">
                      {entry.equipmentName} — {entry.temperature}°F{' '}
                      {entry.isOutOfThreshold && <span className="text-flame-deep">⚠</span>}
                    </p>
                    <p className="text-xs text-ink-soft">
                      {new Date(entry.recordedAt).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                      {entry.loggedBy ? ` · ${entry.loggedBy}` : ''}
                    </p>
                  </div>
                  {!entry.isSuperseded && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setOpenFormId(openFormId === entry.id ? null : entry.id)}
                    >
                      This was a mistake
                    </Button>
                  )}
                </div>
                {entry.supersedeReason && (
                  <p className="mt-1 text-xs text-ink-soft">Corrected: {entry.supersedeReason}</p>
                )}
                {openFormId === entry.id && (
                  <SupersedeForm
                    logId={entry.id}
                    equipmentId={entry.equipmentId}
                    onDone={() => setOpenFormId(null)}
                  />
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
      {groups.length === 0 && <p className="text-sm text-ink-soft">No logs yet.</p>}
    </div>
  );
}
