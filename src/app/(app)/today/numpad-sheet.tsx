'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

// Deliberately a custom numpad, not the system numeric keyboard (spec:
// "numpad to (không bàn phím hệ thống)") — a food truck owner tapping this
// one-thumb, mid-shift, shouldn't fight autocorrect or a tiny system keypad.
export function NumpadSheet({
  title,
  unit = '°F',
  onCancel,
  onSave,
}: {
  title: string;
  unit?: string;
  onCancel: () => void;
  onSave: (value: number) => void;
}) {
  const [value, setValue] = useState('');

  function pressKey(key: string) {
    if (key === '⌫') {
      setValue((v) => v.slice(0, -1));
      return;
    }
    if (key === '.' && value.includes('.')) return;
    if (value.length >= 6) return;
    setValue((v) => v + key);
  }

  const numericValue = value === '' || value === '.' ? null : Number(value);

  return (
    <div
      role="dialog"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
    >
      <div className="w-full max-w-sm rounded-t-2xl bg-card p-4 sm:rounded-2xl">
        <p className="text-center text-sm text-ink-soft">{title}</p>
        <p className="my-4 text-center text-4xl font-semibold text-ink">
          {value || '0'}
          <span className="text-xl text-ink-soft">{unit}</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => pressKey(key)}
              className="rounded-lg bg-steel py-4 text-xl font-medium text-ink active:bg-steel-deep"
            >
              {key}
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1"
            disabled={numericValue === null}
            onClick={() => numericValue !== null && onSave(numericValue)}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
