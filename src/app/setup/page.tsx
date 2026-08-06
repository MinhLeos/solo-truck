import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Wizard } from './wizard';

export default async function SetupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: truck } = await supabase.from('trucks').select('id').limit(1).maybeSingle();

  if (truck) redirect('/today');

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-steel px-6 py-10">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Set up your truck
        </h1>
        <p className="mt-2 text-ink-soft">Takes about 5 minutes — you can change everything later.</p>
        <Wizard />
      </div>
    </div>
  );
}
