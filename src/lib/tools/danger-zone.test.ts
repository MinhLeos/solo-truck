import { describe, expect, it } from 'vitest';
import { checkDangerZone } from './danger-zone';

describe('checkDangerZone', () => {
  it('is not in the danger zone at or below 40°F', () => {
    expect(checkDangerZone(40, 0, false).verdict).toBe('not_in_danger_zone');
    expect(checkDangerZone(35, 500, false).verdict).toBe('not_in_danger_zone');
  });

  it('is not in the danger zone at or above 140°F', () => {
    expect(checkDangerZone(140, 0, false).verdict).toBe('not_in_danger_zone');
    expect(checkDangerZone(165, 500, false).verdict).toBe('not_in_danger_zone');
  });

  it('is safe well within the standard 2-hour limit', () => {
    const result = checkDangerZone(70, 30, false);
    expect(result.verdict).toBe('safe');
    expect(result.minutesRemaining).toBe(90);
  });

  it('warns use_soon within 30 minutes of the standard limit', () => {
    const result = checkDangerZone(70, 100, false);
    expect(result.verdict).toBe('use_soon');
    expect(result.minutesRemaining).toBe(20);
  });

  it('says discard once the standard 2-hour limit has passed', () => {
    const result = checkDangerZone(70, 121, false);
    expect(result.verdict).toBe('discard');
    expect(result.minutesRemaining).toBe(0);
  });

  it('uses the shorter 1-hour limit on a hot day (ambient ≥90°F)', () => {
    expect(checkDangerZone(70, 20, true).verdict).toBe('safe');
    expect(checkDangerZone(70, 61, true).verdict).toBe('discard');
  });
});
