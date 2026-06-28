import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Contact',
  description: 'Get in touch via email, social media, or the contact form.',
  path: '/contact',
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
