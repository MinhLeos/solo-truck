import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

// Phase 1 only wires up the 'log' entity end-to-end, to prove the offline
// queue → sync → idempotent-upsert pipeline (step 1.3 DoD). corrective
// actions and checklist runs get their own entity handling once Phase 2
// builds the UI that produces them.
const SUPPORTED_ENTITIES = ['log'] as const;

const logBodySchema = z.object({
  clientId: z.string().uuid(),
  recordedAt: z.string().datetime(),
  payload: z.object({
    equipmentId: z.string().uuid(),
    temperature: z.number(),
  }),
});

const UNIQUE_VIOLATION = '23505';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ entity: string }> },
) {
  const { entity } = await params;

  if (!SUPPORTED_ENTITIES.includes(entity as (typeof SUPPORTED_ENTITIES)[number])) {
    return NextResponse.json({ error: 'Unsupported entity' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = logBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const { clientId, recordedAt, payload } = parsed.data;

  // Tenant scoping resolved server-side from the session — never trusted
  // from the client (SECURITY.md §9).
  const { data: truck } = await supabase
    .from('trucks')
    .select('id, business_id')
    .limit(1)
    .maybeSingle();
  if (!truck) {
    return NextResponse.json({ error: 'No truck for this account' }, { status: 400 });
  }

  const { data: equipment } = await supabase
    .from('equipment')
    .select('id, threshold_min, threshold_max')
    .eq('id', payload.equipmentId)
    .eq('truck_id', truck.id)
    .maybeSingle();
  if (!equipment) {
    return NextResponse.json({ error: 'Unknown equipment' }, { status: 400 });
  }

  const isOutOfThreshold =
    (equipment.threshold_min !== null && payload.temperature < equipment.threshold_min) ||
    (equipment.threshold_max !== null && payload.temperature > equipment.threshold_max);

  const syncedAt = new Date();
  const clockSkew = new Date(recordedAt).getTime() > syncedAt.getTime() + 5 * 60_000;

  const { data: inserted, error: insertError } = await supabase
    .from('logs')
    .insert({
      client_id: clientId,
      business_id: truck.business_id,
      truck_id: truck.id,
      equipment_id: equipment.id,
      temperature: payload.temperature,
      is_out_of_threshold: isOutOfThreshold,
      recorded_at: recordedAt,
      synced_at: syncedAt.toISOString(),
      clock_skew: clockSkew,
    })
    .select()
    .maybeSingle();

  if (insertError) {
    if (insertError.code === UNIQUE_VIOLATION) {
      // Already synced by a prior attempt — the client only cares that the
      // server has it, not whether THIS call is the one that inserted it
      // (SECURITY.md §4: retry as many times as needed, exactly one row).
      const { data: existing } = await supabase
        .from('logs')
        .select()
        .eq('client_id', clientId)
        .maybeSingle();
      return NextResponse.json({ log: existing });
    }
    console.error('[sync/log]', insertError.code, insertError.message);
    return NextResponse.json({ error: 'Could not save log' }, { status: 500 });
  }

  return NextResponse.json({ log: inserted });
}
