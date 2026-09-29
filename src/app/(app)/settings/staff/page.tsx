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
      <div className="page-intro">
        <h1>Staff</h1>
        <p className="!rounded-[10px] !bg-[#fff0c9] !px-3.5 !py-2.5 !text-sm !font-semibold !text-[#866c1c] inline-block">
          PINs are for attribution only — not a login or security mechanism.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {(staff ?? []).map((member) => (
          <Card key={member.id} className="data-row">
            <div>
              <h3>{member.name}</h3>
              <p className="font-mono">PIN {member.pin}</p>
            </div>
            <form action={removeStaff.bind(null, member.id)}>
              <Button type="submit" variant="ghost">
                Remove
              </Button>
            </form>
          </Card>
        ))}
        {(staff ?? []).length === 0 && (
          <p className="text-sm text-[#6b7972]">No staff added yet — logs won&apos;t ask for a PIN.</p>
        )}
      </div>

      <Card className="mt-2">
        <StaffForm />
      </Card>
    </div>
  );
}
