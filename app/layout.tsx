import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Metadata } from 'next';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import BackToTop from '@/components/BackToTop';
import EasterEgg from '@/components/EasterEgg';
import CursorGlow from '@/components/CursorGlow';
import TabTitle from '@/components/TabTitle';
import ThemeProvider from '@/components/ThemeProvider';
import CommandPalette from '@/components/CommandPalette';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://felich.dev'),
  title: {
    default: 'Felich | Portfolio',
    template: '%s | Felich',
  },
  description: 'Software Engineer specializing in AI Engineering and FinTech solutions. Currently advancing expertise in AI/ML while architecting scalable financial systems.',
  keywords: ['felich', 'software engineer', 'ai engineer', 'machine learning', 'fintech', 'portfolio'],
  authors: [{ name: 'Felich' }],
  openGraph: {
    title: 'Felich | Portfolio',
    description: 'Software Engineer specializing in AI Engineering and FinTech solutions.',
    type: 'website',
    siteName: 'Felich Portfolio',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300`}>
        <Providers>
          <ThemeProvider>
            {/* Command Palette (global) */}
            <CommandPalette />

            <div className="min-h-screen flex">
              {/* Desktop Sidebar */}
              <Sidebar />

              {/* Mobile Navigation */}
              <MobileNav />

              {/* Main Content */}
              <main className="flex-1 min-w-0 pt-14 lg:pt-0">
                <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 lg:py-12">
                  {children}
                </div>
              </main>
            </div>

            {/* Back to Top */}
            <BackToTop />

            {/* Easter Egg */}
            <EasterEgg />

            {/* Cursor Glow */}
            <CursorGlow />

            {/* Tab Title Animation */}
            <TabTitle />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
