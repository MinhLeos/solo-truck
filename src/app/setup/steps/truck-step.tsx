'use client';

import styles from '../setup.module.css';
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
    <div className={styles.formGrid}>
      <label className="sm:col-span-2">
        Truck name
        <input
          type="text"
          required
          placeholder="Rosa's Tacos"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
        />
      </label>
      <label>
        City
        <input
          type="text"
          required
          placeholder="Austin"
          value={data.city}
          onChange={(e) => onChange({ ...data, city: e.target.value })}
        />
      </label>
      <label>
        State
        <input
          type="text"
          required
          maxLength={2}
          placeholder="TX"
          value={data.state}
          onChange={(e) => onChange({ ...data, state: e.target.value.toUpperCase() })}
          className={styles.stateInput}
        />
      </label>
      <label>
        Unit type
        <select
          value={data.unitType}
          onChange={(e) => onChange({ ...data, unitType: e.target.value as UnitType })}
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
