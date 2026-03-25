import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uses',
  description: "The tools, apps, and hardware used daily for development and productivity.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
