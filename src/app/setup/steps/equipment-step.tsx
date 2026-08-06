'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  EQUIPMENT_TYPE_DEFAULTS,
  EQUIPMENT_TYPE_ORDER,
  type EquipmentType,
} from '@/lib/equipment-presets';
import type { EquipmentDraft } from '@/lib/onboarding/types';

export function EquipmentStep({
  items,
  onChange,
}: {
  items: EquipmentDraft[];
  onChange: (items: EquipmentDraft[]) => void;
}) {
  function addPreset(type: EquipmentType) {
    const preset = EQUIPMENT_TYPE_DEFAULTS[type];
    onChange([
      ...items,
      {
        name: preset.label,
        equipmentType: type,
        thresholdMin: preset.thresholdMin,
        thresholdMax: preset.thresholdMax,
      },
    ]);
  }

  function updateItem(index: number, patch: Partial<EquipmentDraft>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-ink-soft">
        Tap to add — thresholds prefill with FDA defaults, editable below.
      </p>
      <div className="flex flex-wrap gap-2">
        {EQUIPMENT_TYPE_ORDER.map((type) => (
          <Button
            key={type}
            type="button"
            variant="secondary"
            onClick={() => addPreset(type)}
          >
            + {EQUIPMENT_TYPE_DEFAULTS[type].label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <Card key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(index, { name: e.target.value })}
              className="min-w-0 flex-1 rounded-md border border-steel-deep bg-card px-2 py-1 text-sm text-ink"
              aria-label="Equipment name"
            />
            <input
              type="number"
              value={item.thresholdMin ?? ''}
              onChange={(e) =>
                updateItem(index, {
                  thresholdMin: e.target.value === '' ? null : Number(e.target.value),
                })
              }
              placeholder="min °F"
              className="w-20 rounded-md border border-steel-deep bg-card px-2 py-1 text-sm text-ink"
              aria-label="Threshold minimum"
            />
            <input
              type="number"
              value={item.thresholdMax ?? ''}
              onChange={(e) =>
                updateItem(index, {
                  thresholdMax: e.target.value === '' ? null : Number(e.target.value),
                })
              }
              placeholder="max °F"
              className="w-20 rounded-md border border-steel-deep bg-card px-2 py-1 text-sm text-ink"
              aria-label="Threshold maximum"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-sm text-ink-soft hover:text-flame-deep"
              aria-label={`Remove ${item.name}`}
            >
              ✕
            </button>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-sm text-ink-soft">
          Add at least one piece of equipment to continue.
        </p>
      )}
    </div>
  );
}
