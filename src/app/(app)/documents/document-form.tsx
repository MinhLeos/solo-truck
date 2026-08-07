'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/form-message';
import { DOCUMENT_KINDS } from '@/lib/documents/types';
import { uploadDocument, type DocumentFormState } from './actions';

const initialState: DocumentFormState = { status: 'idle' };

export function DocumentForm() {
  const [state, formAction, pending] = useActionState(uploadDocument, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-ink">
        Type
        <select
          name="kind"
          required
          className="w-full rounded-md border border-steel-deep bg-card px-3 py-2 text-sm text-ink"
        >
          {DOCUMENT_KINDS.map((kind) => (
            <option key={kind.value} value={kind.value}>
              {kind.label}
            </option>
          ))}
        </select>
      </label>
      <Input type="date" name="expiresAt" label="Expires (optional)" />
      <label className="flex flex-col gap-1 text-sm text-ink">
        File (photo or PDF)
        <input
          type="file"
          name="file"
          accept="image/*,application/pdf"
          required
          className="text-sm text-ink-soft"
        />
      </label>
      {state.status === 'error' && <FormMessage status="error">{state.message}</FormMessage>}
      <Button type="submit" disabled={pending}>
        {pending ? 'Uploading…' : 'Upload document'}
      </Button>
    </form>
  );
}
