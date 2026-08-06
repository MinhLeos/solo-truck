import { createClient } from '@/lib/supabase/server';
import { EquipmentCard } from './equipment-card';

export default async function TodayPage() {
  const supabase = await createClient();
  const { data: equipment } = await supabase
    .from('equipment')
    .select('id, name, threshold_min, threshold_max')
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-semibold text-ink">Today</h1>
      {(equipment ?? []).map((item) => (
        <EquipmentCard
          key={item.id}
          name={item.name}
          thresholdMin={item.threshold_min}
          thresholdMax={item.threshold_max}
        />
      ))}
    </div>
  );
}
