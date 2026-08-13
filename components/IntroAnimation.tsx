'use client';

import { useState, useRef, useEffect } from 'react';
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
    border: 'rgba(107, 136, 31, 0.25)',
    name: 'VANILLA MATCHA',
  },
  noir: {
    bg: '#202025',
    text: '#F5F5F6',
    muted: '#A6A6AC',
    brand: '#CDCDD6',
    border: 'rgba(212, 212, 220, 0.2)',
    name: 'NOIR SILVER',
  },
  lavender: {
    bg: '#EFEBFA',
    text: '#232327',
    muted: '#5F5F66',
    brand: '#7C6FC4',
    border: 'rgba(124, 111, 196, 0.3)',
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

  useEffect(() => {
    // Check if intro has already been played in this session
    const hasPlayed = sessionStorage.getItem('felich_intro_played');
    if (hasPlayed === 'true') {
      setIsActive(false);
      return;
    }

    // Lock body scroll while intro is active
    stopScroll();
  }, [stopScroll]);

  const completeIntro = () => {
    sessionStorage.setItem('felich_intro_played', 'true');
    startScroll();
    setIsActive(false);
  };

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

      // ── Phase 2: Fade Out Preloader Elements ──
      tl.to(['.intro-counter-wrapper', '.intro-theme-indicator'], {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: 'power3.in',
      });

      // ── Phase 3: Name & Role Reveal ──
      tl.fromTo(
        '.intro-name-char',
        { y: 70, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.035,
          ease: 'power4.out',
        },
        '-=0.1'
      );

      tl.fromTo(
        '.intro-role-badge',
        { scale: 0.88, opacity: 0, y: 15 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'back.out(1.7)',
        },
        '-=0.3'
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

      // Hold briefly for visual impact
      tl.to({}, { duration: 0.9 });

      // ── Phase 4: Curtain Slide Exit ──
      tl.to('.intro-content', {
        opacity: 0,
        y: -40,
        duration: 0.5,
        ease: 'power3.in',
      });

      tl.to(
        container,
        {
          yPercent: -100,
          duration: 1.1,
          ease: 'power4.inOut',
        },
        '-=0.3'
      );
    },
    { scope: containerRef, dependencies: [isActive] }
  );

  if (!isActive) return null;

  const nameString = 'FELICH PEHAGASA GINTING';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col justify-between p-8 md:p-16 select-none overflow-hidden font-sans"
      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
    >
      {/* Background Subtle Noise Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-15">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-current rounded-full blur-[160px] opacity-20 animate-blob-1" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 flex justify-between items-center text-xs font-medium tracking-wider uppercase">
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

      {/* Main Center Content */}
      <div className="intro-content relative z-10 my-auto flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        {/* Phase 1: Counter Wrapper */}
        <div className="intro-counter-wrapper mb-8 flex flex-col items-center">
          <span
            ref={counterRef}
            className="text-7xl md:text-9xl font-black tracking-tight"
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

        {/* Phase 1: Theme Indicator Message */}
        <div className="intro-theme-indicator h-6 mb-4">
          <span
            ref={themeLabelRef}
            className="text-xs font-bold tracking-widest uppercase opacity-70"
          >
            VANILLA MATCHA
          </span>
        </div>

        {/* Phase 2: Staggered Name Reveal */}
        <div className="overflow-hidden py-2 my-2">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight flex flex-wrap justify-center gap-x-3 gap-y-1">
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

        {/* Phase 2: Role Badge */}
        <div className="intro-role-badge mt-3" style={{ opacity: 0 }}>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-current/25 bg-current/10 backdrop-blur-xl shadow-xl">
            <span className="text-sm md:text-base font-bold tracking-wider uppercase">
              SOFTWARE & PRODUCT ENGINEER
            </span>
          </div>
        </div>

        {/* Phase 2: Focus Tags */}
        <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
          {['APPLIED AI', 'INTELLIGENT SYSTEMS', 'AGRI-TECH'].map((tag, idx) => (
            <span
              key={idx}
              className="intro-tags-item opacity-0 text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full border border-current/20 bg-current/5 uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info (Clean Branding - No Tech Stack Credits) */}
      <div className="relative z-10 flex justify-between items-center text-xs font-medium uppercase tracking-wider opacity-70">
        <span>INDONESIA 🇮🇩</span>
        <span>FELICH.DEV</span>
      </div>
    </div>
  );
}
