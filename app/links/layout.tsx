import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Links',
  description: 'All social links and profiles in one place.',
  path: '/links',
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
