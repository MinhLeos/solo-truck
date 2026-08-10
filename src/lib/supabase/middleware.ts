import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// /api/webhooks/* (billing, Phase 4) and /api/cron/* (Phase 2.4+) have no
// user session — they authenticate via webhook signature / CRON_SECRET
// bearer token instead (checked inside each route handler). /i/[token]
// (Inspector Mode read-only link, Phase 3) is deliberately public: an
// inspector never has an account. Without this exemption, Vercel's
// scheduled cron request — which carries no session cookie — gets redirected
// to /login before ever reaching the route handler's own auth check.
// /founding-trucks, /tools, /compare (Phase 4.2/4.3) are marketing pages —
// no login, no DB (see /tools's own 4 iron rules) — meant for anonymous
// visitors from search/community, never gated behind auth.
const PUBLIC_PATH_PREFIXES = [
  '/login',
  '/auth',
  '/i',
  '/api/webhooks',
  '/api/cron',
  '/serwist',
  '/~offline',
  '/founding-trucks',
  '/tools',
  '/compare',
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Middleware is a UX convenience layer only — the real gate is RLS, which
  // holds even if this check is ever bypassed or wrong.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublicPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return response;
}
