import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { INSPECTOR_DISCLAIMER } from './disclaimer';
import type { InspectorReport } from './report';

const PAGE_SIZE: [number, number] = [612, 792]; // US Letter, points
const MARGIN = 48;
const LINE_HEIGHT = 14;

// Lazy-loaded from inspector-view.tsx so pdf-lib never lands in the main
// bundle for the (much more common) case of just viewing the report.
export async function buildInspectorPdf({
  truckName,
  rangeDays,
  report,
}: {
  truckName: string;
  rangeDays: 30 | 90;
  report: InspectorReport;
}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage(PAGE_SIZE);
  let y = PAGE_SIZE[1] - MARGIN;

  function newPageIfNeeded(linesNeeded = 1) {
    if (y - linesNeeded * LINE_HEIGHT < MARGIN + 40) {
      page = pdf.addPage(PAGE_SIZE);
      y = PAGE_SIZE[1] - MARGIN;
    }
  }

  function drawText(text: string, { size = 10, useBold = false } = {}) {
    newPageIfNeeded();
    page.drawText(text, { x: MARGIN, y, size, font: useBold ? bold : font, color: rgb(0.08, 0.09, 0.1) });
    y -= LINE_HEIGHT;
  }

  drawText(`Temperature & Compliance Report — ${truckName} — last ${rangeDays} days`, {
    size: 14,
    useBold: true,
  });
  drawText(`Generated ${new Date().toLocaleString()}`, { size: 9 });
  y -= LINE_HEIGHT / 2;

  drawText('Logs', { size: 12, useBold: true });
  if (report.logs.length === 0) drawText('No logs in this range.');
  for (const log of report.logs) {
    const status = log.isOutOfThreshold ? 'OUT OF RANGE' : 'in range';
    const ca = log.correctiveAction
      ? ` — CA: ${log.correctiveAction.actionType.replace(/_/g, ' ')}${log.correctiveAction.note ? ` (${log.correctiveAction.note})` : ''}`
      : '';
    const offline = log.loggedOfflineSyncedLater ? ' [logged offline, synced later]' : '';
    drawText(
      `${new Date(log.recordedAt).toLocaleString()} — ${log.equipmentName}: ${log.temperature}°F (${status})${ca}${offline}`,
      { size: 9 },
    );
  }

  y -= LINE_HEIGHT;
  drawText('Checklists', { size: 12, useBold: true });
  if (report.checklistRuns.length === 0) drawText('No checklist runs in this range.');
  for (const run of report.checklistRuns) {
    const checkedCount = run.items.filter((item) => item.checked).length;
    drawText(
      `${new Date(run.recordedAt).toLocaleString()} — ${checkedCount}/${run.items.length} items checked`,
      { size: 9 },
    );
  }

  y -= LINE_HEIGHT;
  drawText('Documents on file', { size: 12, useBold: true });
  const currentDocuments = report.documents.filter(
    (doc) => !doc.expiresAt || new Date(doc.expiresAt).getTime() > Date.now(),
  );
  if (currentDocuments.length === 0) drawText('No current documents.');
  for (const doc of currentDocuments) {
    drawText(
      `${doc.kind.replace(/_/g, ' ')}${doc.expiresAt ? ` — expires ${new Date(doc.expiresAt).toLocaleDateString()}` : ''}`,
      { size: 9 },
    );
  }

  y -= LINE_HEIGHT * 2;
  newPageIfNeeded(3);
  page.drawText(INSPECTOR_DISCLAIMER, {
    x: MARGIN,
    y,
    size: 8,
    font,
    color: rgb(0.24, 0.26, 0.28),
    maxWidth: PAGE_SIZE[0] - MARGIN * 2,
    lineHeight: 10,
  });

  return pdf.save();
}
