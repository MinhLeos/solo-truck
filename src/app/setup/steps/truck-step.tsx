'use client';

import { Input } from '@/components/ui/input';
import type { TruckStepData, UnitType } from '@/lib/onboarding/types';

const UNIT_TYPES: { value: UnitType; label: string }[] = [
  { value: 'truck', label: 'Truck' },
  { value: 'trailer', label: 'Trailer' },
  { value: 'cart', label: 'Cart' },
];

export function TruckStep({
  data,
  onChange,
}: {
  data: TruckStepData;
  onChange: (data: TruckStepData) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Truck name"
        type="text"
        required
        placeholder="Rosa's Tacos"
        value={data.name}
        onChange={(e) => onChange({ ...data, name: e.target.value })}
      />
      <div className="flex gap-3">
        <Input
          label="City"
          type="text"
          required
          placeholder="Austin"
          value={data.city}
          onChange={(e) => onChange({ ...data, city: e.target.value })}
        />
        <Input
          label="State"
          type="text"
          required
          maxLength={2}
          placeholder="TX"
          value={data.state}
          onChange={(e) => onChange({ ...data, state: e.target.value.toUpperCase() })}
          className="max-w-20 uppercase"
        />
      </div>
      <label className="flex flex-col gap-1 text-sm text-ink">
        Unit type
        <select
          value={data.unitType}
          onChange={(e) => onChange({ ...data, unitType: e.target.value as UnitType })}
          className="w-full rounded-md border border-steel-deep bg-card px-3 py-2 text-sm text-ink focus:border-flame focus:ring-2 focus:ring-flame/20 focus:outline-none"
        >
          {UNIT_TYPES.map((unit) => (
            <option key={unit.value} value={unit.value}>
              {unit.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
