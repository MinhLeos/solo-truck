'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
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

  const answered = answers.filter((a) => a !== null).length;
  const bandClass = result ? (result.band === 'ready' ? 'ready' : result.band === 'almost_there' ? 'nearly' : 'attention') : '';

  return (
    <>
      <div className="quiz-progress">
        <div>
          <span>Pre-shift scan</span>
          <strong>{answered} of {QUIZ_QUESTIONS.length} answered</strong>
        </div>
        <div className="quiz-progress-track"><span style={{ width: `${(answered / QUIZ_QUESTIONS.length) * 100}%` }} /></div>
      </div>

      <div className="quiz-list">
        {QUIZ_QUESTIONS.map((question, i) => (
          <article className={`quiz-row ${answers[i] !== null ? 'answered' : ''}`} key={question}>
            <div className="quiz-row-number">{String(i + 1).padStart(2, '0')}</div>
            <p>{question}</p>
            <div className="quiz-options">
              <button
                type="button"
                className={answers[i] === true ? 'selected yes' : ''}
                aria-pressed={answers[i] === true}
                onClick={() => setAnswer(i, true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={answers[i] === false ? 'selected no' : ''}
                aria-pressed={answers[i] === false}
                onClick={() => setAnswer(i, false)}
              >
                No
              </button>
            </div>
          </article>
        ))}
      </div>

      {result && (
        <section className={`quiz-result ${bandClass}`}>
          <div className="result-score">
            <strong>{result.score} / {result.total}</strong>
            <span>{QUIZ_BAND_COPY[result.band].headline}</span>
          </div>
          <p>{QUIZ_BAND_COPY[result.band].detail}</p>
          <button type="button" className="quiz-download" onClick={handleExportPdf} disabled={exporting}>
            {exporting ? 'Preparing…' : 'Download result as PDF'} <Download size={16} />
          </button>
          <p className="quiz-closing">
            <ToolCtaLink tool={TOOL} href="/founding-trucks" style={{ color: 'var(--quiz-orange)', fontWeight: 700 }}>
              Solo Truck runs this exact checklist every shift
            </ToolCtaLink>{' '}
            — so you already know where you stand before an inspector does.
          </p>
        </section>
      )}
    </>
  );
}
