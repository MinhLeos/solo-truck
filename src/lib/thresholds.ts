// Single source of truth for "is this reading out of range" — used by both
// the client (to decide whether the corrective-action sheet must open) and
// the sync route (to stamp is_out_of_threshold server-side). Two independent
// implementations of this comparison would eventually drift.
export function isOutOfThreshold(
  temperature: number,
  thresholdMin: number | null,
  thresholdMax: number | null,
): boolean {
  if (thresholdMin !== null && temperature < thresholdMin) return true;
  if (thresholdMax !== null && temperature > thresholdMax) return true;
  return false;
}
