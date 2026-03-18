import type { ReactNode } from 'react';

export function ClientOnlyRoute({ children }: { children: ReactNode }) {
  if (typeof window === 'undefined') return null;
  return <>{children}</>;
}
