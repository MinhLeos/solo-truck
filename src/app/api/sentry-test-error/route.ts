export async function GET() {
  throw new Error('Sentry test error — safe to ignore, confirms error reporting is wired up');
}
