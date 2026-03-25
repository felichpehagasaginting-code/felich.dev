import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Links',
  description: "All social links and profiles in one place.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
