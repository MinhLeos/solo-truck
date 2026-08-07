-- Fix: service_role had NO table-level grants on any app table in this
-- project's local dev stack (confirmed via a real admin-client query
-- returning `42501 permission denied for table trucks`, hint: "GRANT SELECT
-- ON public.trucks TO service_role"). `BYPASSRLS` (service_role's role
-- attribute) only skips row-level security policies — it does NOT imply
-- table-level SELECT/INSERT/UPDATE/DELETE, which are separate, ordinary
-- Postgres grants. The cloud project happens to have these grants already
-- (platform-provisioned), which is why this was invisible until Phase 3.2's
-- /i/[token] route and cron additions were smoke-tested against the local
-- stack — but relying on an implicit, unverified cloud default for a
-- security-relevant role is exactly the kind of thing this project's own
-- convention of explicit per-table grants (see core_schema.sql) exists to
-- avoid. createAdminClient() (src/lib/supabase/admin.ts) is the only thing
-- that ever runs as service_role — used by the reminders cron (Phase 2.4 +
-- 3.1 + 3.3) and the public /i/[token] route (Phase 3.2).
grant select on businesses, trucks, shifts, documents, equipment to service_role;
grant select, insert on notifications_log to service_role;
grant select, insert, delete on rate_limit_hits to service_role;
grant select, update on inspector_links to service_role;

-- Append-only tables: SELECT only, matching the same restriction already
-- enforced on `authenticated` (see the Phase 2 append-only migrations) —
-- service_role reads these for Inspector Mode and the streak calculation,
-- it never needs to write them. The BEFORE UPDATE OR DELETE trigger fires
-- regardless of role and would block a write either way, but the grant
-- itself shouldn't imply a write is expected.
grant select on logs, corrective_actions, checklist_runs to service_role;
