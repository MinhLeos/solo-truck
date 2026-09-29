import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { ChangePasswordForm } from './change-password-form';
import { SetPasswordForm } from './set-password-form';

export default async function AccountSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hasPassword = user?.identities?.some((identity) => identity.provider === 'email') ?? false;
  const providers = user?.identities?.map((identity) => identity.provider) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="page-intro">
        <h1>Account</h1>
        <p>
          Signed in as {user?.email}
          {providers.length > 0 && ` · via ${providers.join(', ')}`}
        </p>
      </div>

      <Card>
        {hasPassword ? (
          <>
            <h3 className="mb-4 text-base font-bold">Change password</h3>
            <ChangePasswordForm />
          </>
        ) : (
          <>
            <h3 className="mb-1 text-base font-bold">Set a password</h3>
            <p className="mb-4 text-sm text-[#6b7972]">
              You currently sign in with Google only. Add a password to also be able to
              sign in with email.
            </p>
            <SetPasswordForm />
          </>
        )}
      </Card>
    </div>
  );
}
