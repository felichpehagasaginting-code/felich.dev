'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const BackToTop = dynamic(() => import('@/components/BackToTop'), { ssr: false });
const EngineeringGrid = dynamic(() => import('@/components/EngineeringGrid'), { ssr: false });
const PulseSync = dynamic(() => import('@/components/PulseSync'), { ssr: false });
const QuickConnect = dynamic(() => import('@/components/QuickConnect'), { ssr: false });
const CommandPalette = dynamic(() => import('@/components/CommandPalette'), { ssr: false });
const AIChatbot = dynamic(() => import('@/components/AIChatbot'), { ssr: false });

export default function DynamicClientComponents() {
  const [shouldLoadChatbot, setShouldLoadChatbot] = useState(false);
  const [openChatbotOnLoad, setOpenChatbotOnLoad] = useState(false);
  const [mountedSecondary, setMountedSecondary] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }

    const loadChatbot = () => setShouldLoadChatbot(true);
    const openChatbot = () => {
      setOpenChatbotOnLoad(true);
      setShouldLoadChatbot(true);
    };

    document.addEventListener('open-ai-chatbot', openChatbot);

    const idleId =
      'requestIdleCallback' in window
        ? window.requestIdleCallback(() => {
            setMountedSecondary(true);
            loadChatbot();
          }, { timeout: 1500 })
        : globalThis.setTimeout(() => {
            setMountedSecondary(true);
            loadChatbot();
          }, 1000);

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
      <CommandPalette />
      <BackToTop />
      <QuickConnect />
      {mountedSecondary && (
        <>
          <PulseSync />
          <EngineeringGrid />
        </>
      )}
      {shouldLoadChatbot && <AIChatbot initiallyOpen={openChatbotOnLoad} />}
    </>
  );
}