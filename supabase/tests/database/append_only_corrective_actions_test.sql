begin;
create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;

grant usage on schema extensions to anon, authenticated;
grant execute on all functions in schema extensions to anon, authenticated;

select plan(3);

insert into auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data
) values
  ('00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555',
   'authenticated', 'authenticated', 'e@example.com',
   'not-a-real-hash', now(), now(), now(), '{}', '{}');

set local request.jwt.claims = '{"sub":"55555555-5555-5555-5555-555555555555","role":"authenticated"}';
set local role authenticated;
select complete_onboarding(
  'Truck E', 'El Paso', 'TX', 'America/Chicago', 'truck',
  '[{"name":"Hot hold","equipment_type":"hot_holding","threshold_min":135,"threshold_max":null}]'::jsonb,
  '[]'::jsonb
);

-- A log out of threshold, mirroring what /api/sync/log inserts.
insert into logs (business_id, truck_id, equipment_id, client_id, temperature, recorded_at, is_out_of_threshold)
select t.business_id, t.id, e.id, '66666666-6666-6666-6666-666666666666', 120, now(), true
from trucks t join equipment e on e.truck_id = t.id
where t.name = 'Truck E';

-- Test 1: a CA referencing an unknown log_client_id is rejected (FK integrity —
-- this is the mechanism that makes offline out-of-order sync safe).
select throws_ok(
  $$
  insert into corrective_actions (business_id, truck_id, log_client_id, client_id, action_type, recorded_at)
  select business_id, id, '99999999-9999-9999-9999-999999999999', gen_random_uuid(), 'moved_food', now()
  from trucks where name = 'Truck E'
  $$,
  '23503',
  null,
  'corrective_action referencing an unknown log_client_id is rejected'
);

-- Arrange: a valid CA against the real log's client_id.
insert into corrective_actions (business_id, truck_id, log_client_id, client_id, action_type, recorded_at)
select t.business_id, t.id, '66666666-6666-6666-6666-666666666666', gen_random_uuid(), 'moved_food', now()
from trucks t where t.name = 'Truck E';

-- Test 2: direct UPDATE must fail (grant revoked, same pattern as logs).
select throws_ok(
  $$ update corrective_actions set note = 'edited' where action_type = 'moved_food' $$,
  '42501',
  null,
  'UPDATE on corrective_actions is rejected (append-only grant revoked)'
);

-- Test 3: direct DELETE must fail.
select throws_ok(
  $$ delete from corrective_actions where action_type = 'moved_food' $$,
  '42501',
  null,
  'DELETE on corrective_actions is rejected (append-only grant revoked)'
);

select * from finish();
rollback;
