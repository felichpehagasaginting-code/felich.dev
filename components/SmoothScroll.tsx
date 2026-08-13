'use client';

import { ReactNode, useEffect, createContext, useContext, useState, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface LenisContextType {
  lenis: Lenis | null;
  stopScroll: () => void;
  startScroll: () => void;
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  stopScroll: () => {},
  startScroll: () => {},
});

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    setLenisInstance(lenis);

    lenis.on('scroll', ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  const stopScroll = useCallback(() => {
    lenisInstance?.stop();
    document.body.style.overflow = 'hidden';
  }, [lenisInstance]);

  const startScroll = useCallback(() => {
    lenisInstance?.start();
    document.body.style.overflow = '';
  }, [lenisInstance]);

  return (
    <LenisContext.Provider value={{ lenis: lenisInstance, stopScroll, startScroll }}>
      {children}
    </LenisContext.Provider>
  );
}

