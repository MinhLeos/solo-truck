'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { documentStatus } from '@/lib/documents/status';
import { INSPECTOR_DISCLAIMER } from '@/lib/inspector/disclaimer';
import type { InspectorReport } from '@/lib/inspector/report';

type Tab = 'logs' | 'checklists' | 'documents';

const KIND_LABELS: Record<string, string> = {
  permit: 'Health permit',
  commissary_agreement: 'Commissary agreement',
  food_manager_cert: 'Food manager certificate',
  insurance: 'Insurance',
  other: 'Other',
};

export function InspectorView({
  truckName,
  rangeDays,
  report,
}: {
  truckName: string;
  rangeDays: 30 | 90;
  report: InspectorReport;
}) {
  const [tab, setTab] = useState<Tab>('logs');
  const [exporting, setExporting] = useState(false);

  async function handleExportPdf() {
    setExporting(true);
    try {
      const { buildInspectorPdf } = await import('@/lib/inspector/pdf');
      const bytes = await buildInspectorPdf({ truckName, rangeDays, report });
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${truckName.replace(/\s+/g, '-').toLowerCase()}-compliance-report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink">{truckName}</h1>
          <p className="text-xs text-ink-soft">
            Temperature &amp; Compliance Report — last {rangeDays} days
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button type="button" variant="secondary" onClick={() => window.print()}>
            Print backup
          </Button>
          <Button type="button" onClick={handleExportPdf} disabled={exporting}>
            {exporting ? 'Exporting…' : 'Export PDF'}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-steel-deep print:hidden">
        {(['logs', 'checklists', 'documents'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-sm font-medium capitalize ${
              tab === t ? 'border-b-2 border-flame text-ink' : 'text-ink-soft'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'logs' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-ink-soft">
                <th className="py-1 pr-2">Time</th>
                <th className="py-1 pr-2">Equipment</th>
                <th className="py-1 pr-2">°F</th>
                <th className="py-1 pr-2">Status</th>
                <th className="py-1 pr-2">Corrective action</th>
              </tr>
            </thead>
            <tbody>
              {report.logs.map((log) => (
                <tr key={log.id} className="border-t border-steel-deep">
                  <td className="py-1 pr-2 whitespace-nowrap">
                    {new Date(log.recordedAt).toLocaleString()}
                    {log.loggedOfflineSyncedLater && (
                      <span className="ml-1 text-xs text-ink-soft">(logged offline, synced later)</span>
                    )}
                  </td>
                  <td className="py-1 pr-2">{log.equipmentName}</td>
                  <td className="py-1 pr-2">{log.temperature}</td>
                  <td className={`py-1 pr-2 ${log.isOutOfThreshold ? 'text-flame-deep' : 'text-pass'}`}>
                    {log.isOutOfThreshold ? '⚠ Out of range' : '✓ In range'}
                  </td>
                  <td className="py-1 pr-2">
                    {log.correctiveAction
                      ? `${log.correctiveAction.actionType.replace(/_/g, ' ')}${log.correctiveAction.note ? ` — ${log.correctiveAction.note}` : ''}`
                      : ''}
                  </td>
                </tr>
              ))}
              {report.logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-2 text-ink-soft">
                    No logs in this range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'checklists' && (
        <div className="flex flex-col gap-2">
          {report.checklistRuns.map((run) => (
            <div key={run.id} className="rounded-lg border border-steel-deep p-3 text-sm">
              <p className="font-medium text-ink">{new Date(run.recordedAt).toLocaleString()}</p>
              <ul className="mt-1 list-inside list-disc text-ink-soft">
                {run.items.map((item, i) => (
                  <li key={i}>
                    {item.checked ? '✓' : '☐'} {item.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {report.checklistRuns.length === 0 && (
            <p className="text-sm text-ink-soft">No checklist runs in this range.</p>
          )}
        </div>
      )}

      {tab === 'documents' && (
        <div className="flex flex-col gap-2">
          {report.documents.map((doc) => {
            const status = documentStatus(doc.expiresAt, new Date());
            if (status === 'expired') return null;
            return (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-steel-deep p-3 text-sm"
              >
                <span className="text-ink">{KIND_LABELS[doc.kind] ?? doc.kind}</span>
                <span className="text-ink-soft">
                  {doc.expiresAt ? `Expires ${new Date(doc.expiresAt).toLocaleDateString()}` : 'No expiry'}
                </span>
              </div>
            );
          })}
          {report.documents.filter((d) => documentStatus(d.expiresAt, new Date()) !== 'expired')
            .length === 0 && <p className="text-sm text-ink-soft">No current documents.</p>}
        </div>
      )}

      <p className="mt-4 border-t border-steel-deep pt-3 text-xs text-ink-soft">
        {INSPECTOR_DISCLAIMER}
      </p>
    </div>
  );
}
