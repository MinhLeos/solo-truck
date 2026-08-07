-- Phase 2.3: lock down checklist_runs append-only — third and last use of
-- prevent_update_delete() (defined in the Phase 2.1 migration). Each tap on
-- /checklist inserts a brand new snapshot row (items: jsonb) rather than
-- updating a draft — "current state" is just the latest row for today, so
-- there's never a legitimate UPDATE to allow in the first place.

revoke update, delete on checklist_runs from authenticated;

create trigger checklist_runs_prevent_update_delete
before update or delete on checklist_runs
for each row execute function prevent_update_delete();

drop policy "owner can access their checklist runs" on checklist_runs;

create policy "owner can read their checklist runs"
on checklist_runs for select
using (is_business_owner(business_id));

create policy "owner can insert their checklist runs"
on checklist_runs for insert
with check (is_business_owner(business_id));
