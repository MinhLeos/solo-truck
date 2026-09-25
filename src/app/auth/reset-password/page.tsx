import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ResetPasswordForm } from './reset-password-form';

export const metadata: Metadata = {
  title: 'Set a new password — Solo Truck',
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No active (recovery) session means the link was already used, expired,
  // or someone landed here directly — send them to request a fresh one.
  if (!user) redirect('/auth/forgot-password');

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-steel px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Choose a new password
        </h1>
        <p className="mt-2 text-ink-soft">For {user.email}</p>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
