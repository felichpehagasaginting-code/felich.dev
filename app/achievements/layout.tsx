import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Achievements',
  description: 'A curated collection of certificates and awards earned throughout academic and professional journey.',
  path: '/achievements',
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
