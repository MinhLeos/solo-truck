'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/form-message';
import { setPassword, type AccountFormState } from './actions';

const initialState: AccountFormState = { status: 'idle' };

export function SetPasswordForm() {
  const [state, formAction, pending] = useActionState(setPassword, initialState);

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-3">
      <Input
        label="New password"
        type="password"
        name="newPassword"
        required
        minLength={8}
        placeholder="At least 8 characters"
        autoComplete="new-password"
      />
      {state.status !== 'idle' && (
        <FormMessage status={state.status === 'success' ? 'success' : 'error'}>
          {state.message}
        </FormMessage>
      )}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? 'Saving…' : 'Set password'}
      </Button>
    </form>
  );
}
