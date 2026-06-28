import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Guestbook',
  description: 'Leave a message in the guestbook. Share your thoughts and feedback with Felich.',
  path: '/guestbook',
  image: '/api/og?title=Sign my Guestbook&description=Leave a message and share your thoughts. Realtime guestbook integration.&type=page',
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
