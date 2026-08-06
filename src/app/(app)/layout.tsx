import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InstallPrompt } from '../install-prompt';
import { SyncStatus } from '../sync-status';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: truck } = await supabase.from('trucks').select('id, name').maybeSingle();

  if (!truck) redirect('/setup');

  return (
    <div className="flex min-h-dvh flex-col bg-steel">
      <InstallPrompt />
      <header className="flex items-center justify-between border-b border-steel-deep bg-card px-4 py-3">
        <span className="font-semibold text-ink">{truck.name}</span>
      </header>
      <SyncStatus />
      <main className="flex flex-1 flex-col px-4 py-4">{children}</main>
    </div>
  );
}
