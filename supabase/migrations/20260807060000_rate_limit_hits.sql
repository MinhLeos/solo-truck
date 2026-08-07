-- Phase 3.2: IP rate limiting for the public /i/[token] inspector-link route
-- (SECURITY.md §9: "route public (/i/): rate limit IP"). DB-table based, not
-- Redis/Upstash — traffic on this route is inherently tiny (one owner
-- sharing a link with one inspector), so a table scan per request is fine.
create table rate_limit_hits (
  id uuid primary key default gen_random_uuid(),
  route text not null,
  ip text not null,
  created_at timestamptz not null default now()
);

create index rate_limit_hits_route_ip_created_at_idx
  on rate_limit_hits (route, ip, created_at desc);

alter table rate_limit_hits enable row level security;
-- Written only by the admin client from server-side route handlers — no
-- authenticated-role policy needed or wanted here (it isn't business data).
-- Cleanup of old hits piggybacks on the existing Vercel-scheduled
-- /api/cron/reminders route (already runs every 15 min) instead of adding
-- a pg_cron dependency for one housekeeping delete.
