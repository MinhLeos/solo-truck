import type { Metadata } from 'next';
import { QuizForm } from './quiz-form';

export const metadata: Metadata = {
  title: 'Inspection Readiness Quiz — Solo Truck',
  description:
    '12 quick yes/no questions covering the same checks health inspectors look for. Get a score and a downloadable PDF.',
};

export default function InspectionReadinessQuizPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">Inspection Readiness Quiz</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Answer honestly — these are the same 12 checks a pre-shift routine should cover, and the
          ones inspectors ask about first.
        </p>
      </div>
      <QuizForm />
    </div>
  );
}
