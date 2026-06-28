import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Projects',
  description: 'Explore the portfolio of web applications, AI projects, and FinTech solutions developed by Felich.',
  path: '/projects',
  image: '/api/og?title=Project Portfolio&description=A collection of modern web apps, AI systems, and scalable digital solutions.&type=project',
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
