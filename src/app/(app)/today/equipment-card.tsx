import { Card } from '@/components/ui/card';
import type { TodayLog } from '@/lib/logs/types';

export function EquipmentCard({
  name,
  thresholdMin,
  thresholdMax,
  lastLog,
  onTap,
}: {
  name: string;
  thresholdMin: number | null;
  thresholdMax: number | null;
  lastLog?: TodayLog;
  onTap: () => void;
}) {
  const range =
    thresholdMin !== null && thresholdMax !== null
      ? `${thresholdMin}°F – ${thresholdMax}°F`
      : thresholdMin !== null
        ? `≥ ${thresholdMin}°F`
        : thresholdMax !== null
          ? `≤ ${thresholdMax}°F`
          : 'No threshold set';

  const time = lastLog
    ? new Date(lastLog.recordedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : null;

  return (
    <button type="button" onClick={onTap} className="w-full text-left">
      <Card className="flex items-center justify-between">
        <div>
          <p className="font-medium text-ink">{name}</p>
          <p className="text-xs text-ink-soft">{range}</p>
        </div>
        {lastLog ? (
          <div className="text-right">
            <p
              className={`font-semibold ${lastLog.isOutOfThreshold ? 'text-flame-deep' : 'text-pass'}`}
            >
              {lastLog.isOutOfThreshold ? '⚠' : '✓'} {lastLog.temperature}°F
            </p>
            <p className="text-xs text-ink-soft">
              {time}
              {lastLog.loggedBy ? ` · ${lastLog.loggedBy}` : ''}
            </p>
          </div>
        ) : (
          <span className="text-xs text-ink-soft">No log yet today</span>
        )}
      </Card>
    </button>
  );
}
