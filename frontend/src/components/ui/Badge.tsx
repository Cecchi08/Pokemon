import type { ReactNode } from 'react';

export function Badge({ children, color }: { children: ReactNode; color?: string }) {
  return <span className="type-pill" style={color ? { '--type-color': color } as React.CSSProperties : undefined}>{children}</span>;
}