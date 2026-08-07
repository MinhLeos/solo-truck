import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

const WINDOW_MS = 60 * 60 * 1000;

// DB-table based (see rate_limit_hits migration) — records the attempt
// regardless of outcome so retries can't reset the window, then reports
// whether this IP is still under the cap for this route.
export async function checkRateLimit(
  route: string,
  ip: string,
  maxAttempts: number,
): Promise<boolean> {
  const admin = createAdminClient();
  const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();

  const { count } = await admin
    .from('rate_limit_hits')
    .select('id', { count: 'exact', head: true })
    .eq('route', route)
    .eq('ip', ip)
    .gte('created_at', windowStart);

  await admin.from('rate_limit_hits').insert({ route, ip });

  return (count ?? 0) < maxAttempts;
}
