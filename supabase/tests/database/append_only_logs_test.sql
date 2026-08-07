begin;
create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;

grant usage on schema extensions to anon, authenticated;
grant execute on all functions in schema extensions to anon, authenticated;

select plan(4);

insert into auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data
) values
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333',
   'authenticated', 'authenticated', 'c@example.com',
   'not-a-real-hash', now(), now(), now(), '{}', '{}'),
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444',
   'authenticated', 'authenticated', 'd@example.com',
   'not-a-real-hash', now(), now(), now(), '{}', '{}');

-- Arrange: user C onboards Truck C, user D onboards Truck D.
set local request.jwt.claims = '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}';
set local role authenticated;
select complete_onboarding(
  'Truck C', 'Houston', 'TX', 'America/Chicago', 'truck',
  '[{"name":"Fridge","equipment_type":"cold_holding","threshold_min":null,"threshold_max":41}]'::jsonb,
  '[]'::jsonb
);

reset role;
set local request.jwt.claims = '{"sub":"44444444-4444-4444-4444-444444444444","role":"authenticated"}';
set local role authenticated;
select complete_onboarding(
  'Truck D', 'San Antonio', 'TX', 'America/Chicago', 'cart',
  '[{"name":"Freezer","equipment_type":"freezer","threshold_min":null,"threshold_max":0}]'::jsonb,
  '[]'::jsonb
);

-- Act as user C: insert a log directly (mirrors what /api/sync/log does).
reset role;
set local request.jwt.claims = '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}';
set local role authenticated;

insert into logs (business_id, truck_id, equipment_id, client_id, temperature, recorded_at)
select t.business_id, t.id, e.id, gen_random_uuid(), 38, now()
from trucks t join equipment e on e.truck_id = t.id
where t.name = 'Truck C';

-- Test 1: direct UPDATE must fail (grant revoked, layer 1).
select throws_ok(
  $$ update logs set temperature = 999 where temperature = 38 $$,
  '42501',
  null,
  'UPDATE on logs is rejected (append-only grant revoked)'
);

-- Test 2: direct DELETE must fail.
select throws_ok(
  $$ delete from logs where temperature = 38 $$,
  '42501',
  null,
  'DELETE on logs is rejected (append-only grant revoked)'
);

-- Test 3: supersede flow inserts a new row and keeps the old one.
with old_log as (select id from logs where temperature = 38 limit 1)
insert into logs (
  business_id, truck_id, equipment_id, client_id, temperature, recorded_at,
  supersedes_log_id, supersede_reason
)
select t.business_id, t.id, e.id, gen_random_uuid(), 40, now(), old_log.id, 'typo, meant 40'
from trucks t
join equipment e on e.truck_id = t.id
cross join old_log
where t.name = 'Truck C';

select results_eq(
  $$ select temperature::int from logs where business_id = (select business_id from trucks where name = 'Truck C') order by temperature $$,
  ARRAY[38, 40],
  'supersede keeps the old log and adds a new one, both readable'
);

-- Test 4: RLS still holds after the grant/policy change — user C cannot
-- see Truck D's logs.
reset role;
set local request.jwt.claims = '{"sub":"44444444-4444-4444-4444-444444444444","role":"authenticated"}';
set local role authenticated;
insert into logs (business_id, truck_id, equipment_id, client_id, temperature, recorded_at)
select t.business_id, t.id, e.id, gen_random_uuid(), -5, now()
from trucks t join equipment e on e.truck_id = t.id
where t.name = 'Truck D';

reset role;
set local request.jwt.claims = '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}';
set local role authenticated;

select is_empty(
  $$ select 1 from logs where temperature = -5 $$,
  'user C cannot see Truck D''s logs'
);

select * from finish();
rollback;
