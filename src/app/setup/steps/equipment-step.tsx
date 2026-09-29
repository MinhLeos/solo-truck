'use client';

import styles from '../setup.module.css';
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
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[#748079]">
        Tap to add — thresholds prefill with FDA defaults, editable below.
      </p>
      <div className={styles.presets}>
        {EQUIPMENT_TYPE_ORDER.map((type) => (
          <button key={type} type="button" onClick={() => addPreset(type)}>
            <span aria-hidden="true">+</span>
            {EQUIPMENT_TYPE_DEFAULTS[type].label}
          </button>
        ))}
      </div>

      {items.length > 0 && (
        <div className={styles.equipmentList}>
          {items.map((item, index) => (
            <div key={index} className={styles.equipmentRow}>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(index, { name: e.target.value })}
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
                aria-label="Threshold maximum"
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className={styles.remove}
                aria-label={`Remove ${item.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && (
        <div className={styles.empty}>Add at least one piece of equipment to continue.</div>
      )}
    </div>
  );
}
