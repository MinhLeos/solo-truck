// Accepts anything with a Headers-like `.get()` — a Request's `.headers` in
// a route handler, or the `headers()` helper's ReadonlyHeaders in a Server
// Component (Inspector Mode's public /i/[token] page needs the latter).
export function getClientIp(headers: { get(name: string): string | null }): string {
  const forwarded = headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}
