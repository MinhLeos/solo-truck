'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { enqueue } from '@/lib/offline/queue';
import type { ChecklistItemState, ChecklistRunPayload } from '@/lib/checklist/types';

export function ChecklistClient({
  initialItems,
  canWrite,
}: {
  initialItems: ChecklistItemState[];
  canWrite: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);

  async function toggle(checklistId: string) {
    // SECURITY.md §4: only new writes are blocked once trial/subscription
    // has lapsed — reading today's already-synced state stays available.
    if (!canWrite) {
      router.push('/settings/billing');
      return;
    }

    const next = items.map((item) =>
      item.checklistId === checklistId ? { ...item, checked: !item.checked } : item,
    );
    setItems(next);

    // Append-only: every tap inserts a brand new full-snapshot row rather
    // than updating a draft (checklist_runs has no UPDATE grant at all —
    // see the Phase 2.3 migration). The latest row IS the current state.
    const payload: ChecklistRunPayload = { items: next };
    await enqueue('checklist_run', payload);
  }

  const allChecked = items.length > 0 && items.every((item) => item.checked);

  if (allChecked) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <p className="text-3xl">✓</p>
        <h1 className="text-xl font-semibold text-pass">Ready to open</h1>
        <p className="text-sm text-ink-soft">All {items.length} checks done for today.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-semibold text-ink">Pre-shift checklist</h1>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <button key={item.checklistId} type="button" onClick={() => toggle(item.checklistId)}>
            <Card className="flex items-center gap-3 text-left">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  item.checked ? 'border-pass bg-pass text-white' : 'border-steel-deep'
                }`}
              >
                {item.checked ? '✓' : ''}
              </span>
              <span className={item.checked ? 'text-ink-soft line-through' : 'text-ink'}>
                {item.label}
              </span>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
