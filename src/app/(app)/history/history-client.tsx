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
      <div className="page-intro">
        <h1>History</h1>
      </div>
      {groups.map(([day, entries]) => (
        <div key={day}>
          <p className="app-eyebrow mb-2.5">{day}</p>
          <div className="flex flex-col gap-2">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <div className="data-row stack-mobile">
                  <div className={entry.isSuperseded ? 'opacity-50 line-through' : ''}>
                    <h3>
                      {entry.equipmentName} — {entry.temperature}°F{' '}
                      {entry.isOutOfThreshold && <span className="text-[#a94435]">⚠</span>}
                    </h3>
                    <p>
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
                  <p className="mt-2 inline-block rounded-md bg-[#edf1ee] px-2 py-1 text-xs text-[#557164]">Corrected: {entry.supersedeReason}</p>
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
      {groups.length === 0 && <p className="text-sm text-[#6b7972]">No logs yet.</p>}
    </div>
  );
}
