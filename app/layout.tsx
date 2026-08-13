import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import { Poppins, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import ThemeProvider from '@/components/ThemeProvider';
import ThemeMetaSync from '@/components/ThemeMetaSync';
import DynamicFavicon from '@/components/DynamicFavicon';
import DynamicClientComponents from '@/components/DynamicClientComponents';
import { createMetadata, siteConfig } from '@/lib/seo';

const AdaptiveBackground = dynamic(() => import('@/components/AdaptiveBackground'));
const ScrollProgress = dynamic(() => import('@/components/ScrollProgress'));
const SmoothScroll = dynamic(() => import('@/components/SmoothScroll'));
const LiveVisitorBadge = dynamic(() => import('@/components/LiveVisitorBadge'));

const poppins = Poppins({ subsets: ['latin'], variable: '--font-poppins', weight: ['400', '500', '600', '700'] });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500'] });

export const metadata: Metadata = {
  ...createMetadata(),
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: '%s | Felich',
  },
  keywords: ['felich', 'software engineer', 'ai engineer', 'machine learning', 'portfolio', 'fullstack developer', 'next.js', 'typescript'],
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
};

export const viewport: Viewport = {
  themeColor: '#0F0F0F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="theme-noir dark" suppressHydrationWarning>
      <body className={`${poppins.variable} ${mono.variable} font-sans antialiased bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300 selection:bg-primary/20`}>
        {/* Skip Navigation — WCAG 2.4.1: allows keyboard users to bypass repetitive nav blocks */}
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <Providers>
          <ThemeProvider>
            <DynamicFavicon />
            <ThemeMetaSync />
            <DynamicClientComponents />
            <ScrollProgress />
            <AdaptiveBackground />
            <LiveVisitorBadge showViews={true} />

            <SmoothScroll>
              <div className="min-h-screen flex">
                <Sidebar />
                <MobileNav />
                <main id="main-content" className="flex-1 min-w-0 pt-14 lg:pt-0 relative">
                  <div className="max-w-5xl mx-auto px-6 sm:px-10 md:px-12 pt-8 pb-32 lg:py-16">
                    {children}
                  </div>
                </main>
              </div>
            </SmoothScroll>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
