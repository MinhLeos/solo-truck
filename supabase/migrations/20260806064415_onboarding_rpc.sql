-- The 3-step onboarding wizard (truck → equipment → shifts, see
-- src/app/setup/wizard.tsx) submits once at the end — this single
-- security-definer RPC creates the business, truck, equipment, shifts and
-- seeds the business's own checklist rows from checklist_item_templates,
-- all in one transaction.

create function complete_onboarding(
  p_truck_name text,
  p_city text,
  p_state text,
  p_timezone text,
  p_unit_type text,
  p_equipment jsonb,  -- [{name, equipment_type, threshold_min, threshold_max}]
  p_shifts jsonb      -- [{day_of_week, start_time, end_time}], may be []
)
returns trucks
language plpgsql
security definer
set search_path = public
as $$
declare
  v_business businesses;
  v_truck trucks;
  v_item jsonb;
begin
  insert into businesses (owner_id) values (auth.uid()) returning * into v_business;

  insert into trucks (business_id, name, city, state, timezone, unit_type)
  values (v_business.id, p_truck_name, p_city, p_state, p_timezone, p_unit_type)
  returning * into v_truck;

  for v_item in select * from jsonb_array_elements(p_equipment) loop
    insert into equipment (business_id, truck_id, name, equipment_type, threshold_min, threshold_max)
    values (
      v_business.id, v_truck.id,
      v_item ->> 'name', v_item ->> 'equipment_type',
      (v_item ->> 'threshold_min')::numeric, (v_item ->> 'threshold_max')::numeric
    );
  end loop;

  for v_item in select * from jsonb_array_elements(p_shifts) loop
    insert into shifts (business_id, truck_id, day_of_week, start_time, end_time)
    values (
      v_business.id, v_truck.id,
      (v_item ->> 'day_of_week')::smallint,
      (v_item ->> 'start_time')::time, (v_item ->> 'end_time')::time
    );
  end loop;

  insert into checklists (business_id, label, sort_order)
  select v_business.id, label, sort_order from checklist_item_templates;

  return v_truck;
end;
$$;

revoke all on function complete_onboarding (text, text, text, text, text, jsonb, jsonb) from public;
grant execute on function complete_onboarding (text, text, text, text, text, jsonb, jsonb) to authenticated;
