-- Reserved for Phase 5 (commissary channel) — schema chừa sẵn, quyền khóa
-- chặt: no grants to anon/authenticated at all yet, so RLS is moot (the
-- role can't attempt the command in the first place, a stronger boundary
-- than filtering rows to zero — same pattern as tables with no anon use
-- case in Solo Sitter). Revisit grants when Phase 5 actually builds the
-- commissary dashboard (SECURITY.md §8 governs exactly what may be exposed).

create table commissaries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  state text not null,
  referral_code text not null unique,
  created_at timestamptz not null default now()
);

create table commissary_referrals (
  id uuid primary key default gen_random_uuid(),
  commissary_id uuid not null references commissaries (id) on delete cascade,
  business_id uuid not null references businesses (id) on delete cascade,
  opted_in boolean not null default false,
  created_at timestamptz not null default now()
);

alter table commissaries enable row level security;
alter table commissary_referrals enable row level security;
