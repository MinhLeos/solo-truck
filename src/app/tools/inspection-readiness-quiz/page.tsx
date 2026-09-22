import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Flame } from 'lucide-react';
import { QuizForm } from './quiz-form';
import { ToolViewTracker } from '@/components/tools/ToolViewTracker';
import { siteMetadata } from '@/lib/seo/metadata';
import { SITE_URL } from '@/lib/seo/site';

export const metadata: Metadata = siteMetadata({
  title: 'Inspection Readiness Quiz — Solo Truck',
  description:
    '12 quick yes/no questions covering the same checks health inspectors look for. Get a score and a downloadable PDF.',
  path: '/tools/inspection-readiness-quiz',
  image: `${SITE_URL}/og/site/tools.png`,
});

export default function InspectionReadinessQuizPage() {
  return (
    <main className="quiz-page">
      <ToolViewTracker tool="inspection-readiness-quiz" />
      <header className="quiz-header">
        <Link className="quiz-brand" href="/"><span><Flame size={16} fill="currentColor" /></span>Solo Truck</Link>
        <Link className="quiz-back" href="/tools"><ArrowLeft size={15} />All tools</Link>
      </header>
      <section className="quiz-shell" aria-labelledby="quiz-title">
        <div className="quiz-intro">
          <h1 id="quiz-title">Inspection Readiness Quiz</h1>
          <p>
            Answer honestly — these are the same 12 checks a pre-shift routine should cover, and the
            ones inspectors ask about first.
          </p>
        </div>
        <QuizForm />
      </section>
      <footer className="quiz-footer">
        <span>Free tool by Solo Truck — the 30-second daily compliance log for food trucks.</span>
        <Link href="/founding-trucks">Try Solo Truck free →</Link>
      </footer>
    </main>
  );
}
