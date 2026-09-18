'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { trackToolEvent } from '@/lib/tools/analytics';

export function ToolCtaLink({
  tool,
  ...props
}: { tool: string } & ComponentProps<typeof Link>) {
  return <Link {...props} onClick={() => trackToolEvent('tool_cta_click', tool)} />;
}
