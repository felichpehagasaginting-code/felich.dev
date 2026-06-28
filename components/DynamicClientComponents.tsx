'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const BackToTop = dynamic(() => import('@/components/BackToTop'), { ssr: false });
const EasterEgg = dynamic(() => import('@/components/EasterEgg'), { ssr: false });
const ThemeWarp = dynamic(() => import('@/components/ThemeWarp'), { ssr: false });
const EngineeringGrid = dynamic(() => import('@/components/EngineeringGrid'), { ssr: false });
const PulseSync = dynamic(() => import('@/components/PulseSync'), { ssr: false });
const QuickConnect = dynamic(() => import('@/components/QuickConnect'), { ssr: false });
const CommandPalette = dynamic(() => import('@/components/CommandPalette'), { ssr: false });
const AIChatbot = dynamic(() => import('@/components/AIChatbot'), { ssr: false });

export default function DynamicClientComponents() {
  const [shouldLoadChatbot, setShouldLoadChatbot] = useState(false);
  const [openChatbotOnLoad, setOpenChatbotOnLoad] = useState(false);

  useEffect(() => {
    const loadChatbot = () => setShouldLoadChatbot(true);
    const openChatbot = () => {
      setOpenChatbotOnLoad(true);
      setShouldLoadChatbot(true);
    };

    document.addEventListener('open-ai-chatbot', openChatbot);

    const idleId =
      'requestIdleCallback' in window
        ? window.requestIdleCallback(loadChatbot, { timeout: 8000 })
        : globalThis.setTimeout(loadChatbot, 8000);

    return () => {
      document.removeEventListener('open-ai-chatbot', openChatbot);
      if ('cancelIdleCallback' in window && typeof idleId === 'number') {
        window.cancelIdleCallback(idleId);
      } else {
        globalThis.clearTimeout(idleId);
      }
    };
  }, []);

  return (
    <>
      <PulseSync />
      <EngineeringGrid />
      <ThemeWarp />
      <CommandPalette />
      <BackToTop />
      <EasterEgg />
      <QuickConnect />
      {shouldLoadChatbot && <AIChatbot initiallyOpen={openChatbotOnLoad} />}
    </>
  );
}
