'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLenis } from './SmoothScroll';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

export default function IntroAnimation() {
  const [isActive, setIsActive] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const { stopScroll, startScroll } = useLenis();

  useEffect(() => {
    // Check if intro has already been played in this session
    const hasPlayed = sessionStorage.getItem('felich_intro_played');
    if (hasPlayed === 'true') {
      setIsActive(false);
      return;
    }

    // Stop scroll while intro is playing
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

      // Honor reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        completeIntro();
        return;
      }

      const counterObj = { val: 0 };
      const tl = gsap.timeline({
        onComplete: completeIntro,
      });

      // Phase 1: Counter Progress (0% to 100%)
      tl.to(counterObj, {
        val: 100,
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          const current = Math.floor(counterObj.val);
          if (counterRef.current) {
            counterRef.current.innerText = `${current.toString().padStart(2, '0')}%`;
          }
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${current}%`;
          }
          if (statusRef.current) {
            if (current < 30) {
              statusRef.current.innerText = 'INITIALIZING SYSTEM CORE...';
            } else if (current < 70) {
              statusRef.current.innerText = 'LOADING AI & APPLIED MODELS...';
            } else if (current < 99) {
              statusRef.current.innerText = 'OPTIMIZING PERFORMANCE...';
            } else {
              statusRef.current.innerText = 'SYSTEM READY ✓';
            }
          }
        },
      });

      // Phase 2: Fade Out Counter & Status
      tl.to(['.intro-counter-wrapper', '.intro-status-wrapper'], {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: 'power3.in',
      });

      // Phase 3: Name & Title Reveal
      tl.fromTo(
        '.intro-name-char',
        { y: 80, opacity: 0, filter: 'blur(10px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.04,
          ease: 'power4.out',
        },
        '-=0.1'
      );

      tl.fromTo(
        '.intro-role-badge',
        { scale: 0.85, opacity: 0, y: 20 },
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
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '-=0.2'
      );

      // Brief hold on reveal
      tl.to({}, { duration: 0.8 });

      // Phase 4: Curtain Slide Exit
      tl.to('.intro-content', {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: 'power3.in',
      });

      tl.to(
        containerRef.current,
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
      className="fixed inset-0 z-[99999] flex flex-col justify-between p-8 md:p-16 bg-[#070708] text-[var(--text-primary)] select-none overflow-hidden"
    >
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--brand)] rounded-full blur-[140px] animate-blob-1" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[140px] animate-blob-2" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 flex justify-between items-center text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand)]" />
          </span>
          <span>FELICH.DEV // PORTFOLIO INTRO</span>
        </div>

        <button
          onClick={completeIntro}
          className="px-4 py-1.5 rounded-full border border-[var(--border-default)] hover:border-[var(--brand)] text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--glass-bg)] backdrop-blur-md transition-all duration-200 cursor-pointer pointer-events-auto"
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
            className="text-7xl md:text-9xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] via-[var(--brand)] to-emerald-400"
          >
            00%
          </span>
          {/* Progress Bar Container */}
          <div className="w-64 md:w-80 h-1 bg-[var(--border-default)] rounded-full overflow-hidden mt-6 relative">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-[var(--brand)] to-emerald-400 rounded-full transition-all duration-75"
              style={{ width: '0%' }}
            />
          </div>
        </div>

        {/* Phase 1: Status Message */}
        <div className="intro-status-wrapper h-6">
          <p
            ref={statusRef}
            className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase"
          >
            INITIALIZING SYSTEM CORE...
          </p>
        </div>

        {/* Phase 2: Staggered Name Reveal */}
        <div className="overflow-hidden py-2 my-4">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-display font-black tracking-tight flex flex-wrap justify-center gap-x-3 gap-y-1">
            {nameString.split(' ').map((word, wordIdx) => (
              <span key={wordIdx} className="inline-block whitespace-nowrap overflow-hidden">
                {word.split('').map((char, charIdx) => (
                  <span
                    key={charIdx}
                    className="intro-name-char inline-block text-[var(--text-primary)]"
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
        <div className="intro-role-badge mt-4" style={{ opacity: 0 }}>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--brand)]/30 bg-[var(--brand-bg)] backdrop-blur-xl shadow-2xl">
            <span className="text-sm md:text-base font-semibold tracking-wide text-[var(--brand)]">
              SOFTWARE & PRODUCT ENGINEER
            </span>
          </div>
        </div>

        {/* Phase 2: Tech Tags */}
        <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
          {['APPLIED AI', 'INTELLIGENT SYSTEMS', 'AGRI-TECH'].map((tag, idx) => (
            <span
              key={idx}
              className="intro-tags-item opacity-0 text-[10px] font-mono tracking-widest px-3 py-1 rounded border border-[var(--border-default)] text-[var(--text-muted)] bg-[var(--bg-surface)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
        <span>INDONESIA 🇮🇩</span>
        <span>CRAFTED WITH GSAP + LENIS</span>
      </div>
    </div>
  );
}
