'use client';

import type { ComponentProps } from 'react';
import { track } from '@/lib/analytics/track';

// Same tracking as CtaLink, for CTAs that must be a plain <a> (mailto:,
// external links) rather than next/link.
export function CtaAnchor({
  page,
  ...props
}: { page: string } & ComponentProps<'a'>) {
  return <a {...props} onClick={() => track('cta_click', { page, href: String(props.href) })} />;
}
