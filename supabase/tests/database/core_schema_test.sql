begin;
create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;

-- Test-only grants so we can run pgTAP assertions while impersonating
-- anon/authenticated (never applied outside this rolled-back transaction).
grant usage on schema extensions to anon, authenticated;
grant execute on all functions in schema extensions to anon, authenticated;

select plan(5);

insert into auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data
) values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'authenticated', 'authenticated', 'a@example.com',
   'not-a-real-hash', now(), now(), now(), '{}', '{}'),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222',
   'authenticated', 'authenticated', 'b@example.com',
   'not-a-real-hash', now(), now(), now(), '{}', '{}');

-- Arrange: user A onboards Truck A, user B onboards Truck B, each via the
-- bootstrap RPC (mirrors how the app actually calls it, not a raw insert).
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
set local role authenticated;
select complete_onboarding(
  'Truck A', 'Austin', 'TX', 'America/Chicago', 'truck',
  '[{"name":"Fridge","equipment_type":"cold_holding","threshold_min":null,"threshold_max":41}]'::jsonb,
  '[]'::jsonb
);

reset role;
set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
set local role authenticated;
select complete_onboarding(
  'Truck B', 'Dallas', 'TX', 'America/Chicago', 'trailer',
  '[{"name":"Freezer","equipment_type":"freezer","threshold_min":null,"threshold_max":0}]'::jsonb,
  '[]'::jsonb
);

-- Act & assert as user A
reset role;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
set local role authenticated;

select results_eq(
  $$ select name from trucks order by name $$,
  ARRAY['Truck A'],
  'user A only sees their own truck, not truck B'
);

select results_eq(
  $$ select count(*)::int from equipment $$,
  ARRAY[1],
  'user A only sees their own equipment, seeded by onboarding'
);

select is_empty(
  $$ update trucks set name = 'hacked' where name = 'Truck B' returning 1 $$,
  'user A cannot update truck B'
);

-- Act & assert as anonymous. anon has no table grant at all here (these
-- tables have no anon use case), so the query is rejected outright rather
-- than merely filtered by RLS to zero rows — a stronger boundary.
reset role;
set local request.jwt.claims = '{}';
set local role anon;

select throws_ok(
  $$ select 1 from businesses $$,
  '42501'
);

select throws_ok(
  $$ select 1 from trucks $$,
  '42501'
);

select * from finish();
rollback;
