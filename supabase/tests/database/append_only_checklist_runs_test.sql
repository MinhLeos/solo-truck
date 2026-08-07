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
  ('00000000-0000-0000-0000-000000000000', '77777777-7777-7777-7777-777777777777',
   'authenticated', 'authenticated', 'f@example.com',
   'not-a-real-hash', now(), now(), now(), '{}', '{}');

set local request.jwt.claims = '{"sub":"77777777-7777-7777-7777-777777777777","role":"authenticated"}';
set local role authenticated;
select complete_onboarding(
  'Truck F', 'Lubbock', 'TX', 'America/Chicago', 'truck',
  '[{"name":"Fridge","equipment_type":"cold_holding","threshold_min":null,"threshold_max":41}]'::jsonb,
  '[]'::jsonb
);

insert into checklist_runs (business_id, truck_id, client_id, items, recorded_at)
select t.business_id, t.id, gen_random_uuid(), '[{"checklistId":"11111111-1111-1111-1111-111111111111","label":"Hand sink stocked","checked":true}]'::jsonb, now()
from trucks t where t.name = 'Truck F';

select is(
  (select jsonb_array_length(items) from checklist_runs where truck_id = (select id from trucks where name = 'Truck F')),
  1,
  'checklist run insert stores the items snapshot'
);

select throws_ok(
  $$ update checklist_runs set items = '[]'::jsonb where truck_id = (select id from trucks where name = 'Truck F') $$,
  '42501',
  null,
  'UPDATE on checklist_runs is rejected (append-only grant revoked)'
);

select throws_ok(
  $$ delete from checklist_runs where truck_id = (select id from trucks where name = 'Truck F') $$,
  '42501',
  null,
  'DELETE on checklist_runs is rejected (append-only grant revoked)'
);

select * from finish();
rollback;
