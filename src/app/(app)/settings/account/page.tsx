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
      <div>
        <h1 className="text-lg font-semibold text-ink">Account</h1>
        <p className="text-sm text-ink-soft">
          Signed in as {user?.email}
          {providers.length > 0 && ` · via ${providers.join(', ')}`}
        </p>
      </div>

      <Card>
        {hasPassword ? (
          <>
            <p className="mb-3 font-medium text-ink">Change password</p>
            <ChangePasswordForm />
          </>
        ) : (
          <>
            <p className="mb-1 font-medium text-ink">Set a password</p>
            <p className="mb-3 text-sm text-ink-soft">
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
