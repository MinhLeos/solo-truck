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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
    >
      <div className="w-full max-w-sm rounded-t-2xl bg-card p-4 sm:rounded-2xl">
        <p className="text-center text-sm text-ink-soft">Who&apos;s logging this?</p>
        <div className="my-4 flex justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-4 w-4 rounded-full border-2 ${
                i < value.length ? 'border-flame bg-flame' : 'border-steel-deep'
              }`}
            />
          ))}
        </div>
        {error && (
          <p role="alert" className="mb-2 text-center text-sm text-flame-deep">
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
              className="rounded-lg bg-steel py-4 text-xl font-medium text-ink active:bg-steel-deep disabled:opacity-0"
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
