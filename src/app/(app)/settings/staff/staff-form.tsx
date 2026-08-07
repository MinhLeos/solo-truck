'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/form-message';
import { addStaff, type StaffFormState } from './actions';

const initialState: StaffFormState = { status: 'idle' };

export function StaffForm() {
  const [state, formAction, pending] = useActionState(addStaff, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input name="name" placeholder="Staff name" required className="flex-1" />
        <Input
          name="pin"
          placeholder="4-digit PIN"
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          required
          className="w-28"
        />
      </div>
      {state.status === 'error' && <FormMessage status="error">{state.message}</FormMessage>}
      <Button type="submit" disabled={pending}>
        {pending ? 'Adding…' : 'Add staff'}
      </Button>
    </form>
  );
}
