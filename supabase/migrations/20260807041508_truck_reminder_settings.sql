-- Phase 2.4: reminder timing config, global per-truck (not per-shift —
-- simpler, and the phase spec's "X phút / Y giờ" defaults are described as
-- one setting per truck, not per individual shift block).
alter table trucks
  add column pre_shift_reminder_minutes int not null default 30,
  add column temp_log_interval_minutes int not null default 240;
