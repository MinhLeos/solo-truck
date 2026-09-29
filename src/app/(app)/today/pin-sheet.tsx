'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

// PIN is attribution only, not a security mechanism (SECURITY.md §7) — it's
// matched client-side against the business's own staff list, already
// RLS-scoped to this owner. There's nothing to protect here beyond "which
// of my 1-3 staff logged this."
export function PinSheet({
  staff,
  onCancel,
  onVerified,
}: {
  staff: { name: string; pin: string }[];
  onCancel: () => void;
  onVerified: (staffName: string) => void;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  function pressKey(key: string) {
    if (!key) return;
    if (key === '⌫') {
      setValue((v) => v.slice(0, -1));
      setError(false);
      return;
    }
    if (value.length >= 4) return;
    const next = value + key;
    setValue(next);
    setError(false);
    if (next.length === 4) {
      const match = staff.find((s) => s.pin === next);
      if (match) {
        onVerified(match.name);
      } else {
        setError(true);
        setValue('');
      }
    }
  }

  return (
    <div
      role="dialog"
      aria-label="Enter your PIN"
      className="app-sheet-backdrop"
    >
      <div className="app-sheet">
        <p className="text-center text-base font-bold">Who&apos;s logging this?</p>
        <div className="my-4 flex justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-4 w-4 rounded-full border-2 ${
                i < value.length ? 'border-[#1d6b45] bg-[#1d6b45]' : 'border-[#cad7cf]'
              }`}
            />
          ))}
        </div>
        {error && (
          <p role="alert" className="mb-2 text-center text-sm font-semibold text-[#a94435]">
            PIN not recognized
          </p>
        )}
        <div className="grid grid-cols-3 gap-2">
          {KEYS.map((key, i) => (
            <button
              key={i}
              type="button"
              disabled={!key}
              onClick={() => pressKey(key)}
              className="app-key disabled:opacity-0"
            >
              {key}
            </button>
          ))}
        </div>
        <Button type="button" variant="secondary" className="mt-4 w-full" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
