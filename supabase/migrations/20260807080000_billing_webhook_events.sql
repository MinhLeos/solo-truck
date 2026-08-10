-- Phase 4.1: idempotency ledger for MoR (Dodo) webhook delivery — event_id
-- is Dodo's own `webhook-id` header, never anything from the JSON body.
-- Same shape as Solo Sitter's billing_webhook_events: zero grants to
-- `authenticated`, service_role (the webhook route) is the only writer.
create table billing_webhook_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  type text not null,
  created_at timestamptz not null default now()
);

alter table billing_webhook_events enable row level security;

-- Backfill: businesses created before this migration (Phase 1-3 testing,
-- and complete_onboarding() not yet inserting a subscriptions row) would
-- otherwise have none — hasWriteAccess() treats "no row" as locked out,
-- which would lock out every existing business the instant this ships.
insert into subscriptions (business_id, trial_ends_at)
select id, now() + interval '14 days'
from businesses
where id not in (select business_id from subscriptions);

-- Now that the backfill + complete_onboarding() (below) both always set it,
-- tighten the column to match Solo Sitter's stricter schema — no code path
-- should ever leave a subscription without a trial end date.
alter table subscriptions alter column trial_ends_at set not null;

-- complete_onboarding() now also opens the 14-day trial — every business
-- gets exactly one subscriptions row from the moment it exists, no code
-- path that skips it (mirrors Solo Sitter's create_business()).
create or replace function complete_onboarding(
  p_truck_name text,
  p_city text,
  p_state text,
  p_timezone text,
  p_unit_type text,
  p_equipment jsonb,
  p_shifts jsonb
)
returns trucks
language plpgsql
security definer
set search_path = public
as $$
declare
  v_business businesses;
  v_truck trucks;
  v_item jsonb;
begin
  insert into businesses (owner_id) values (auth.uid()) returning * into v_business;

  insert into subscriptions (business_id, trial_ends_at)
  values (v_business.id, now() + interval '14 days');

  insert into trucks (business_id, name, city, state, timezone, unit_type)
  values (v_business.id, p_truck_name, p_city, p_state, p_timezone, p_unit_type)
  returning * into v_truck;

  for v_item in select * from jsonb_array_elements(p_equipment) loop
    insert into equipment (business_id, truck_id, name, equipment_type, threshold_min, threshold_max)
    values (
      v_business.id, v_truck.id,
      v_item ->> 'name', v_item ->> 'equipment_type',
      (v_item ->> 'threshold_min')::numeric, (v_item ->> 'threshold_max')::numeric
    );
  end loop;

  for v_item in select * from jsonb_array_elements(p_shifts) loop
    insert into shifts (business_id, truck_id, day_of_week, start_time, end_time)
    values (
      v_business.id, v_truck.id,
      (v_item ->> 'day_of_week')::smallint,
      (v_item ->> 'start_time')::time, (v_item ->> 'end_time')::time
    );
  end loop;

  insert into checklists (business_id, label, sort_order)
  select v_business.id, label, sort_order from checklist_item_templates;

  return v_truck;
end;
$$;

-- service_role (webhook handler) needs to write subscriptions and the
-- idempotency ledger — extends the Phase 3.2 service_role_grants migration
-- with the two billing tables it didn't yet know about.
grant select, update on subscriptions to service_role;
grant select, insert on billing_webhook_events to service_role;
