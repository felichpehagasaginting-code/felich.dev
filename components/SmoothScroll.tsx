'use client';

import { useEffect, ReactNode, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis as a singleton
    if (!lenisRef.current) {
      lenisRef.current = new Lenis({
        lerp: 0.05,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        syncTouch: true, // Sync trackpad and touch devices
      });
    }

    const lenis = lenisRef.current;
    let tickerHandler: (time: number) => void;

    const setupGSAP = async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger');
        
        gsap.registerPlugin(ScrollTrigger);
        
        // Update ScrollTrigger on Lenis scroll
        lenis.on('scroll', ScrollTrigger.update);
        
        tickerHandler = (time: number) => {
          lenis.raf(time * 1000);
        };
        
        gsap.ticker.add(tickerHandler);
        gsap.ticker.lagSmoothing(0);

        // Force a refresh once everything is initialized
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);

      } catch (e) {
        console.warn('GSAP sync failed, falling back to internal RAF');
        const raf = (time: number) => {
          lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      }
    };

    setupGSAP();

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (tickerHandler) {
        import('gsap').then(({ gsap }) => {
          gsap.ticker.remove(tickerHandler);
        });
      }
    };
  }, []);

  return <>{children}</>;
}
