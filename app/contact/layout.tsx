import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: "Get in touch via email, social media, or the contact form.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
