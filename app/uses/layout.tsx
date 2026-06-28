import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Uses',
  description: 'The tools, apps, and hardware used daily for development and productivity.',
  path: '/uses',
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
