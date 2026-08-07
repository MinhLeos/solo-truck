-- Phase 2.4 fix: notifications_log's original Phase 1 shape assumed every
-- row is a success (`sent_at not null default now()`), but sendEmail()
-- needs to log FAILED attempts too (SECURITY.md's "log every send, success
-- and failure" lesson) — sent_at must be nullable for those, and an `error`
-- column is needed to record why.
alter table notifications_log alter column sent_at drop not null;
alter table notifications_log alter column sent_at drop default;
alter table notifications_log add column error text;
