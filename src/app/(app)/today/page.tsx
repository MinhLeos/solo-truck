import { createClient } from '@/lib/supabase/server';
import { businessDayRangeUtc, todayInTimezone } from '@/lib/timezone';
import { computeCurrentStreak } from '@/lib/streaks';
import type { TodayLog } from '@/lib/logs/types';
import { TodayClient } from './today-client';

export default async function TodayPage() {
  const supabase = await createClient();

  const { data: truck } = await supabase.from('trucks').select('id, timezone').maybeSingle();
  const timezone = truck?.timezone ?? 'UTC';

  const { data: shiftRows } = await supabase
    .from('shifts')
    .select('day_of_week')
    .is('deleted_at', null);
  const shiftDaysOfWeek = (shiftRows ?? []).map((row) => row.day_of_week);
  const streak = truck
    ? await computeCurrentStreak(
        supabase,
        truck.id,
        shiftDaysOfWeek,
        timezone,
        todayInTimezone(timezone),
      )
    : 0;

  const { data: equipmentRows } = await supabase
    .from('equipment')
    .select('id, name, threshold_min, threshold_max')
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  const equipment = (equipmentRows ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    thresholdMin: item.threshold_min,
    thresholdMax: item.threshold_max,
  }));

  const [dayStart, dayEnd] = businessDayRangeUtc(todayInTimezone(timezone), timezone);

  const { data: logRows } = await supabase
    .from('logs')
    .select('id, equipment_id, temperature, recorded_at, is_out_of_threshold, logged_by')
    .gte('recorded_at', dayStart.toISOString())
    .lt('recorded_at', dayEnd.toISOString())
    .order('recorded_at', { ascending: true });

  // Latest reading per equipment wins — logRows is ascending, so a later
  // iteration simply overwrites an earlier one for the same equipment_id.
  const initialLogs: Record<string, TodayLog> = {};
  for (const row of logRows ?? []) {
    initialLogs[row.equipment_id] = {
      id: row.id,
      equipmentId: row.equipment_id,
      temperature: row.temperature,
      recordedAt: row.recorded_at,
      isOutOfThreshold: row.is_out_of_threshold,
      loggedBy: row.logged_by,
    };
  }

  const { data: staffRows } = await supabase
    .from('staff')
    .select('name, pin')
    .is('deleted_at', null);

  return (
    <TodayClient
      equipment={equipment}
      initialLogs={initialLogs}
      staff={staffRows ?? []}
      streak={streak}
    />
  );
}
