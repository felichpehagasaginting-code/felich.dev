import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Admin',
  description: 'Kelola projects portfolio.',
  path: '/admin',
  noIndex: true,
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
