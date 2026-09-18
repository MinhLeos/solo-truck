'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { gtagEvent } from '@/lib/analytics/ga4-client';

function PageViewCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    gtagEvent('page_view', {
      page_path: query ? `${pathname}?${query}` : pathname,
    });
  }, [pathname, searchParams]);

  return null;
}

// App Router client-side navigations don't reload the page, so gtag.js's
// own automatic pageview (disabled in ga4-script.tsx) is replaced by this
// firing manually on every path/query change.
export function GA4PageView() {
  return (
    <Suspense fallback={null}>
      <PageViewCapture />
    </Suspense>
  );
}
