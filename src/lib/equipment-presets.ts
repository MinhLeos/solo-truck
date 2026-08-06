// FDA Food Code defaults (EVIDENCE.md §2 / ARCHITECTURE.md §6.2) — a fixed
// set of 3 starting points offered as one-tap chips in onboarding step 2,
// not per-tenant configurable reference data, so these are plain constants
// rather than a DB table.
export type EquipmentType = 'cold_holding' | 'hot_holding' | 'freezer';

export const EQUIPMENT_TYPE_DEFAULTS: Record<
  EquipmentType,
  { label: string; thresholdMin: number | null; thresholdMax: number | null }
> = {
  cold_holding: { label: 'Fridge', thresholdMin: null, thresholdMax: 41 },
  hot_holding: { label: 'Hot hold', thresholdMin: 135, thresholdMax: null },
  freezer: { label: 'Freezer', thresholdMin: null, thresholdMax: 0 },
};

export const EQUIPMENT_TYPE_ORDER: EquipmentType[] = [
  'cold_holding',
  'hot_holding',
  'freezer',
];
