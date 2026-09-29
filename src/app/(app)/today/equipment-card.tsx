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
      <Card
        className={`data-row border-l-[6px] ${
          lastLog ? (lastLog.isOutOfThreshold ? 'border-l-[#c9523f]' : 'border-l-[#2f8a59]') : 'border-l-[#dce4de]'
        }`}
      >
        <div className="min-w-0">
          <h3>{name}</h3>
          <p>{range}</p>
        </div>
        {lastLog ? (
          <div className="text-right">
            <p className={`big-value ${lastLog.isOutOfThreshold ? 'bad' : 'good'}`}>
              {lastLog.isOutOfThreshold ? '⚠' : '✓'} {lastLog.temperature}°F
            </p>
            <p className="mt-1.5">
              {time}
              {lastLog.loggedBy ? ` · ${lastLog.loggedBy}` : ''}
            </p>
          </div>
        ) : (
          <span className="status-pill neutral shrink-0">No log yet today</span>
        )}
      </Card>
    </button>
  );
}
