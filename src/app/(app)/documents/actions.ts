'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { DOCUMENT_KINDS } from '@/lib/documents/types';

const KIND_VALUES = DOCUMENT_KINDS.map((k) => k.value) as [string, ...string[]];

const uploadDocumentSchema = z.object({
  kind: z.enum(KIND_VALUES),
  expiresAt: z
    .string()
    .optional()
    .transform((value) => (value ? new Date(value).toISOString() : null)),
});

export type DocumentFormState = { status: 'idle' | 'error'; message?: string };

export async function uploadDocument(
  _prevState: DocumentFormState,
  formData: FormData,
): Promise<DocumentFormState> {
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { status: 'error', message: 'Choose a file to upload.' };
  }

  const parsed = uploadDocumentSchema.safeParse({
    kind: formData.get('kind'),
    expiresAt: formData.get('expiresAt') || undefined,
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = await createClient();
  const { data: truck } = await supabase.from('trucks').select('business_id').maybeSingle();
  if (!truck) return { status: 'error', message: 'No truck found for this account.' };

  const extension = file.name.match(/\.\w+$/)?.[0] ?? '';
  const path = `${truck.business_id}/documents/${crypto.randomUUID()}${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(path, file, { contentType: file.type || 'application/octet-stream' });
  if (uploadError) {
    console.error('[uploadDocument] storage', uploadError.message);
    return { status: 'error', message: 'Could not upload the file.' };
  }

  const { error: insertError } = await supabase.from('documents').insert({
    business_id: truck.business_id,
    kind: parsed.data.kind,
    file_path: path,
    expires_at: parsed.data.expiresAt,
  });
  if (insertError) {
    console.error('[uploadDocument] insert', insertError.code, insertError.message);
    return { status: 'error', message: 'Could not save the document.' };
  }

  revalidatePath('/documents');
  return { status: 'idle' };
}

export async function removeDocument(documentId: string): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from('documents')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', documentId);
  revalidatePath('/documents');
}
