import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'About',
  description: "Learn about Felich, a Software Engineer specializing in AI and full-stack development.",
  path: '/about',
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
