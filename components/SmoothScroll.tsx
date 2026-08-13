'use client';

import { ReactNode, useEffect, createContext, useContext, useState, useCallback, useRef } from 'react';
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
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;
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
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  const stopScroll = useCallback(() => {
    lenisRef.current?.stop();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }, []);

  const startScroll = useCallback(() => {
    lenisRef.current?.start();
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisInstance, stopScroll, startScroll }}>
      {children}
    </LenisContext.Provider>
  );
}

