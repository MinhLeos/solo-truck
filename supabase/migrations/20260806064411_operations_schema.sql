-- Operational tables: equipment, logs + corrective_actions, checklists +
-- checklist_runs, shifts, documents, inspector_links, streaks.
--
-- Every table here carries `business_id` directly (not just `truck_id`) so
-- RLS stays a single join-free `is_business_owner(business_id)` check
-- everywhere, matching the core_schema pattern. `truck_id` is also present
-- where a row conceptually belongs to one truck (joins, Phase 5 multi-truck)
-- — it's just not part of the RLS check itself.

create table equipment (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  truck_id uuid not null references trucks (id) on delete cascade,
  name text not null,
  equipment_type text not null check (equipment_type in ('cold_holding', 'hot_holding', 'freezer')),
  threshold_min numeric,
  threshold_max numeric,
  -- Flips to false the moment an owner edits a value, so the UI can still
  -- show an accurate "FDA default" badge (ARCHITECTURE.md §6.2).
  is_fda_default boolean not null default true,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ⚠ APPEND-ONLY TABLE — DO NOT add UPDATE/DELETE grants or policies here.
-- SECURITY.md §2 requires (Phase 2, first migration of that phase):
--   1. REVOKE update, delete on logs from authenticated;
--   2. a `before update or delete` trigger that RAISE EXCEPTION (defense in
--      depth against a future accidental re-grant);
--   3. no server action/route ever accepts a log id to "edit" — correction
--      is done via a new row with supersedes_log_id + supersede_reason.
-- Phase 1 intentionally leaves this table's grants at the same
-- select+insert+update+delete as every other table because the lockdown
-- migration+test belongs to Phase 2, not here. Do not "helpfully" add the
-- REVOKE early — it needs its own migration + pgTAP test together.
create table logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  truck_id uuid not null references trucks (id) on delete cascade,
  equipment_id uuid not null references equipment (id) on delete cascade,
  -- Offline idempotency key, generated on-device (SECURITY.md §4) — the
  -- sync endpoint upserts on this, never on `id`.
  client_id uuid not null unique,
  temperature numeric not null,
  is_out_of_threshold boolean not null default false,
  -- Device clock at write time, even offline (SECURITY.md §3).
  recorded_at timestamptz not null,
  synced_at timestamptz not null default now(),
  clock_skew boolean not null default false,
  logged_by text,
  supersedes_log_id uuid references logs (id),
  supersede_reason text check (supersede_reason is null or char_length(supersede_reason) >= 5),
  created_at timestamptz not null default now()
);

-- ⚠ APPEND-ONLY TABLE — see the identical note on `logs` above. CA rows are
-- hard-attached to a log via `log_id` and are just as append-only.
create table corrective_actions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  truck_id uuid not null references trucks (id) on delete cascade,
  log_id uuid not null references logs (id) on delete cascade,
  client_id uuid not null unique,
  action_type text not null,
  note text,
  photo_path text,
  recorded_at timestamptz not null,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Per-business checklist items, seeded from checklist_item_templates at
-- onboarding (see the seed_checklist_templates + onboarding_rpc migrations).
-- Owner can edit/hide items afterward — this is config, not a log, so it's
-- soft-deletable like `equipment`.
create table checklists (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  label text not null,
  sort_order int not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ⚠ APPEND-ONLY TABLE — one row per shift's completed checklist run. `items`
-- is a jsonb snapshot (not a mutable per-item child table) because the run
-- is really one atomic event — avoids needing append-only enforcement on a
-- second table for what's conceptually a single record. Phase 2 owns the
-- zod shape of the jsonb payload.
create table checklist_runs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  truck_id uuid not null references trucks (id) on delete cascade,
  client_id uuid not null unique,
  items jsonb not null default '[]',
  recorded_at timestamptz not null,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table shifts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  truck_id uuid not null references trucks (id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  kind text not null,
  file_path text not null,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table inspector_links (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  opened_at timestamptz,
  opened_ip inet,
  created_at timestamptz not null default now()
);

-- Materialized streak counter (ARCHITECTURE.md §5 leaves runtime-vs-materialized
-- open, decided at step 2.4) — reserved now, computed by Phase 2 logic, not
-- written by any client-facing route in Phase 1.
create table streaks (
  business_id uuid primary key references businesses (id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_logged_date date,
  updated_at timestamptz not null default now()
);

alter table equipment enable row level security;
alter table logs enable row level security;
alter table corrective_actions enable row level security;
alter table checklists enable row level security;
alter table checklist_runs enable row level security;
alter table shifts enable row level security;
alter table documents enable row level security;
alter table inspector_links enable row level security;
alter table streaks enable row level security;

grant select, insert, update, delete on equipment to authenticated;
grant select, insert, update, delete on logs to authenticated;
grant select, insert, update, delete on corrective_actions to authenticated;
grant select, insert, update, delete on checklists to authenticated;
grant select, insert, update, delete on checklist_runs to authenticated;
grant select, insert, update, delete on shifts to authenticated;
grant select, insert, update, delete on documents to authenticated;
grant select, insert, update, delete on inspector_links to authenticated;
-- streaks is system-computed (Phase 2.4 job), not client-writable at all.
grant select on streaks to authenticated;

create policy "owner can access their equipment"
on equipment for all
using (is_business_owner(business_id)) with check (is_business_owner(business_id));

create policy "owner can access their logs"
on logs for all
using (is_business_owner(business_id)) with check (is_business_owner(business_id));

create policy "owner can access their corrective actions"
on corrective_actions for all
using (is_business_owner(business_id)) with check (is_business_owner(business_id));

create policy "owner can access their checklists"
on checklists for all
using (is_business_owner(business_id)) with check (is_business_owner(business_id));

create policy "owner can access their checklist runs"
on checklist_runs for all
using (is_business_owner(business_id)) with check (is_business_owner(business_id));

create policy "owner can access their shifts"
on shifts for all
using (is_business_owner(business_id)) with check (is_business_owner(business_id));

create policy "owner can access their documents"
on documents for all
using (is_business_owner(business_id)) with check (is_business_owner(business_id));

create policy "owner can access their inspector links"
on inspector_links for all
using (is_business_owner(business_id)) with check (is_business_owner(business_id));

create policy "owner can read their streak"
on streaks for select
using (is_business_owner(business_id));
