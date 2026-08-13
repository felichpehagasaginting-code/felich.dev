'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLenis } from './SmoothScroll';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

// Theme color palettes per specification
const THEME_PALETTES = {
  vanilla: {
    bg: '#EAF4CE',
    text: '#1A1A16',
    muted: '#55554E',
    brand: '#6B881F',
    name: 'VANILLA MATCHA',
  },
  noir: {
    bg: '#202025',
    text: '#F5F5F6',
    muted: '#A6A6AC',
    brand: '#CDCDD6',
    name: 'NOIR SILVER',
  },
  lavender: {
    bg: '#EFEBFA',
    text: '#232327',
    muted: '#5F5F66',
    brand: '#7C6FC4',
    name: 'LAVENDER VIOLET',
  },
};

export default function IntroAnimation() {
  const [isActive, setIsActive] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const themeLabelRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const { stopScroll, startScroll } = useLenis();
  const startScrollRef = useRef(startScroll);

  useEffect(() => {
    startScrollRef.current = startScroll;
  }, [startScroll]);

  useEffect(() => {
    // Lock body scroll while intro is active
    stopScroll();
    return () => {
      // Ensure scroll is restored when intro completes or unmounts
      startScrollRef.current();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [stopScroll]);

  const completeIntro = useCallback(() => {
    startScrollRef.current();
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    setIsActive(false);
  }, []);

  useGSAP(
    () => {
      if (!isActive) return;

      // Honor reduced motion settings
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        completeIntro();
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      const counterObj = { val: 0 };
      const tl = gsap.timeline({
        onComplete: completeIntro,
      });

      // Set initial colors: Vanilla Theme
      gsap.set(container, {
        backgroundColor: THEME_PALETTES.vanilla.bg,
        color: THEME_PALETTES.vanilla.text,
      });

      // ── Phase 1: Preloader & Theme Chromatic Journey (Vanilla → Noir → Lavender → Vanilla) ──
      tl.to(counterObj, {
        val: 100,
        duration: 3.2,
        ease: 'power1.inOut',
        onUpdate: () => {
          const current = Math.floor(counterObj.val);
          if (counterRef.current) {
            counterRef.current.innerText = `${current.toString().padStart(2, '0')}%`;
          }
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${current}%`;
          }

          // Update current theme label
          if (themeLabelRef.current) {
            if (current < 33) {
              themeLabelRef.current.innerText = THEME_PALETTES.vanilla.name;
            } else if (current < 66) {
              themeLabelRef.current.innerText = THEME_PALETTES.noir.name;
            } else if (current < 95) {
              themeLabelRef.current.innerText = THEME_PALETTES.lavender.name;
            } else {
              themeLabelRef.current.innerText = THEME_PALETTES.vanilla.name;
            }
          }
        },
      });

      // Transition to Noir Silver (at 33% mark ~ 1.0s)
      tl.to(
        container,
        {
          backgroundColor: THEME_PALETTES.noir.bg,
          color: THEME_PALETTES.noir.text,
          duration: 0.7,
          ease: 'sine.inOut',
        },
        1.0
      );

      // Transition to Lavender Violet (at 66% mark ~ 2.0s)
      tl.to(
        container,
        {
          backgroundColor: THEME_PALETTES.lavender.bg,
          color: THEME_PALETTES.lavender.text,
          duration: 0.7,
          ease: 'sine.inOut',
        },
        2.0
      );

      // Transition back to Vanilla (at 95% mark ~ 2.9s)
      tl.to(
        container,
        {
          backgroundColor: THEME_PALETTES.vanilla.bg,
          color: THEME_PALETTES.vanilla.text,
          duration: 0.6,
          ease: 'sine.inOut',
        },
        2.9
      );

      // ── Phase 2: Fade Out Preloader Stage ──
      tl.to('.intro-stage-preloader', {
        opacity: 0,
        y: -25,
        scale: 0.96,
        duration: 0.35,
        ease: 'power2.in',
      });

      // ── Phase 3: Reveal Center Name & Attributes (True Vertical Center) ──
      tl.set('.intro-stage-reveal', { opacity: 1 });

      tl.fromTo(
        '.intro-name-char',
        { y: 50, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.6,
          stagger: 0.03,
          ease: 'power4.out',
        },
        '-=0.05'
      );

      tl.fromTo(
        '.intro-role-badge',
        { scale: 0.9, opacity: 0, y: 15 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'back.out(1.6)',
        },
        '-=0.25'
      );

      tl.fromTo(
        '.intro-tags-item',
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
        },
        '-=0.2'
      );

      // Hold reveal for visual impact
      tl.to({}, { duration: 0.85 });

      // ── Phase 4: Fade Out Reveal & Slide Curtain Exit ──
      tl.to('.intro-stage-reveal', {
        opacity: 0,
        y: -35,
        duration: 0.45,
        ease: 'power3.in',
      });

      tl.to(
        container,
        {
          yPercent: -100,
          duration: 1.0,
          ease: 'power4.inOut',
        },
        '-=0.25'
      );
    },
    { scope: containerRef, dependencies: [isActive] }
  );

  if (!isActive) return null;

  const nameString = 'FELICH PEHAGASA GINTING';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] select-none overflow-hidden font-sans"
      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
    >
      {/* Background Subtle Noise Mesh & Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-current rounded-full blur-[180px] opacity-15" />
      </div>

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 p-6 md:p-12 z-20 flex justify-between items-center text-xs font-medium tracking-wider uppercase">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
          </span>
          <span className="font-semibold">FELICH.DEV // PORTFOLIO INTRO</span>
        </div>

        <button
          onClick={completeIntro}
          className="px-4 py-1.5 rounded-full border border-current/30 hover:border-current text-xs font-semibold uppercase tracking-wider bg-current/5 backdrop-blur-md transition-all duration-200 cursor-pointer pointer-events-auto"
        >
          SKIP INTRO →
        </button>
      </div>

      {/* ── Center Stage 1: Preloader (Centered 50% / 50%) ── */}
      <div className="intro-stage-preloader absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
        {/* Counter */}
        <div className="flex flex-col items-center">
          <span
            ref={counterRef}
            className="text-7xl md:text-9xl font-black tracking-tight leading-none"
          >
            00%
          </span>

          {/* Progress Bar Container */}
          <div className="w-64 md:w-80 h-1.5 bg-current/15 rounded-full overflow-hidden mt-6 relative">
            <div
              ref={progressBarRef}
              className="h-full bg-current rounded-full transition-all duration-75"
              style={{ width: '0%' }}
            />
          </div>
        </div>

        {/* Theme Indicator Message */}
        <div className="h-6 mt-5 flex items-center justify-center">
          <span
            ref={themeLabelRef}
            className="text-xs font-bold tracking-widest uppercase opacity-75 px-3 py-1 rounded-full border border-current/15 bg-current/5"
          >
            VANILLA MATCHA
          </span>
        </div>
      </div>

      {/* ── Center Stage 2: Name & Attributes Reveal (Centered 50% / 50%) ── */}
      <div className="intro-stage-reveal absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 pointer-events-none opacity-0 max-w-4xl mx-auto">
        {/* Staggered Name Reveal */}
        <div className="overflow-hidden py-1">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight flex flex-wrap justify-center gap-x-3 gap-y-1.5 leading-tight">
            {nameString.split(' ').map((word, wordIdx) => (
              <span key={wordIdx} className="inline-block whitespace-nowrap overflow-hidden">
                {word.split('').map((char, charIdx) => (
                  <span
                    key={charIdx}
                    className="intro-name-char inline-block"
                    style={{ opacity: 0 }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>

        {/* Role Badge */}
        <div className="intro-role-badge mt-4" style={{ opacity: 0 }}>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-current/20 bg-current/10 backdrop-blur-xl shadow-lg">
            <span className="text-xs sm:text-sm md:text-base font-bold tracking-wider uppercase">
              SOFTWARE & PRODUCT ENGINEER
            </span>
          </div>
        </div>

        {/* Focus Tags */}
        <div className="flex flex-wrap justify-center items-center gap-2.5 mt-5">
          {['APPLIED AI', 'INTELLIGENT SYSTEMS', 'AGRI-TECH'].map((tag, idx) => (
            <span
              key={idx}
              className="intro-tags-item opacity-0 text-[11px] font-semibold tracking-wider px-3.5 py-1.5 rounded-full border border-current/15 bg-current/5 uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 flex justify-between items-center text-xs font-medium uppercase tracking-wider opacity-70">
        <span>INDONESIA 🇮🇩</span>
        <span>FELICH.DEV</span>
      </div>
    </div>
  );
}
