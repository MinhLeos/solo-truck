begin;
create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;

select plan(1);

-- Safety net for SECURITY.md #9: "bảng mới nào cũng bật RLS ngay trong cùng
-- migration" — this fails CI the moment someone forgets, instead of relying
-- on code review to catch it.
select results_eq(
  $$
  select c.relname
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind = 'r'
    and not c.relrowsecurity
  order by c.relname
  $$,
  ARRAY[]::name[],
  'every table in the public schema has row level security enabled'
);

select * from finish();
rollback;
