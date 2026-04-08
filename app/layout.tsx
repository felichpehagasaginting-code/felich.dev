import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Metadata } from 'next';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import dynamic from 'next/dynamic';
import ThemeProvider from '@/components/ThemeProvider';
import ThemeMetaSync from '@/components/ThemeMetaSync';
import ScrollProgress from '@/components/ScrollProgress';

const BackToTop = dynamic(() => import('@/components/BackToTop'), { ssr: false });
const EasterEgg = dynamic(() => import('@/components/EasterEgg'), { ssr: false });
const CursorGlow = dynamic(() => import('@/components/CursorGlow'), { ssr: false });
const LiveTicker = dynamic(() => import('@/components/LiveTicker'), { ssr: false });
const ThemeWarp = dynamic(() => import('@/components/ThemeWarp'), { ssr: false });
const EngineeringGrid = dynamic(() => import('@/components/EngineeringGrid'), { ssr: false });
const PulseSync = dynamic(() => import('@/components/PulseSync'), { ssr: false });
const QuickConnect = dynamic(() => import('@/components/QuickConnect'), { ssr: false });
const CommandPalette = dynamic(() => import('@/components/CommandPalette'), { ssr: false });

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
            <ThemeMetaSync />
            <PulseSync />
            <EngineeringGrid />
            <ThemeWarp />
            <ScrollProgress />
            {/* Command Palette (global) */}
            <CommandPalette />

            <div className="min-h-screen flex">
              {/* Desktop Sidebar */}
              <Sidebar />

              {/* Mobile Navigation */}
              <MobileNav />

              {/* Main Content */}
              <main className="flex-1 min-w-0 pt-14 lg:pt-0">
                <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-6 pb-32 lg:py-12">
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

            {/* Live Monitoring Ticker */}
            <LiveTicker />
            
            {/* Quick Connect FAB */}
            <QuickConnect />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
