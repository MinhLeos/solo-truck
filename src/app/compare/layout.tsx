import type { ReactNode } from 'react';
import { PublicAnalytics } from '@/components/analytics/public-analytics';

// Same "no DB, public, one CTA" shape as /tools — each page renders its own
// header/footer.
export default function CompareLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicAnalytics />
      {children}
    </>
  );
}
