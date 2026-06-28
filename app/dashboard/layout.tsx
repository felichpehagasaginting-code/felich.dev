import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Dashboard',
  description: 'GitHub repository overview, contribution activity, and development statistics.',
  path: '/dashboard',
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
