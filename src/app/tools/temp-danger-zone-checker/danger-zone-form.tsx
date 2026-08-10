'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { checkDangerZone, type DangerZoneVerdict } from '@/lib/tools/danger-zone';

const VERDICT_COPY: Record<DangerZoneVerdict, { headline: string; className: string }> = {
  not_in_danger_zone: { headline: 'Outside the danger zone — no clock running.', className: 'text-pass' },
  safe: { headline: 'Still safe.', className: 'text-pass' },
  use_soon: { headline: 'Use it soon — the clock is almost up.', className: 'text-flame-deep' },
  discard: { headline: 'Discard it — past the safe window.', className: 'text-flame-deep' },
};

export function DangerZoneForm() {
  const [temperature, setTemperature] = useState('70');
  const [minutes, setMinutes] = useState('30');
  const [hotDay, setHotDay] = useState(false);

  const temperatureNum = Number(temperature);
  const minutesNum = Number(minutes);
  const valid = Number.isFinite(temperatureNum) && Number.isFinite(minutesNum) && minutesNum >= 0;
  const result = valid ? checkDangerZone(temperatureNum, minutesNum, hotDay) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <Input
          label="Food temperature (°F)"
          type="number"
          inputMode="decimal"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
        />
        <Input
          label="Minutes sitting out"
          type="number"
          inputMode="numeric"
          min={0}
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={hotDay} onChange={(e) => setHotDay(e.target.checked)} />
        Hot day — ambient air is 90°F or hotter
      </label>

      {result && (
        <Card className="flex flex-col gap-1">
          <p className={`text-lg font-semibold ${VERDICT_COPY[result.verdict].className}`}>
            {VERDICT_COPY[result.verdict].headline}
          </p>
          {result.inDangerZone && result.limitMinutes !== null && (
            <p className="text-sm text-ink-soft">
              The FDA Food Code allows {result.limitMinutes} minutes in the danger zone (40°F–140°F)
              {hotDay ? ' on a hot day' : ''}.{' '}
              {result.minutesRemaining !== null && result.minutesRemaining > 0
                ? `${result.minutesRemaining} minute${result.minutesRemaining === 1 ? '' : 's'} left.`
                : 'Time is up.'}
            </p>
          )}
          {!result.inDangerZone && (
            <p className="text-sm text-ink-soft">
              Only 40°F–140°F counts as the danger zone — this temperature is outside it.
            </p>
          )}
        </Card>
      )}

      <p className="text-xs text-ink-soft">
        This is a general FDA Food Code guideline, not a substitute for your local health
        department&apos;s rules — verify with your local health authority.
      </p>
    </div>
  );
}
