import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Wizard } from './wizard';
import styles from './setup.module.css';

export default async function SetupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: truck } = await supabase.from('trucks').select('id').limit(1).maybeSingle();

  if (truck) redirect('/today');

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link className={styles.logo} href="/">Solo Truck</Link>
        </header>

        <section className={styles.intro}>
          <h1>Set up your truck</h1>
          <p>Takes about 5 minutes — you can change everything later.</p>
        </section>

        <Wizard />
      </div>
    </main>
  );
}
