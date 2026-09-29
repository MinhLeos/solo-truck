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
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-[7px] text-xs font-extrabold text-[#53645b]">
        Type
        <select
          name="kind"
          required
          className="w-full rounded-[10px] border border-[#cad7cf] bg-[#fbfcfb] px-[13px] py-3 text-sm font-normal text-[#18231f]"
        >
          {DOCUMENT_KINDS.map((kind) => (
            <option key={kind.value} value={kind.value}>
              {kind.label}
            </option>
          ))}
        </select>
      </label>
      <Input type="date" name="expiresAt" label="Expires (optional)" />
      <label className="flex flex-col gap-[7px] text-xs font-extrabold text-[#53645b]">
        File (photo or PDF)
        <input
          type="file"
          name="file"
          accept="image/*,application/pdf"
          required
          className="rounded-[10px] border border-dashed border-[#cad7cf] bg-[#fbfcfb] p-3 text-sm font-normal text-[#6b7972]"
        />
      </label>
      {state.status === 'error' && <FormMessage status="error">{state.message}</FormMessage>}
      <Button type="submit" disabled={pending}>
        {pending ? 'Uploading…' : 'Upload document'}
      </Button>
    </form>
  );
}
