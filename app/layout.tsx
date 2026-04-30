import type { Metadata, Viewport } from 'next';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import dynamic from 'next/dynamic';
import ThemeProvider from '@/components/ThemeProvider';
import ThemeMetaSync from '@/components/ThemeMetaSync';
import ScrollProgress from '@/components/ScrollProgress';
import CustomCursor from '@/components/CustomCursor';
import HoverSound from '@/components/HoverSound';
import DynamicFavicon from '@/components/DynamicFavicon';
import DynamicClientComponents from '@/components/DynamicClientComponents';
import AdaptiveBackground from '@/components/AdaptiveBackground';
import SmoothScroll from '@/components/SmoothScroll';



const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://felich.dev'),
  title: {
    default: 'Felich | Software Engineer & AI Specialist',
    template: '%s | Felich',
  },
  description: 'Versatile Software Engineer specializing in AI Engineering, Fullstack Development, and DevOps. Building impactful digital solutions with Next.js, Python, and TypeScript.',
  keywords: ['felich', 'software engineer', 'ai engineer', 'machine learning', 'portfolio', 'fullstack developer', 'next.js', 'typescript'],
  authors: [{ name: 'Felich', url: 'https://felich.dev' }],
  creator: 'Felich',
  openGraph: {
    title: 'Felich | Software Engineer & AI Specialist',
    description: 'Versatile Software Engineer specializing in AI Engineering, Fullstack Development, and DevOps.',
    url: 'https://felich.dev',
    siteName: 'Felich Portfolio',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Felich Portfolio' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Felich | Software Engineer & AI Specialist',
    description: 'Versatile Software Engineer specializing in AI Engineering, Fullstack Development, and DevOps.',
    creator: '@fel_comp',
    images: ['/og-image.png'],
  },
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
      <body className={`${inter.variable} ${outfit.variable} ${mono.variable} antialiased tracking-tight bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300 selection:bg-primary/30`}>
        <Providers>
          <ThemeProvider>
            <DynamicFavicon />
            <CustomCursor />
            <ThemeMetaSync />
            <DynamicClientComponents />
            <ScrollProgress />
            <AdaptiveBackground />

            <SmoothScroll>
              <div className="min-h-screen flex">
                <Sidebar />
                <MobileNav />
                <main className="flex-1 min-w-0 pt-14 lg:pt-0 relative">
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
