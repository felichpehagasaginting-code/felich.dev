import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: "GitHub repository overview, contribution activity, and development statistics.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
