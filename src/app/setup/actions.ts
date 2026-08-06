'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const equipmentSchema = z.object({
  name: z.string().trim().min(1).max(80),
  equipmentType: z.enum(['cold_holding', 'hot_holding', 'freezer']),
  thresholdMin: z.number().nullable(),
  thresholdMax: z.number().nullable(),
});

const shiftSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

const wizardSchema = z.object({
  truck: z.object({
    name: z.string().trim().min(1).max(120),
    city: z.string().trim().min(1).max(80),
    state: z.string().trim().length(2),
    unitType: z.enum(['truck', 'trailer', 'cart']),
  }),
  equipment: z.array(equipmentSchema).min(1),
  shifts: z.array(shiftSchema),
});

export type OnboardingState = { status: 'idle' | 'error'; message?: string };

export async function completeOnboarding(
  _prevState: OnboardingState,
  payload: unknown,
): Promise<OnboardingState> {
  const parsed = wizardSchema.safeParse(payload);

  if (!parsed.success) {
    return { status: 'error', message: 'Add a truck name, city, state and at least one piece of equipment.' };
  }

  const supabase = await createClient();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { error } = await supabase.rpc('complete_onboarding', {
    p_truck_name: parsed.data.truck.name,
    p_city: parsed.data.truck.city,
    p_state: parsed.data.truck.state,
    p_timezone: timezone,
    p_unit_type: parsed.data.truck.unitType,
    p_equipment: parsed.data.equipment.map((item) => ({
      name: item.name,
      equipment_type: item.equipmentType,
      threshold_min: item.thresholdMin,
      threshold_max: item.thresholdMax,
    })),
    p_shifts: parsed.data.shifts.map((shift) => ({
      day_of_week: shift.dayOfWeek,
      start_time: shift.startTime,
      end_time: shift.endTime,
    })),
  });

  if (error) {
    console.error('[complete_onboarding]', error.code, error.message);
    return { status: 'error', message: 'Could not finish setup. Try again.' };
  }

  redirect('/today');
}
