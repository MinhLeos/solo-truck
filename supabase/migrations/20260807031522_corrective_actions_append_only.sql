-- Phase 2.2: redesign corrective_actions' FK + lock it down append-only.
--
-- Redesign: log_id -> log_client_id, referencing logs(client_id) instead of
-- logs(id). logs.id is server-generated and unknown to the client until
-- sync completes, but a corrective action can be created in the same
-- offline session as its log (out-of-threshold reading -> CA required
-- immediately, ARCHITECTURE.md §6.2). logs.client_id is already `unique not
-- null` and known on-device immediately, so it's a valid FK target and lets
-- both rows be queued offline together. If a CA's sync races ahead of its
-- log's, the FK violation is just a transient/retryable error in the
-- existing sync engine (src/lib/offline/sync.ts) — already handled, not a
-- new failure mode to design around.
alter table corrective_actions drop column log_id;
alter table corrective_actions add column log_client_id uuid not null references logs (client_id) on delete cascade;

-- Same append-only pattern as `logs` (prevent_update_delete() defined in
-- the Phase 2.1 migration).
revoke update, delete on corrective_actions from authenticated;

create trigger corrective_actions_prevent_update_delete
before update or delete on corrective_actions
for each row execute function prevent_update_delete();

drop policy "owner can access their corrective actions" on corrective_actions;

create policy "owner can read their corrective actions"
on corrective_actions for select
using (is_business_owner(business_id));

create policy "owner can insert their corrective actions"
on corrective_actions for insert
with check (is_business_owner(business_id));
