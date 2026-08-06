import type { EquipmentType } from '@/lib/equipment-presets';

export type UnitType = 'truck' | 'trailer' | 'cart';

export interface TruckStepData {
  name: string;
  city: string;
  state: string;
  unitType: UnitType;
}

export interface EquipmentDraft {
  name: string;
  equipmentType: EquipmentType;
  thresholdMin: number | null;
  thresholdMax: number | null;
}

export interface ShiftDraft {
  dayOfWeek: number; // 0 (Sun) – 6 (Sat)
  startTime: string; // 'HH:MM'
  endTime: string; // 'HH:MM'
}

export interface WizardData {
  truck: TruckStepData;
  equipment: EquipmentDraft[];
  shifts: ShiftDraft[];
}

export const EMPTY_WIZARD_DATA: WizardData = {
  truck: { name: '', city: '', state: '', unitType: 'truck' },
  equipment: [],
  shifts: [],
};

export const WIZARD_DRAFT_STORAGE_KEY = 'solo-truck-onboarding-draft';
