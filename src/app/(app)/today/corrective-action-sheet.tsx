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
      className="app-sheet-backdrop"
    >
      <div className="app-sheet">
        <p className="status-pill bad text-sm">⚠ {temperature}°F is out of range</p>
        <p className="mt-3 text-sm leading-relaxed text-[#6b7972]">
          Good catch. Inspectors respect honest logs with corrective actions.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setActionType(preset.value)}
              className={`rounded-[10px] border px-3.5 py-3 text-left text-sm font-semibold ${
                actionType === preset.value
                  ? 'border-[#2f8a59] bg-[#edf6ef] text-[#1e6b46]'
                  : 'border-[#dce4de] bg-[#fbfcfb] text-[#18231f]'
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
          className="mt-3 w-full rounded-[10px] border border-[#cad7cf] bg-[#fbfcfb] px-[13px] py-3 text-sm text-[#18231f]"
        />
        <label className="mt-3 block text-sm font-semibold text-[#557164]">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <span className="inline-block cursor-pointer rounded-[10px] border border-dashed border-[#b9c9bf] px-3.5 py-2.5">
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
