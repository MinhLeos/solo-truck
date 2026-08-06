import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// service_role bypasses RLS entirely — only ever call this from webhook
// handlers and public read-only routes (e.g. /i/[token] in Phase 3), never
// scattered ad hoc queries. The `server-only` import makes any accidental
// import from a 'use client' file a build error, not just a lint warning.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
