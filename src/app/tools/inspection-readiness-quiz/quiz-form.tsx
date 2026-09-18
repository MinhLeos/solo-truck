'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToolCtaLink } from '@/components/tools/ToolCtaLink';
import { trackToolEvent } from '@/lib/tools/analytics';
import { QUIZ_QUESTIONS, QUIZ_BAND_COPY, scoreQuiz } from '@/lib/tools/inspection-quiz';

const TOOL = 'inspection-readiness-quiz';

export function QuizForm() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    new Array(QUIZ_QUESTIONS.length).fill(null),
  );
  const [exporting, setExporting] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const result = allAnswered ? scoreQuiz(answers as boolean[]) : null;

  useEffect(() => {
    if (result) trackToolEvent('tool_result', TOOL, { score: result.score, band: result.band });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.score, result?.band]);

  function setAnswer(index: number, value: boolean) {
    setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
  }

  async function handleExportPdf() {
    if (!result) return;
    trackToolEvent('tool_cta_click', TOOL, { cta: 'pdf_export' });
    setExporting(true);
    try {
      const { buildQuizResultPdf } = await import('@/lib/tools/inspection-quiz-pdf');
      const bytes = await buildQuizResultPdf(result, answers as boolean[]);
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inspection-readiness-quiz-result.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {QUIZ_QUESTIONS.map((question, i) => (
        <Card key={question} className="flex items-center justify-between gap-3">
          <span className="text-sm text-ink">{question}</span>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setAnswer(i, true)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                answers[i] === true ? 'border-pass bg-pass-bg text-pass-deep' : 'border-steel-deep text-ink-soft'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setAnswer(i, false)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                answers[i] === false ? 'border-flame-deep bg-warn-bg text-flame-deep' : 'border-steel-deep text-ink-soft'
              }`}
            >
              No
            </button>
          </div>
        </Card>
      ))}

      {result && (
        <Card className="flex flex-col gap-2">
          <p className="text-lg font-semibold text-ink">
            {result.score} / {result.total} — {QUIZ_BAND_COPY[result.band].headline}
          </p>
          <p className="text-sm text-ink-soft">{QUIZ_BAND_COPY[result.band].detail}</p>
          <Button type="button" onClick={handleExportPdf} disabled={exporting}>
            {exporting ? 'Preparing…' : 'Download result as PDF'}
          </Button>
          <p className="text-sm text-ink-soft">
            <ToolCtaLink tool={TOOL} href="/founding-trucks" className="font-medium text-flame">
              Solo Truck runs this exact checklist every shift
            </ToolCtaLink>{' '}
            — so you already know where you stand before an inspector does.
          </p>
        </Card>
      )}
    </div>
  );
}
