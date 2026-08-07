import { createClient } from '@/lib/supabase/server';
import { documentStatus, type DocumentStatus } from '@/lib/documents/status';
import { DOCUMENT_KINDS } from '@/lib/documents/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DocumentForm } from './document-form';
import { removeDocument } from './actions';

const STATUS_LABEL: Record<DocumentStatus, string> = {
  valid: 'Valid',
  expiring_soon: 'Expiring soon',
  expired: 'Expired',
  no_expiry: 'No expiry',
};

const STATUS_CLASSES: Record<DocumentStatus, string> = {
  valid: 'bg-pass-bg text-pass-deep',
  expiring_soon: 'bg-warn-bg text-flame-deep',
  expired: 'bg-warn-bg text-flame-deep',
  no_expiry: 'bg-steel text-ink-soft',
};

function kindLabel(kind: string): string {
  return DOCUMENT_KINDS.find((k) => k.value === kind)?.label ?? kind;
}

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from('documents')
    .select('id, kind, file_path, expires_at, created_at')
    .is('deleted_at', null)
    .order('expires_at', { ascending: true, nullsFirst: false });

  const now = new Date();
  const rows = await Promise.all(
    (documents ?? []).map(async (doc) => {
      const { data: signed } = await supabase.storage
        .from('documents')
        .createSignedUrl(doc.file_path, 60);
      return {
        ...doc,
        status: documentStatus(doc.expires_at, now),
        signedUrl: signed?.signedUrl ?? null,
      };
    }),
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-ink">Documents</h1>
        <p className="text-sm text-ink-soft">
          Permit, commissary agreement, certs — kept private, viewable by inspectors in Inspector
          Mode.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((doc) => (
          <Card key={doc.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-ink">{kindLabel(doc.kind)}</p>
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[doc.status]}`}
              >
                {STATUS_LABEL[doc.status]}
                {doc.expires_at ? ` · ${new Date(doc.expires_at).toLocaleDateString()}` : ''}
              </span>
            </div>
            <div className="flex shrink-0 gap-2">
              {doc.signedUrl && (
                <a
                  href={doc.signedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-steel-deep px-3 py-2 text-sm font-medium text-ink hover:bg-steel"
                >
                  View
                </a>
              )}
              <form action={removeDocument.bind(null, doc.id)}>
                <Button type="submit" variant="ghost">
                  Remove
                </Button>
              </form>
            </div>
          </Card>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-ink-soft">No documents yet.</p>
        )}
      </div>

      <DocumentForm />
    </div>
  );
}
