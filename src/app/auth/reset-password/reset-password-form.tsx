'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/form-message';
import { updatePassword, type ResetPasswordState } from './actions';

const initialState: ResetPasswordState = { status: 'idle' };

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    updatePassword,
    initialState,
  );

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-3">
      <Input
        label="New password"
        type="password"
        name="password"
        required
        minLength={8}
        placeholder="At least 8 characters"
        autoComplete="new-password"
      />
      {state.status === 'error' && (
        <FormMessage status="error">{state.message}</FormMessage>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? 'Updating…' : 'Update password'}
      </Button>
    </form>
  );
}
