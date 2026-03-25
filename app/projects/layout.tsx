import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: "Explore the portfolio of web applications, AI projects, and FinTech solutions.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
