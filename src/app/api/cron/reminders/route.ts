import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/notifications/send-email';
import { isPreShiftReminderDue, isTempLogReminderDue, type ShiftWindow } from '@/lib/reminders';
import { utcToZonedDateString } from '@/lib/timezone';
import type { TimeOfDay } from '@/lib/timezone';

function parseTime(value: string): TimeOfDay {
  const [hour, minute] = value.split(':').map(Number);
  return { hour, minute };
}

export async function GET(request: Request) {
  // Vercel signs scheduled cron requests with this header automatically
  // once CRON_SECRET is set as an env var — this is the only thing standing
  // between this route and anyone who finds the URL, since it's otherwise
  // unauthenticated (same pattern as Solo Sitter's cron route).
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();
  let preShiftSent = 0;
  let tempLogSent = 0;

  const { data: trucks } = await admin
    .from('trucks')
    .select('id, business_id, timezone, pre_shift_reminder_minutes, temp_log_interval_minutes');

  for (const truck of trucks ?? []) {
    const { data: shifts } = await admin
      .from('shifts')
      .select('day_of_week, start_time, end_time')
      .eq('truck_id', truck.id)
      .is('deleted_at', null);
    if (!shifts || shifts.length === 0) continue;

    const { data: business } = await admin
      .from('businesses')
      .select('owner_id')
      .eq('id', truck.business_id)
      .maybeSingle();
    if (!business) continue;

    const { data: userResult } = await admin.auth.admin.getUserById(business.owner_id);
    const email = userResult?.user?.email;
    if (!email) continue;

    const today = utcToZonedDateString(now, truck.timezone);
    const startOfTodayUtc = new Date(`${today}T00:00:00.000Z`).toISOString();

    for (const shift of shifts) {
      const shiftWindow: ShiftWindow = {
        dayOfWeek: shift.day_of_week,
        startTime: parseTime(shift.start_time),
        endTime: parseTime(shift.end_time),
      };

      // Pre-shift reminder — "already sent today" tracked per business+template,
      // not per-shift (a truck with multiple same-day shifts gets at most one
      // pre-shift nudge per day — an acceptable MVP simplification).
      const { data: preShiftAlreadySent } = await admin
        .from('notifications_log')
        .select('id')
        .eq('business_id', truck.business_id)
        .eq('template', 'pre_shift_reminder')
        .eq('status', 'sent')
        .gte('created_at', startOfTodayUtc)
        .limit(1)
        .maybeSingle();

      if (
        isPreShiftReminderDue(
          now,
          shiftWindow,
          truck.timezone,
          truck.pre_shift_reminder_minutes,
          Boolean(preShiftAlreadySent),
        )
      ) {
        await sendEmail({
          businessId: truck.business_id,
          to: email,
          subject: "Pre-shift check — you're opening soon",
          html: '<p>Run your pre-shift checklist before you open today.</p>',
          template: 'pre_shift_reminder',
        });
        preShiftSent++;
      }

      // Temp-log reminder — cadence measured from the last one actually sent.
      const { data: lastTempLogReminder } = await admin
        .from('notifications_log')
        .select('created_at')
        .eq('business_id', truck.business_id)
        .eq('template', 'temp_log_reminder')
        .eq('status', 'sent')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const lastSentAt = lastTempLogReminder ? new Date(lastTempLogReminder.created_at) : null;

      if (
        isTempLogReminderDue(now, shiftWindow, truck.timezone, truck.temp_log_interval_minutes, lastSentAt)
      ) {
        await sendEmail({
          businessId: truck.business_id,
          to: email,
          subject: 'Time to log your temperatures',
          html: '<p>It’s been a while — log a temperature reading for your equipment.</p>',
          template: 'temp_log_reminder',
        });
        tempLogSent++;
      }
    }
  }

  return NextResponse.json({ preShiftSent, tempLogSent });
}
