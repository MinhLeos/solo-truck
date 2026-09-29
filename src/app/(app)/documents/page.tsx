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
  valid: 'good',
  expiring_soon: 'warn',
  expired: 'bad',
  no_expiry: 'neutral',
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
      <div className="page-intro">
        <h1>Documents</h1>
        <p>
          Permit, commissary agreement, certs — kept private, viewable by inspectors in Inspector
          Mode.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((doc) => (
          <Card key={doc.id} className="data-row stack-mobile">
            <div className="min-w-0">
              <h3 className="truncate">{kindLabel(doc.kind)}</h3>
              <span
                className={`status-pill ${STATUS_CLASSES[doc.status]}`}
              >
                {STATUS_LABEL[doc.status]}
                {doc.expires_at ? ` · ${new Date(doc.expires_at).toLocaleDateString()}` : ''}
              </span>
            </div>
            <div className="row-actions shrink-0">
              {doc.signedUrl && (
                <a
                  href={doc.signedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-[10px] bg-[#e9efeb] px-4 py-3 text-[.82rem] font-extrabold text-[#31503f] hover:bg-[#dde7e1]"
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
          <p className="text-sm text-[#6b7972]">No documents yet.</p>
        )}
      </div>

      <Card className="mt-2">
        <DocumentForm />
      </Card>
    </div>
  );
}
