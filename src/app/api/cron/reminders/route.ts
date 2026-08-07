import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/notifications/send-email';
import { isPreShiftReminderDue, isTempLogReminderDue, type ShiftWindow } from '@/lib/reminders';
import { isDocumentExpiryReminderDue, type ExpiryMilestone } from '@/lib/documents/reminders';
import { isWeeklyDigestDue } from '@/lib/digest';
import { computeCurrentStreak } from '@/lib/streaks';
import { utcToZonedDateString } from '@/lib/timezone';
import type { TimeOfDay } from '@/lib/timezone';

const EXPIRY_MILESTONES: { milestone: ExpiryMilestone; template: string }[] = [
  { milestone: 'thirty_day', template: 'document_expiry_30d' },
  { milestone: 'seven_day', template: 'document_expiry_7d' },
];

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
  let documentExpirySent = 0;
  let digestSent = 0;

  // Housekeeping for the /i/[token] rate limiter (Phase 3.2) — piggybacks on
  // this already-scheduled tick instead of a separate pg_cron job.
  await admin
    .from('rate_limit_hits')
    .delete()
    .lt('created_at', new Date(now.getTime() - 60 * 60 * 1000).toISOString());

  const { data: trucks } = await admin
    .from('trucks')
    .select('id, business_id, timezone, pre_shift_reminder_minutes, temp_log_interval_minutes');

  for (const truck of trucks ?? []) {
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

    // Weekly digest — Monday truck-local, independent of shifts (a truck
    // with no shifts configured yet still benefits from the nudge to set
    // some up). "Already sent this week" reuses the same "sent today"
    // window as everything else in this route, since isWeeklyDigestDue only
    // ever returns true on the one day the week's send should happen.
    const { data: digestAlreadySent } = await admin
      .from('notifications_log')
      .select('id')
      .eq('business_id', truck.business_id)
      .eq('template', 'weekly_digest')
      .eq('status', 'sent')
      .gte('created_at', startOfTodayUtc)
      .limit(1)
      .maybeSingle();

    if (isWeeklyDigestDue(now, truck.timezone, Boolean(digestAlreadySent))) {
      const weekAgoUtc = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const { data: weekShifts } = await admin
        .from('shifts')
        .select('day_of_week')
        .eq('truck_id', truck.id)
        .is('deleted_at', null);

      const streak = await computeCurrentStreak(
        admin,
        truck.id,
        (weekShifts ?? []).map((s) => s.day_of_week),
        truck.timezone,
        today,
      );

      const { count: logCount } = await admin
        .from('logs')
        .select('id', { count: 'exact', head: true })
        .eq('truck_id', truck.id)
        .gte('recorded_at', weekAgoUtc);

      const { count: caCount } = await admin
        .from('corrective_actions')
        .select('id', { count: 'exact', head: true })
        .eq('truck_id', truck.id)
        .gte('recorded_at', weekAgoUtc);

      const { count: expiringDocsCount } = await admin
        .from('documents')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', truck.business_id)
        .is('deleted_at', null)
        .not('expires_at', 'is', null)
        .lte('expires_at', new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString());

      await sendEmail({
        businessId: truck.business_id,
        to: email,
        subject: 'Your weekly compliance digest',
        html: `<p>🔥 ${streak}-day streak.</p><p>${logCount ?? 0} temperature logs and ${caCount ?? 0} corrective actions this week.</p><p>${expiringDocsCount ?? 0} document(s) expiring within 30 days.</p><p>Keep it up — honest logs are what inspectors respect most.</p>`,
        template: 'weekly_digest',
      });
      digestSent++;
    }

    // Document expiry nudges don't depend on shifts being configured at all
    // — a truck with no shifts yet still has a permit that can lapse.
    const { data: documents } = await admin
      .from('documents')
      .select('id, kind, expires_at')
      .eq('business_id', truck.business_id)
      .is('deleted_at', null)
      .not('expires_at', 'is', null);

    for (const doc of documents ?? []) {
      for (const { milestone, template } of EXPIRY_MILESTONES) {
        const { data: alreadySent } = await admin
          .from('notifications_log')
          .select('id')
          .eq('business_id', truck.business_id)
          .eq('template', template)
          .eq('related_id', doc.id)
          .eq('status', 'sent')
          .limit(1)
          .maybeSingle();

        if (isDocumentExpiryReminderDue(doc.expires_at!, now, milestone, Boolean(alreadySent))) {
          await sendEmail({
            businessId: truck.business_id,
            to: email,
            subject: `${doc.kind.replace(/_/g, ' ')} expiring soon`,
            html: `<p>Your ${doc.kind.replace(/_/g, ' ')} expires on ${new Date(doc.expires_at!).toLocaleDateString()}. Upload a renewal in Documents.</p>`,
            template,
            relatedId: doc.id,
          });
          documentExpirySent++;
        }
      }
    }

    const { data: shifts } = await admin
      .from('shifts')
      .select('day_of_week, start_time, end_time')
      .eq('truck_id', truck.id)
      .is('deleted_at', null);
    if (!shifts || shifts.length === 0) continue;

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

  return NextResponse.json({ preShiftSent, tempLogSent, documentExpirySent, digestSent });
}
