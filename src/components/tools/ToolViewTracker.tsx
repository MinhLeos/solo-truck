'use client';

import { useEffect } from 'react';
import { trackToolEvent } from '@/lib/tools/analytics';

export function ToolViewTracker({ tool }: { tool: string }) {
  useEffect(() => {
    trackToolEvent('tool_view', tool);
  }, [tool]);

  return null;
}
