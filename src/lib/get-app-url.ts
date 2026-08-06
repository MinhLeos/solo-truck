// NEXT_PUBLIC_APP_URL is only set explicitly for Production (a stable
// domain). Preview deployments get a different URL every build, so this
// falls back to Vercel's auto-populated NEXT_PUBLIC_VERCEL_URL instead of
// requiring a manually-maintained env var per branch.
export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}
