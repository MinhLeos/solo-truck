import type { ReactNode } from 'react';

// role="alert" so screen readers announce this the moment it mounts —
// plain <p> text is invisible to assistive tech unless focus happens to
// already be there.
export function FormMessage({
  status,
  children,
}: {
  status: 'error' | 'success';
  children: ReactNode;
}) {
  return (
    <p role="alert" className={`text-sm ${status === 'error' ? 'text-flame-deep' : 'text-pass'}`}>
      {children}
    </p>
  );
}
