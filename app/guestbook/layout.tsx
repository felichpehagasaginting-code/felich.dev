import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guestbook',
  description: "Leave a message in the guestbook. Share your thoughts and feedback.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
