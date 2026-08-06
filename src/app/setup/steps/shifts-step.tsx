'use client';

import type { ShiftDraft } from '@/lib/onboarding/types';

const DAYS = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

const DEFAULT_START = '11:00';
const DEFAULT_END = '19:00';

export function ShiftsStep({
  shifts,
  onChange,
}: {
  shifts: ShiftDraft[];
  onChange: (shifts: ShiftDraft[]) => void;
}) {
  const selectedDays = new Set(shifts.map((s) => s.dayOfWeek));
  const startTime = shifts[0]?.startTime ?? DEFAULT_START;
  const endTime = shifts[0]?.endTime ?? DEFAULT_END;

  function toggleDay(day: number) {
    if (selectedDays.has(day)) {
      onChange(shifts.filter((s) => s.dayOfWeek !== day));
    } else {
      onChange(
        [...shifts, { dayOfWeek: day, startTime, endTime }].sort(
          (a, b) => a.dayOfWeek - b.dayOfWeek,
        ),
      );
    }
  }

  function updateTimes(nextStart: string, nextEnd: string) {
    onChange(shifts.map((s) => ({ ...s, startTime: nextStart, endTime: nextEnd })));
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-ink-soft">
        Which days do you sell? Optional — you can skip this and add shifts later.
      </p>
      <div className="flex flex-wrap gap-2">
        {DAYS.map((day) => (
          <button
            key={day.value}
            type="button"
            onClick={() => toggleDay(day.value)}
            className={`rounded-md border px-3 py-2 text-sm ${
              selectedDays.has(day.value)
                ? 'border-flame bg-flame text-white'
                : 'border-steel-deep bg-card text-ink'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {shifts.length > 0 && (
        <div className="flex gap-3">
          <label className="flex flex-col gap-1 text-sm text-ink">
            Open
            <input
              type="time"
              value={startTime}
              onChange={(e) => updateTimes(e.target.value, endTime)}
              className="rounded-md border border-steel-deep bg-card px-3 py-2 text-sm text-ink"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Close
            <input
              type="time"
              value={endTime}
              onChange={(e) => updateTimes(startTime, e.target.value)}
              className="rounded-md border border-steel-deep bg-card px-3 py-2 text-sm text-ink"
            />
          </label>
        </div>
      )}
    </div>
  );
}
