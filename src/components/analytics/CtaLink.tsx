'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { track } from '@/lib/analytics/track';

// GA4PageView already fires page_view on every route (ga4-pageview.tsx) —
// this only needs to tag which CTA got clicked and where, for the
// /compare and /founding-trucks conversion funnel (BACKLOG.md "Funnel
// analytics chưa có").
export function CtaLink({
  page,
  ...props
}: { page: string } & ComponentProps<typeof Link>) {
  return <Link {...props} onClick={() => track('cta_click', { page, href: String(props.href) })} />;
}
