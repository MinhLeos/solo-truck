'use client';

import { useActionState } from 'react';
import { FormMessage } from '@/components/ui/form-message';
import styles from './reset-password.module.css';
import { updatePassword, type ResetPasswordState } from './actions';

const initialState: ResetPasswordState = { status: 'idle' };

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    updatePassword,
    initialState,
  );

  return (
    <form action={formAction} className={styles.form}>
      <label htmlFor="new-password">New password</label>
      <input
        id="new-password"
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
      <button className={styles.submitButton} type="submit" disabled={pending}>
        {pending ? 'Updating…' : 'Update password'}
        {!pending && <span aria-hidden="true">→</span>}
      </button>
    </form>
  );
}
