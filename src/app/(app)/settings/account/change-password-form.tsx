'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/form-message';
import { changePassword, type AccountFormState } from './actions';

const initialState: AccountFormState = { status: 'idle' };

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(
    changePassword,
    initialState,
  );

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-3">
      <Input
        label="Current password"
        type="password"
        name="currentPassword"
        required
        autoComplete="current-password"
      />
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
        {pending ? 'Updating…' : 'Change password'}
      </Button>
    </form>
  );
}
