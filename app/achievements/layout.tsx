import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Achievements',
  description: "A curated collection of certificates and awards earned throughout academic and professional journey.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
