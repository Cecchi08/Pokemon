import type { ReactNode } from 'react';

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="message-state"><span className="empty-orbit">◌</span><strong>{title}</strong>{children && <span>{children}</span>}</div>;
}