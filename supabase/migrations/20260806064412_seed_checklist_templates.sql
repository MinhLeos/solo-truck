-- Global reference table: the 12 standard pre-shift checklist items
-- (EVIDENCE.md §2), copied into a business's own `checklists` rows by
-- complete_onboarding() (see onboarding_rpc migration). Not per-tenant —
-- only migrations write this table, so there's no insert/update/delete
-- grant to `authenticated` at all.

create table checklist_item_templates (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  sort_order int not null
);

alter table checklist_item_templates enable row level security;

grant select on checklist_item_templates to authenticated;

create policy "authenticated can read checklist templates"
on checklist_item_templates for select
using (true);

insert into checklist_item_templates (label, sort_order) values
  ('Permits + commissary agreement present', 1),
  ('Water supply has adequate pressure', 2),
  ('Grey tank ≥15% larger than fresh water tank', 3),
  ('Hand sink stocked: soap, towels, water ≥100°F', 4),
  ('Probe thermometer calibrated', 5),
  ('Cold holding at correct temperature', 6),
  ('Hot holding at correct temperature', 7),
  ('Today''s log has been updated', 8),
  ('Allergen matrix present, staff can answer questions', 9),
  ('Raw food stored below ready-to-eat, date labels present', 10),
  ('Sanitizer at correct concentration, test strips not expired/wet', 11),
  ('Pest control: screens intact, no standing water; grease/trash covered', 12);
