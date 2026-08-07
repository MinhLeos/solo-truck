import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { isOutOfThreshold } from '@/lib/thresholds';

const SUPPORTED_ENTITIES = ['log', 'corrective_action', 'checklist_run'] as const;

const logBodySchema = z.object({
  clientId: z.string().uuid(),
  recordedAt: z.string().datetime(),
  payload: z.object({
    equipmentId: z.string().uuid(),
    temperature: z.number(),
    loggedBy: z.string().trim().min(1).nullable().optional(),
    supersedesLogId: z.string().uuid().optional(),
    supersedeReason: z.string().trim().min(5).optional(),
  }),
});

const correctiveActionPayloadSchema = z.object({
  logClientId: z.string().uuid(),
  actionType: z.string().trim().min(1),
  note: z.string().trim().optional().default(''),
});

const checklistRunBodySchema = z.object({
  clientId: z.string().uuid(),
  recordedAt: z.string().datetime(),
  payload: z.object({
    items: z.array(
      z.object({
        checklistId: z.string().uuid(),
        label: z.string(),
        checked: z.boolean(),
      }),
    ),
  }),
});

const UNIQUE_VIOLATION = '23505';
const FOREIGN_KEY_VIOLATION = '23503';

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function handleLog(request: Request, supabase: SupabaseClient) {
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
      is_out_of_threshold: isOutOfThreshold(
        payload.temperature,
        equipment.threshold_min,
        equipment.threshold_max,
      ),
      recorded_at: recordedAt,
      synced_at: syncedAt.toISOString(),
      clock_skew: clockSkew,
      logged_by: payload.loggedBy ?? null,
      supersedes_log_id: payload.supersedesLogId ?? null,
      supersede_reason: payload.supersedeReason ?? null,
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

async function handleCorrectiveAction(request: Request, supabase: SupabaseClient) {
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const clientId = formData.get('clientId');
  const recordedAt = formData.get('recordedAt');
  const payloadRaw = formData.get('payload');
  const photo = formData.get('photo');

  if (typeof clientId !== 'string' || typeof recordedAt !== 'string' || typeof payloadRaw !== 'string') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const parsedClientId = z.string().uuid().safeParse(clientId);
  const parsedRecordedAt = z.string().datetime().safeParse(recordedAt);
  const parsedPayload = correctiveActionPayloadSchema.safeParse(JSON.parse(payloadRaw));
  if (!parsedClientId.success || !parsedRecordedAt.success || !parsedPayload.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const payload = parsedPayload.data;

  const { data: truck } = await supabase
    .from('trucks')
    .select('id, business_id')
    .limit(1)
    .maybeSingle();
  if (!truck) {
    return NextResponse.json({ error: 'No truck for this account' }, { status: 400 });
  }

  // Defense in depth beyond the FK: confirm the referenced log actually
  // belongs to this truck before accepting a photo upload for it.
  const { data: log } = await supabase
    .from('logs')
    .select('id')
    .eq('client_id', payload.logClientId)
    .eq('truck_id', truck.id)
    .maybeSingle();
  if (!log) {
    // The log may simply not have synced yet (client_id FK not satisfied
    // server-side) — treat as retryable, not a hard 400, so the sync
    // engine tries again once the log itself has landed.
    return NextResponse.json({ error: 'Log not found yet' }, { status: 409 });
  }

  let photoPath: string | null = null;
  if (photo instanceof File && photo.size > 0) {
    photoPath = `${truck.business_id}/ca/${parsedClientId.data}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('ca-photos')
      .upload(photoPath, photo, { upsert: true, contentType: 'image/jpeg' });
    if (uploadError) {
      console.error('[sync/corrective_action] upload', uploadError.message);
      return NextResponse.json({ error: 'Could not upload photo' }, { status: 500 });
    }
  }

  const { data: inserted, error: insertError } = await supabase
    .from('corrective_actions')
    .insert({
      client_id: parsedClientId.data,
      business_id: truck.business_id,
      truck_id: truck.id,
      log_client_id: payload.logClientId,
      action_type: payload.actionType,
      note: payload.note || null,
      photo_path: photoPath,
      recorded_at: parsedRecordedAt.data,
    })
    .select()
    .maybeSingle();

  if (insertError) {
    if (insertError.code === UNIQUE_VIOLATION) {
      const { data: existing } = await supabase
        .from('corrective_actions')
        .select()
        .eq('client_id', parsedClientId.data)
        .maybeSingle();
      return NextResponse.json({ correctiveAction: existing });
    }
    if (insertError.code === FOREIGN_KEY_VIOLATION) {
      return NextResponse.json({ error: 'Log not found yet' }, { status: 409 });
    }
    console.error('[sync/corrective_action]', insertError.code, insertError.message);
    return NextResponse.json({ error: 'Could not save corrective action' }, { status: 500 });
  }

  return NextResponse.json({ correctiveAction: inserted });
}

async function handleChecklistRun(request: Request, supabase: SupabaseClient) {
  const json = await request.json().catch(() => null);
  const parsed = checklistRunBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const { clientId, recordedAt, payload } = parsed.data;

  const { data: truck } = await supabase
    .from('trucks')
    .select('id, business_id')
    .limit(1)
    .maybeSingle();
  if (!truck) {
    return NextResponse.json({ error: 'No truck for this account' }, { status: 400 });
  }

  const { data: inserted, error: insertError } = await supabase
    .from('checklist_runs')
    .insert({
      client_id: clientId,
      business_id: truck.business_id,
      truck_id: truck.id,
      items: payload.items,
      recorded_at: recordedAt,
      synced_at: new Date().toISOString(),
    })
    .select()
    .maybeSingle();

  if (insertError) {
    if (insertError.code === UNIQUE_VIOLATION) {
      const { data: existing } = await supabase
        .from('checklist_runs')
        .select()
        .eq('client_id', clientId)
        .maybeSingle();
      return NextResponse.json({ checklistRun: existing });
    }
    console.error('[sync/checklist_run]', insertError.code, insertError.message);
    return NextResponse.json({ error: 'Could not save checklist run' }, { status: 500 });
  }

  return NextResponse.json({ checklistRun: inserted });
}

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

  if (entity === 'corrective_action') {
    return handleCorrectiveAction(request, supabase);
  }
  if (entity === 'checklist_run') {
    return handleChecklistRun(request, supabase);
  }
  return handleLog(request, supabase);
}
