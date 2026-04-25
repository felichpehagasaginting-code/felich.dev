import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: "Explore the portfolio of web applications, AI projects, and FinTech solutions developed by Felich.",
  openGraph: {
    title: 'Projects | Felich Portfolio',
    description: 'A collection of modern web apps, AI systems, and scalable digital solutions.',
    images: [
      {
        url: `/api/og?title=Project Portfolio&description=A collection of modern web apps, AI systems, and scalable digital solutions.&type=project`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
