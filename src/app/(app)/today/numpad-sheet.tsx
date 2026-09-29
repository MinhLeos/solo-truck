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
      className="app-sheet-backdrop"
    >
      <div className="app-sheet">
        <p className="app-eyebrow text-center">{title}</p>
        <p className="my-5 text-center text-6xl font-extrabold tracking-[-.05em]">
          {value || '0'}
          <span className="text-2xl text-[#6b7972]">{unit}</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => pressKey(key)}
              className="app-key"
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
