import type { ReactNode } from 'react';
import { PublicAnalytics } from '@/components/analytics/public-analytics';

// /tools iron rules (MARKETING-PLAN.md §2 kênh B, ported from Solo Sitter's
// TOOLS-PLAN.md §2): no DB, no imports from src/app/(app)/ or any product
// business logic — only shared pure UI — one CTA per tool pointed at
// /founding-trucks, and brand transparency in the footer. Each page renders
// its own header/footer.
export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicAnalytics />
      {children}
    </>
  );
}
