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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="page-intro !mb-0">
          <h1>{truckName}</h1>
          <p>
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

      <div className="app-tabs print:hidden" role="tablist">
        {(['logs', 'checklists', 'documents'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? 'active' : ''}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'logs' && (
        <div className="overflow-x-auto">
          <table className="app-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Equipment</th>
                <th>°F</th>
                <th>Status</th>
                <th>Corrective action</th>
              </tr>
            </thead>
            <tbody>
              {report.logs.map((log) => (
                <tr key={log.id}>
                  <td className="whitespace-nowrap">
                    {new Date(log.recordedAt).toLocaleString()}
                    {log.loggedOfflineSyncedLater && (
                      <span className="ml-1 text-xs text-[#6b7972]">(logged offline, synced later)</span>
                    )}
                  </td>
                  <td>{log.equipmentName}</td>
                  <td>{log.temperature}</td>
                  <td>
                    <span className={`status-pill whitespace-nowrap ${log.isOutOfThreshold ? 'bad' : 'good'}`}>
                      {log.isOutOfThreshold ? '⚠ Out of range' : '✓ In range'}
                    </span>
                  </td>
                  <td>
                    {log.correctiveAction
                      ? `${log.correctiveAction.actionType.replace(/_/g, ' ')}${log.correctiveAction.note ? ` — ${log.correctiveAction.note}` : ''}`
                      : ''}
                  </td>
                </tr>
              ))}
              {report.logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-[#6b7972]">
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
            <div key={run.id} className="rounded-[14px] border border-[#dce4de] bg-white p-4 text-sm">
              <p className="font-bold">{new Date(run.recordedAt).toLocaleString()}</p>
              <ul className="mt-2 flex flex-col gap-1 text-[#557164]">
                {run.items.map((item, i) => (
                  <li key={i}>
                    {item.checked ? '✓' : '☐'} {item.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {report.checklistRuns.length === 0 && (
            <p className="text-sm text-[#6b7972]">No checklist runs in this range.</p>
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
                className="flex items-center justify-between gap-3 rounded-[14px] border border-[#dce4de] bg-white p-4 text-sm"
              >
                <span className="font-bold">{KIND_LABELS[doc.kind] ?? doc.kind}</span>
                <span className="status-pill neutral">
                  {doc.expiresAt ? `Expires ${new Date(doc.expiresAt).toLocaleDateString()}` : 'No expiry'}
                </span>
              </div>
            );
          })}
          {report.documents.filter((d) => documentStatus(d.expiresAt, new Date()) !== 'expired')
            .length === 0 && <p className="text-sm text-[#6b7972]">No current documents.</p>}
        </div>
      )}

      <p className="app-footer mt-4 border-t border-[#dce4de] pt-4">
        {INSPECTOR_DISCLAIMER}
      </p>
    </div>
  );
}
