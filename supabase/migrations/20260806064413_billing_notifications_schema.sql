-- Reserved for Phase 4 (billing) and Phase 2.4 (reminders/digest) — schema
-- exists now with RLS locked down, per phase-1-foundation.md's "RLS bật TẤT
-- CẢ ngay từ đây (kể cả bảng chưa dùng)". Both tables are written by
-- service_role only (webhook handler / notification job), never by the
-- `authenticated` role — same "select-only for the owner" pattern Solo
-- Sitter uses for its own subscriptions table.

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade unique,
  status text not null default 'trialing'
    check (status in ('trialing', 'active', 'past_due', 'cancelled', 'expired')),
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  provider_customer_id text,
  provider_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table notifications_log (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  channel text not null check (channel in ('email', 'push')),
  template text not null,
  to_address text not null,
  status text not null default 'sent',
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table subscriptions enable row level security;
alter table notifications_log enable row level security;

grant select on subscriptions to authenticated;
grant select on notifications_log to authenticated;

create policy "owner can read their subscription"
on subscriptions for select
using (is_business_owner(business_id));

create policy "owner can read their notifications log"
on notifications_log for select
using (is_business_owner(business_id));
