begin;
create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;

grant usage on schema extensions to anon, authenticated;
grant execute on all functions in schema extensions to anon, authenticated;

select plan(10);

insert into auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data
) values
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444',
   'authenticated', 'authenticated', 'd@example.com',
   'not-a-real-hash', now(), now(), now(), '{}', '{}');

set local request.jwt.claims = '{"sub":"44444444-4444-4444-4444-444444444444","role":"authenticated"}';
set local role authenticated;
select complete_onboarding(
  'Truck D', 'Houston', 'TX', 'America/Chicago', 'truck',
  '[{"name":"Fridge","equipment_type":"cold_holding","threshold_min":null,"threshold_max":41}]'::jsonb,
  '[]'::jsonb
);

-- complete_onboarding() opens exactly one trialing subscription — no code
-- path (including the RPC itself) should be able to skip it.
select is(
  (select count(*)::int from subscriptions
    where business_id = (select id from businesses where owner_id = '44444444-4444-4444-4444-444444444444')
      and status = 'trialing' and trial_ends_at is not null),
  1,
  'complete_onboarding() creates exactly one trialing subscription row'
);

-- subscriptions: owner can read their own row, but all writes go through
-- service_role (the webhook handler) — same zero-grant-for-writes shape as
-- the append-only tables.
select lives_ok(
  $$ select 1 from subscriptions
    where business_id = (select id from businesses where owner_id = '44444444-4444-4444-4444-444444444444') $$,
  'owner can read their subscription row'
);
select throws_ok(
  $$ insert into subscriptions (business_id, trial_ends_at) values
    ((select id from businesses where owner_id = '44444444-4444-4444-4444-444444444444'), now()) $$,
  '42501'
);
select throws_ok(
  $$ update subscriptions set status = 'active'
    where business_id = (select id from businesses where owner_id = '44444444-4444-4444-4444-444444444444') $$,
  '42501'
);

-- billing_webhook_events: purely internal idempotency ledger, zero grants
-- for authenticated too.
select throws_ok($$ select 1 from billing_webhook_events $$, '42501');
select throws_ok(
  $$ insert into billing_webhook_events (event_id, type) values ('evt_test', 'subscription.active') $$,
  '42501'
);

reset role;
set local request.jwt.claims = '{}';
set local role anon;

select throws_ok($$ select 1 from subscriptions $$, '42501');
select throws_ok($$ select 1 from billing_webhook_events $$, '42501');

reset role;
set local role service_role;

select lives_ok(
  $$ update subscriptions set status = 'active', provider_subscription_id = 'sub_test'
    where business_id = (select id from businesses where owner_id = '44444444-4444-4444-4444-444444444444') $$,
  'service_role can update subscriptions'
);
select lives_ok(
  $$ insert into billing_webhook_events (event_id, type) values ('evt_test', 'subscription.active') $$,
  'service_role can insert into billing_webhook_events'
);

reset role;

select * from finish();
rollback;
