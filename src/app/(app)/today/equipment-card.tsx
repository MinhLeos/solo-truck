import { Card } from '@/components/ui/card';

export function EquipmentCard({
  name,
  thresholdMin,
  thresholdMax,
}: {
  name: string;
  thresholdMin: number | null;
  thresholdMax: number | null;
}) {
  const range =
    thresholdMin !== null && thresholdMax !== null
      ? `${thresholdMin}°F – ${thresholdMax}°F`
      : thresholdMin !== null
        ? `≥ ${thresholdMin}°F`
        : thresholdMax !== null
          ? `≤ ${thresholdMax}°F`
          : 'No threshold set';

  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="font-medium text-ink">{name}</p>
        <p className="text-xs text-ink-soft">{range}</p>
      </div>
      {/* The actual "log a reading" button lands in Phase 2.1 — this card
          only proves the equipment list renders after onboarding. */}
      <span className="text-xs text-ink-soft">No log yet today</span>
    </Card>
  );
}
