// FDA Food Code: food sitting between 40°F and 140°F ("the danger zone") is
// safe for up to 2 hours — 1 hour if the ambient temperature is 90°F or
// hotter (bacteria grow faster). Outside that range entirely, there's no
// clock running at all.
const DANGER_ZONE_MIN_F = 40;
const DANGER_ZONE_MAX_F = 140;
const STANDARD_LIMIT_MINUTES = 120;
const HOT_DAY_LIMIT_MINUTES = 60;
const USE_SOON_WINDOW_MINUTES = 30;

export type DangerZoneVerdict = 'not_in_danger_zone' | 'safe' | 'use_soon' | 'discard';

export interface DangerZoneResult {
  inDangerZone: boolean;
  limitMinutes: number | null;
  minutesRemaining: number | null;
  verdict: DangerZoneVerdict;
}

export function checkDangerZone(
  temperatureF: number,
  minutesElapsed: number,
  hotDay: boolean,
): DangerZoneResult {
  const inDangerZone = temperatureF > DANGER_ZONE_MIN_F && temperatureF < DANGER_ZONE_MAX_F;
  if (!inDangerZone) {
    return { inDangerZone: false, limitMinutes: null, minutesRemaining: null, verdict: 'not_in_danger_zone' };
  }

  const limitMinutes = hotDay ? HOT_DAY_LIMIT_MINUTES : STANDARD_LIMIT_MINUTES;
  const minutesRemaining = limitMinutes - minutesElapsed;

  if (minutesRemaining <= 0) {
    return { inDangerZone: true, limitMinutes, minutesRemaining: 0, verdict: 'discard' };
  }
  if (minutesRemaining <= USE_SOON_WINDOW_MINUTES) {
    return { inDangerZone: true, limitMinutes, minutesRemaining, verdict: 'use_soon' };
  }
  return { inDangerZone: true, limitMinutes, minutesRemaining, verdict: 'safe' };
}
