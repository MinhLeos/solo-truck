import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { QUIZ_QUESTIONS, QUIZ_BAND_COPY, type QuizResult } from './inspection-quiz';

const PAGE_SIZE: [number, number] = [612, 792];
const MARGIN = 48;
const LINE_HEIGHT = 16;

// Lazy-loaded from the quiz page — /tools rule 1 (no DB) doesn't forbid
// client-side file generation, it's explicitly the recommended way tools
// hand back a result without any backend at all.
export async function buildQuizResultPdf(
  result: QuizResult,
  answers: boolean[],
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const page = pdf.addPage(PAGE_SIZE);
  let y = PAGE_SIZE[1] - MARGIN;

  function drawText(text: string, { size = 11, useBold = false } = {}) {
    page.drawText(text, { x: MARGIN, y, size, font: useBold ? bold : font, color: rgb(0.08, 0.09, 0.1) });
    y -= LINE_HEIGHT;
  }

  drawText('Inspection Readiness Quiz — Solo Truck', { size: 16, useBold: true });
  drawText(`Score: ${result.score} / ${result.total}`, { size: 12 });
  y -= LINE_HEIGHT / 2;
  drawText(QUIZ_BAND_COPY[result.band].headline, { size: 13, useBold: true });
  drawText(QUIZ_BAND_COPY[result.band].detail, { size: 10 });
  y -= LINE_HEIGHT;

  QUIZ_QUESTIONS.forEach((question, i) => {
    // pdf-lib's StandardFonts are WinAnsi-encoded — no ✓/✗/≥, unlike the
    // on-screen UI which renders any Unicode fine (caught via a real
    // "WinAnsi cannot encode" runtime error, not a type or lint failure).
    const sanitizedQuestion = question.replace(/≥/g, '>=');
    drawText(`${answers[i] ? 'YES' : 'NO'} - ${sanitizedQuestion}`, { size: 10 });
  });

  y -= LINE_HEIGHT;
  page.drawText(
    'Free tool by Solo Truck — the 30-second daily compliance log for food trucks. solotruck.app',
    { x: MARGIN, y, size: 8, font, color: rgb(0.24, 0.26, 0.28) },
  );

  return pdf.save();
}
