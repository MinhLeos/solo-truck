'use client';

import { useEffect, useState } from 'react';
import { Check, Gauge, Thermometer, TriangleAlert } from 'lucide-react';
import { checkDangerZone, type DangerZoneVerdict } from '@/lib/tools/danger-zone';
import { trackToolEvent } from '@/lib/tools/analytics';

const TOOL = 'temp-danger-zone-checker';

const VERDICT_COPY: Record<DangerZoneVerdict, { headline: string; tone: string }> = {
  not_in_danger_zone: { headline: 'Outside the danger zone — no clock running.', tone: 'outside' },
  safe: { headline: 'Still safe.', tone: 'safe' },
  use_soon: { headline: 'Use it soon — the clock is almost up.', tone: 'soon' },
  discard: { headline: 'Discard it — past the safe window.', tone: 'discard' },
};

export function DangerZoneForm() {
  const [temperature, setTemperature] = useState('70');
  const [minutes, setMinutes] = useState('30');
  const [hotDay, setHotDay] = useState(false);

  const temperatureNum = Number(temperature);
  const minutesNum = Number(minutes);
  const valid = Number.isFinite(temperatureNum) && Number.isFinite(minutesNum) && minutesNum >= 0;
  const result = valid ? checkDangerZone(temperatureNum, minutesNum, hotDay) : null;

  useEffect(() => {
    if (result) trackToolEvent('tool_result', TOOL, { verdict: result.verdict });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.verdict]);

  const progress =
    result?.inDangerZone && result.limitMinutes
      ? Math.min(100, Math.max(0, ((result.limitMinutes - (result.minutesRemaining ?? 0)) / result.limitMinutes) * 100))
      : 0;
  const tone = result ? VERDICT_COPY[result.verdict].tone : 'outside';
  const warn = tone === 'soon' || tone === 'discard';

  return (
    <section className="checker-layout">
      <div className="checker-intro">
        <p className="checker-kicker"><span />Free food safety tool</p>
        <h1>Temp Danger<br /><em>Zone Checker</em></h1>
        <p className="checker-subtext">
          Food between 40°F and 140°F is in the &quot;danger zone&quot; — bacteria grow fastest
          here. The FDA Food Code gives you 2 hours (1 on a hot day) before it&apos;s no longer
          safe to serve.
        </p>
        <form className="checker-form" onSubmit={(e) => e.preventDefault()}>
          <label>
            Food temperature (°F)
            <div className="checker-input">
              <Thermometer size={18} />
              <input
                type="number"
                inputMode="decimal"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
            </div>
          </label>
          <label>
            Minutes sitting out
            <div className="checker-input">
              <Gauge size={18} />
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
            </div>
          </label>
          <label className="checker-checkbox">
            <input type="checkbox" checked={hotDay} onChange={(e) => setHotDay(e.target.checked)} />
            <span>Hot day — ambient air is 90°F or hotter</span>
          </label>
        </form>
      </div>

      {result && (
        <div className={`checker-result result-${tone}`} aria-live="polite">
          <div className="gauge-wrap">
            <div className="gauge">
              <div className="gauge-arc" style={{ '--gauge-progress': `${progress}%` } as React.CSSProperties} />
              <div className="gauge-center">
                <span className="gauge-icon">{warn ? <TriangleAlert size={25} /> : <Check size={25} />}</span>
                <strong>
                  {!result.inDangerZone ? 'READY' : tone === 'discard' ? 'STOP' : `${result.minutesRemaining}m`}
                </strong>
                <small>{result.inDangerZone ? 'REMAINING' : 'NO CLOCK'}</small>
              </div>
            </div>
          </div>
          <p className="result-label">{VERDICT_COPY[result.verdict].headline}</p>
          <p className="result-detail">
            {result.inDangerZone && result.limitMinutes !== null ? (
              <>
                The FDA Food Code allows {result.limitMinutes} minutes in the danger zone (40°F–140°F)
                {hotDay ? ' on a hot day' : ''}.{' '}
                {result.minutesRemaining !== null && result.minutesRemaining > 0
                  ? `${result.minutesRemaining} minute${result.minutesRemaining === 1 ? '' : 's'} left.`
                  : 'Time is up.'}
              </>
            ) : (
              'Only 40°F–140°F counts as the danger zone — this temperature is outside it.'
            )}
          </p>
          <div className="result-rule"><span /><small>FDA FOOD CODE · 40°F — 140°F</small><span /></div>
        </div>
      )}
    </section>
  );
}
