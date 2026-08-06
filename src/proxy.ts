import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Serwist's route (serves the compiled service worker), its offline
    // fallback page, and the web app manifest must always be reachable
    // regardless of auth state, or an anonymous visit poisons the
    // precache with a redirect-to-login response.
    '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|serwist|~offline|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
