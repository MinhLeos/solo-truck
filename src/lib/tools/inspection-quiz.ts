// Same 12 checks Solo Truck's pre-shift checklist seeds for every new
// truck (supabase/migrations/20260806064412_seed_checklist_templates.sql)
// — kept as a plain literal here, not imported from the DB, since /tools
// pages never touch the database at all (see /tools/layout.tsx).
export const QUIZ_QUESTIONS = [
  'Permits + commissary agreement present',
  'Water supply has adequate pressure',
  'Grey tank ≥15% larger than fresh water tank',
  'Hand sink stocked: soap, towels, water ≥100°F',
  'Probe thermometer calibrated',
  'Cold holding at correct temperature',
  'Hot holding at correct temperature',
  "Today's log has been updated",
  'Allergen matrix present, staff can answer questions',
  'Raw food stored below ready-to-eat, date labels present',
  'Sanitizer at correct concentration, test strips not expired/wet',
  'Pest control: screens intact, no standing water; grease/trash covered',
] as const;

export type QuizBand = 'ready' | 'almost_there' | 'at_risk';

export interface QuizResult {
  score: number;
  total: number;
  band: QuizBand;
}

export function scoreQuiz(answers: boolean[]): QuizResult {
  const score = answers.filter(Boolean).length;
  const total = QUIZ_QUESTIONS.length;
  const band: QuizBand = score === total ? 'ready' : score >= 9 ? 'almost_there' : 'at_risk';
  return { score, total, band };
}

export const QUIZ_BAND_COPY: Record<QuizBand, { headline: string; detail: string }> = {
  ready: {
    headline: "You're inspector-ready.",
    detail: 'Keep it up — the habit matters more than any single perfect day.',
  },
  almost_there: {
    headline: 'Almost there.',
    detail: 'A few gaps could still catch an inspector\'s eye — fix the ones you marked no first.',
  },
  at_risk: {
    headline: 'At risk in an inspection.',
    detail: 'Several of the checks inspectors look for first aren\'t covered yet — worth fixing before your next shift.',
  },
};
