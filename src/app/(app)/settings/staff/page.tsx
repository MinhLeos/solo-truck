import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StaffForm } from './staff-form';
import { removeStaff } from './actions';

export default async function StaffSettingsPage() {
  const supabase = await createClient();
  const { data: staff } = await supabase
    .from('staff')
    .select('id, name, pin')
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-ink">Staff</h1>
        <p className="text-sm text-ink-soft">
          PINs are for attribution only — not a login or security mechanism.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {(staff ?? []).map((member) => (
          <Card key={member.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-ink">{member.name}</p>
              <p className="text-xs text-ink-soft">PIN {member.pin}</p>
            </div>
            <form action={removeStaff.bind(null, member.id)}>
              <Button type="submit" variant="ghost">
                Remove
              </Button>
            </form>
          </Card>
        ))}
        {(staff ?? []).length === 0 && (
          <p className="text-sm text-ink-soft">No staff added yet — logs won&apos;t ask for a PIN.</p>
        )}
      </div>

      <StaffForm />
    </div>
  );
}
