'use client';

import dynamic from 'next/dynamic';

const BackToTop = dynamic(() => import('@/components/BackToTop'), { ssr: false });
const EasterEgg = dynamic(() => import('@/components/EasterEgg'), { ssr: false });
const LiveTicker = dynamic(() => import('@/components/LiveTicker'), { ssr: false });
const ThemeWarp = dynamic(() => import('@/components/ThemeWarp'), { ssr: false });
const EngineeringGrid = dynamic(() => import('@/components/EngineeringGrid'), { ssr: false });
const PulseSync = dynamic(() => import('@/components/PulseSync'), { ssr: false });
const QuickConnect = dynamic(() => import('@/components/QuickConnect'), { ssr: false });
const CommandPalette = dynamic(() => import('@/components/CommandPalette'), { ssr: false });
const AIChatbot = dynamic(() => import('@/components/AIChatbot'), { ssr: false });

export default function DynamicClientComponents() {
  return (
    <>
      <PulseSync />
      <EngineeringGrid />
      <ThemeWarp />
      <CommandPalette />
      <BackToTop />
      <EasterEgg />
      <LiveTicker />
      <QuickConnect />
      <AIChatbot />
    </>
  );
}
