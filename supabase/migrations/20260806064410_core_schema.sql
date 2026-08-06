-- Core schema: businesses + trucks, RLS enabled from day one (SECURITY.md §9).
--
-- Deliberate deviation from the Solo Sitter playbook: no `business_members`
-- join table. Solo Truck's MVP ownership model is single-owner only (staff
-- get PIN attribution, not a separate auth identity — ARCHITECTURE.md §3,
-- SECURITY.md §7), so `businesses.owner_id` is a direct column and RLS can
-- reference it with no chicken-and-egg recursion to solve. A real
-- multi-owner `business_members` table is the natural extension point if
-- Solo Truck ever needs it — track in BACKLOG.md, don't build ahead of need.

create table businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table trucks (
  id uuid primary key default gen_random_uuid(),
  -- MVP: 1 business = 1 truck (`unique`); relax when Phase 5+ needs
  -- multi-truck per owner — BACKLOG.md already reserves this.
  business_id uuid not null references businesses (id) on delete cascade unique,
  name text not null,
  city text not null,
  state text not null,
  timezone text not null,
  unit_type text not null check (unit_type in ('truck', 'trailer', 'cart')),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table businesses enable row level security;
alter table trucks enable row level security;

-- Table-level grants only decide which commands a role may attempt; the RLS
-- policies below decide which rows, so broad grants here are safe.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on businesses to authenticated;
grant select, insert, update, delete on trucks to authenticated;

create function is_business_owner(p_business_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from businesses
    where id = p_business_id and owner_id = auth.uid()
  );
$$;

revoke all on function is_business_owner (uuid) from public;
grant execute on function is_business_owner (uuid) to authenticated;

create policy "owner can read their business"
on businesses for select
using (owner_id = auth.uid());

create policy "owner can update their business"
on businesses for update
using (owner_id = auth.uid());

-- Direct INSERT is safe here (unlike a business_members-based model): the
-- check is self-contained (owner_id = auth.uid()), no bootstrap RPC needed
-- just to satisfy RLS. Onboarding still goes through complete_onboarding()
-- (see the onboarding_rpc migration) for transactional atomicity across
-- businesses/trucks/equipment/shifts/checklists in one wizard submit — not
-- because RLS requires it.
create policy "owner can insert their business"
on businesses for insert
with check (owner_id = auth.uid());

create policy "owner can access their truck"
on trucks for all
using (is_business_owner(business_id))
with check (is_business_owner(business_id));
