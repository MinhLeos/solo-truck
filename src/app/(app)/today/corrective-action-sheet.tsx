'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { resizeImageFile } from '@/lib/resize-image';

const PRESETS = [
  { value: 'moved_food', label: 'Moved food' },
  { value: 'adjusted_thermostat', label: 'Adjusted thermostat' },
  { value: 'discarded_items', label: 'Discarded items' },
  { value: 'called_repair', label: 'Called repair' },
  { value: 'other', label: 'Other' },
];

// Blocks completion of an out-of-threshold log until a corrective action is
// chosen (ARCHITECTURE.md §6.2) — Cancel here discards the WHOLE log, not
// just the CA, since an out-of-threshold log without a CA isn't a valid
// state to save at all.
export function CorrectiveActionSheet({
  temperature,
  onCancel,
  onSubmit,
}: {
  temperature: number;
  onCancel: () => void;
  onSubmit: (data: { actionType: string; note: string; photo: File | null }) => void;
}) {
  const [actionType, setActionType] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [processingPhoto, setProcessingPhoto] = useState(false);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessingPhoto(true);
    const resized = await resizeImageFile(file, 1600);
    setPhoto(resized);
    setProcessingPhoto(false);
  }

  const canSubmit = actionType !== null && (actionType !== 'other' || note.trim().length > 0);

  return (
    <div
      role="dialog"
      aria-label="Corrective action required"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
    >
      <div className="w-full max-w-sm rounded-t-2xl bg-card p-4 sm:rounded-2xl">
        <p className="text-sm font-medium text-flame-deep">⚠ {temperature}°F is out of range</p>
        <p className="mt-1 text-sm text-ink-soft">
          Good catch. Inspectors respect honest logs with corrective actions.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setActionType(preset.value)}
              className={`rounded-lg border px-3 py-2 text-left text-sm ${
                actionType === preset.value
                  ? 'border-flame bg-flame/10 text-ink'
                  : 'border-steel-deep text-ink'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={
            actionType === 'other' ? 'Describe what you did (required)' : 'Add a note (optional)'
          }
          rows={2}
          className="mt-2 w-full rounded-md border border-steel-deep bg-card px-3 py-2 text-sm text-ink"
        />
        <label className="mt-2 block text-sm text-ink-soft">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <span className="inline-block rounded-md border border-steel-deep px-3 py-2">
            {processingPhoto ? 'Processing…' : photo ? 'Photo attached ✓' : '+ Add photo (optional)'}
          </span>
        </label>
        <div className="mt-4 flex gap-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1"
            disabled={!canSubmit}
            onClick={() => actionType && onSubmit({ actionType, note: note.trim(), photo })}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
