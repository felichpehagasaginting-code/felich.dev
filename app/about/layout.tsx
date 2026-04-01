import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: "Learn about Felich, a Software Engineer specializing in AI and full-stack development.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
