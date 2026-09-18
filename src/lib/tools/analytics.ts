import { track } from '@/lib/analytics/track';

export type ToolAnalyticsEvent = 'tool_view' | 'tool_result' | 'tool_cta_click';

export function trackToolEvent(
  event: ToolAnalyticsEvent,
  tool: string,
  extra: Record<string, unknown> = {},
) {
  track(event, { tool, ...extra });
}
