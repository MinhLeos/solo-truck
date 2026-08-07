-- Phase 2.1: staff table (PIN attribution, SECURITY.md §7) + append-only
-- lockdown for `logs` (SECURITY.md §2). This is the first migration of
-- Phase 2, exactly where SECURITY.md §2 said the lockdown belongs.

create table staff (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  name text not null,
  -- Plain, not hashed: SECURITY.md §7 is explicit that this PIN is
  -- attribution only, not a security mechanism — the owner needs to see
  -- and manage PINs in settings, and hashing a 4-digit space (10,000
  -- possibilities) would be theater, not real protection.
  pin text not null check (pin ~ '^[0-9]{4}$'),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table staff enable row level security;
grant select, insert, update, delete on staff to authenticated;

create policy "owner can access their staff"
on staff for all
using (is_business_owner(business_id))
with check (is_business_owner(business_id));

-- Shared defensive trigger for every append-only table (logs here;
-- corrective_actions and checklist_runs reuse this same function in their
-- own Phase 2.2/2.3 migrations). This is defense in depth on top of the
-- REVOKE below — it only fires if a role somehow still has UPDATE/DELETE
-- privilege (e.g. a future accidental re-grant).
create function prevent_update_delete()
returns trigger
language plpgsql
as $$
begin
  raise exception 'this table is append-only: % is not allowed', tg_op;
end;
$$;

-- Layer 1: DB grants. The `authenticated` role can no longer even attempt
-- an UPDATE/DELETE on logs — this is the primary enforcement; the trigger
-- below is a backstop, not the main defense.
revoke update, delete on logs from authenticated;

-- Layer 2: defensive trigger (SECURITY.md §2 point 2).
create trigger logs_prevent_update_delete
before update or delete on logs
for each row execute function prevent_update_delete();

-- Layer 3 was already true from Phase 1: no server action/route accepts a
-- log id to "edit" — src/app/api/sync/[entity]/route.ts only ever INSERTs.
-- Correction is the supersede flow: a new row with supersedes_log_id +
-- supersede_reason (already columns on `logs` since Phase 1).

-- Replace the old `for all` policy — now that UPDATE/DELETE can never
-- succeed at the grant layer, keeping a policy that names those commands
-- is misleading, not just redundant.
drop policy "owner can access their logs" on logs;

create policy "owner can read their logs"
on logs for select
using (is_business_owner(business_id));

create policy "owner can insert their logs"
on logs for insert
with check (is_business_owner(business_id));
