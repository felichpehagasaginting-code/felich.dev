import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guestbook',
  description: "Leave a message in the guestbook. Share your thoughts and feedback with Felich.",
  openGraph: {
    title: 'Guestbook | Felich Portfolio',
    description: 'Leave a message and share your thoughts. Realtime guestbook integration.',
    images: [
      {
        url: `/api/og?title=Sign my Guestbook&description=Leave a message and share your thoughts. Realtime guestbook integration.&type=page`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
