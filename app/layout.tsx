import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import ThemeProvider from '@/components/ThemeProvider';
import ThemeMetaSync from '@/components/ThemeMetaSync';
import CustomCursor from '@/components/CustomCursor';
import DynamicFavicon from '@/components/DynamicFavicon';
import DynamicClientComponents from '@/components/DynamicClientComponents';
import { createMetadata, siteConfig } from '@/lib/seo';

const AdaptiveBackground = dynamic(() => import('@/components/AdaptiveBackground'), { ssr: false });
const AppleDock = dynamic(() => import('@/components/AppleDock'), { ssr: false });
const ScrollProgress = dynamic(() => import('@/components/ScrollProgress'), { ssr: false });
const SmoothScroll = dynamic(() => import('@/components/SmoothScroll'), { ssr: false });
const LiveVisitorBadge = dynamic(() => import('@/components/LiveVisitorBadge'), { ssr: false });

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

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
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} ${mono.variable} antialiased tracking-tight bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300 selection:bg-primary/30 font-[family-name:var(--font-apple)]`}>
        {/* Skip Navigation — WCAG 2.4.1: allows keyboard users to bypass repetitive nav blocks */}
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <Providers>
          <ThemeProvider>
            <DynamicFavicon />
            <CustomCursor />
            <ThemeMetaSync />
            <DynamicClientComponents />
            <ScrollProgress />
            <AdaptiveBackground />
            <AppleDock />
            <LiveVisitorBadge showViews={true} />

            <SmoothScroll>
              <div className="min-h-screen flex">
                <Sidebar />
                <MobileNav />
                <main id="main-content" className="flex-1 min-w-0 pt-14 lg:pt-0 relative">
                  {/* Subtle top loading bar simulation (CSS only for static feel) */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20 pointer-events-none" />
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
