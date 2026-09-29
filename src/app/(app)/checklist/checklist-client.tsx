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
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
        <p className="grid h-20 w-20 place-items-center rounded-full bg-[#e1f2e6] text-4xl font-bold text-[#287144] shadow-[0_0_0_10px_#edf6ef]">
          ✓
        </p>
        <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-[-.055em]">
          Ready to open
        </h1>
        <p className="text-[#6b7972]">All {items.length} checks done for today.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="page-intro">
        <h1>Pre-shift checklist</h1>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <button key={item.checklistId} type="button" onClick={() => toggle(item.checklistId)}>
            <Card className="flex min-h-[64px] items-center gap-4 text-left">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-bold ${
                  item.checked ? 'border-[#2f8a59] bg-[#2f8a59] text-white' : 'border-[#b9c9bf] bg-white'
                }`}
              >
                {item.checked ? '✓' : ''}
              </span>
              <span className={`font-semibold ${item.checked ? 'text-[#93a098] line-through' : 'text-[#18231f]'}`}>
                {item.label}
              </span>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
