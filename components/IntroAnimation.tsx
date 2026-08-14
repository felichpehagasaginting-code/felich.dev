'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLenis } from './SmoothScroll';
import { useLayoutStore } from '@/lib/store';
import { introAudio } from '@/lib/introAudio';
import { Volume2, VolumeX } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

// Theme color palettes
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
  violet: {
    bg: '#EFEBFA',
    text: '#232327',
    muted: '#5F5F66',
    brand: '#7C6FC4',
    name: 'LAVENDER VIOLET',
  },
};

const GREETINGS = ['HELLO', 'HALO', '你好', 'GUTEN TAG'];

export default function IntroAnimation() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const themeLabelRef = useRef<HTMLSpanElement>(null);
  const terminalLogRef = useRef<HTMLSpanElement>(null);
  const greetingRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liquidPathRef = useRef<SVGPathElement>(null);

  const { theme } = useLayoutStore();
  const { stopScroll, startScroll } = useLenis();
  const startScrollRef = useRef(startScroll);

  useEffect(() => {
    startScrollRef.current = startScroll;
  }, [startScroll]);

  // Session storage check & replay event listener
  useEffect(() => {
    setIsAudioMuted(introAudio.isMuted());

    // Check if prefers-reduced-motion is active
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsActive(false);
      return;
    }

    try {
      const played = sessionStorage.getItem('felich_intro_played');
      if (!played) {
        setIsActive(true);
      }
    } catch {
      setIsActive(true);
    }

    const handleReplay = () => {
      setIsActive(true);
    };

    window.addEventListener('replay-intro', handleReplay);
    return () => window.removeEventListener('replay-intro', handleReplay);
  }, []);

  useEffect(() => {
    if (!isActive) return;
    // Lock body scroll while intro is active
    stopScroll();
    return () => {
      startScrollRef.current();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isActive, stopScroll]);

  const completeIntro = useCallback(() => {
    try {
      sessionStorage.setItem('felich_intro_played', 'true');
    } catch {}
    startScrollRef.current();
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    setIsActive(false);
  }, []);

  const handleToggleSound = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = introAudio.toggleMute();
    setIsAudioMuted(muted);
    if (!muted) {
      introAudio.playTick(1.0);
    }
  }, []);

  // Ambient interactive particle dust
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches[0]) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        mouse.targetX = (e as MouseEvent).clientX;
        mouse.targetY = (e as MouseEvent).clientY;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove);

    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= (dx / dist) * 1.5;
          p.y -= (dy / dist) * 1.5;
        }

        ctx.fillStyle = `rgba(200, 200, 210, ${p.alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
    };
  }, [isActive]);

  // Main GSAP animation timeline
  useGSAP(
    () => {
      if (!isActive) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        completeIntro();
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      const isMobile = window.innerWidth < 768;
      const targetThemeKey = (theme === 'noir' || theme === 'violet' || theme === 'vanilla') ? theme : 'noir';
      const targetPalette = THEME_PALETTES[targetThemeKey] || THEME_PALETTES.noir;

      const counterObj = { val: 0 };
      let lastTickStep = 0;

      const tl = gsap.timeline({
        onComplete: completeIntro,
      });

      if (isMobile) {
        tl.timeScale(1.35); // Snappier execution on mobile
      }

      // Initial state: Vanilla
      gsap.set(container, {
        backgroundColor: THEME_PALETTES.vanilla.bg,
        color: THEME_PALETTES.vanilla.text,
      });

      // ── Phase 1: Preloader Progress & Chromatic Journey ──
      tl.to(counterObj, {
        val: 100,
        duration: 3.0,
        ease: 'power1.inOut',
        onUpdate: () => {
          const current = Math.floor(counterObj.val);
          if (counterRef.current) {
            counterRef.current.innerText = `${current.toString().padStart(2, '0')}%`;
          }
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${current}%`;
          }

          // Trigger sound tick every 5%
          if (current - lastTickStep >= 5) {
            lastTickStep = current;
            introAudio.playTick(current / 100);
          }

          // Update theme indicator & terminal log
          if (themeLabelRef.current) {
            if (current < 30) {
              themeLabelRef.current.innerText = THEME_PALETTES.vanilla.name;
            } else if (current < 65) {
              themeLabelRef.current.innerText = THEME_PALETTES.noir.name;
            } else if (current < 90) {
              themeLabelRef.current.innerText = THEME_PALETTES.violet.name;
            } else {
              themeLabelRef.current.innerText = targetPalette.name;
            }
          }

          if (terminalLogRef.current) {
            if (current < 25) {
              terminalLogRef.current.innerText = '> initializing neural pipelines & runtime...';
            } else if (current < 55) {
              terminalLogRef.current.innerText = '> compiling fintech architecture & WebGL shaders...';
            } else if (current < 80) {
              terminalLogRef.current.innerText = '> mounting offline service worker & security protocols...';
            } else {
              terminalLogRef.current.innerText = '> identity verified: Felich Pehagasa Ginting';
            }
          }
        },
      });

      // Chromatic morph 1: Noir (at 30%)
      tl.to(
        container,
        {
          backgroundColor: THEME_PALETTES.noir.bg,
          color: THEME_PALETTES.noir.text,
          duration: 0.6,
          ease: 'sine.inOut',
        },
        0.9
      );

      // Chromatic morph 2: Violet (at 60%)
      tl.to(
        container,
        {
          backgroundColor: THEME_PALETTES.violet.bg,
          color: THEME_PALETTES.violet.text,
          duration: 0.6,
          ease: 'sine.inOut',
        },
        1.8
      );

      // Chromatic morph 3: Target Active User Theme (at 88%)
      tl.to(
        container,
        {
          backgroundColor: targetPalette.bg,
          color: targetPalette.text,
          duration: 0.5,
          ease: 'sine.inOut',
        },
        2.6
      );

      // ── Phase 2: Fade Out Preloader Stage ──
      tl.to('.intro-stage-preloader', {
        opacity: 0,
        y: -25,
        scale: 0.96,
        duration: 0.35,
        ease: 'power2.in',
      });

      // ── Phase 3: Multilingual Greeting Cycle & Center Reveal ──
      tl.set('.intro-stage-reveal', { opacity: 1 });

      // Greeting roll
      GREETINGS.forEach((greet, idx) => {
        tl.to(
          greetingRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.15,
            onStart: () => {
              if (greetingRef.current) greetingRef.current.innerText = greet;
            },
          },
          `-=0.05`
        ).to(
          greetingRef.current,
          {
            opacity: 0,
            y: -8,
            duration: 0.12,
          },
          `+=${idx === GREETINGS.length - 1 ? 0.05 : 0.1}`
        );
      });

      // Name characters stagger reveal
      tl.call(() => introAudio.playWhoosh());

      tl.fromTo(
        '.intro-name-char',
        { y: 45, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.55,
          stagger: 0.025,
          ease: 'power4.out',
        },
        '-=0.1'
      );

      tl.fromTo(
        '.intro-role-badge',
        { scale: 0.9, opacity: 0, y: 15 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'back.out(1.5)',
        },
        '-=0.2'
      );

      tl.fromTo(
        '.intro-tags-item',
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.06,
          ease: 'power2.out',
        },
        '-=0.15'
      );

      // Hold reveal for visual impact
      tl.to({}, { duration: 0.75 });

      // ── Phase 4: Fade Out Reveal & Liquid SVG Curtain Exit ──
      tl.call(() => introAudio.playChime());

      tl.to('.intro-stage-reveal', {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: 'power3.in',
      });

      // Morph liquid curve path during exit
      if (liquidPathRef.current) {
        tl.to(
          liquidPathRef.current,
          {
            attr: { d: 'M 0 0 L 100 0 L 100 100 Q 50 20 0 100 Z' },
            duration: 0.85,
            ease: 'power2.in',
          },
          '-=0.2'
        );
      }

      tl.to(
        container,
        {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut',
        },
        '-=0.75'
      );
    },
    { scope: containerRef, dependencies: [isActive, theme] }
  );

  if (!isActive) return null;

  const nameString = 'FELICH PEHAGASA GINTING';

  return (
    <div
      ref={containerRef}
      onClick={completeIntro}
      role="dialog"
      aria-label="Portfolio Introduction Animation"
      className="fixed inset-0 z-[99999] select-none overflow-hidden font-sans cursor-pointer"
      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
    >
      {/* Interactive Particle Dust Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-60" />

      {/* Background Subtle Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-current rounded-full blur-[180px] opacity-15" />
      </div>

      {/* Liquid Wave Curtain Bottom Edge */}
      <div className="absolute -bottom-[60px] left-0 right-0 h-[60px] pointer-events-none z-10 overflow-visible text-current">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full fill-current"
        >
          <path
            ref={liquidPathRef}
            d="M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z"
          />
        </svg>
      </div>

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 p-6 md:p-12 z-20 flex justify-between items-center text-xs font-medium tracking-wider uppercase">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
          </span>
          <span className="font-semibold text-[11px] sm:text-xs">FELICH.DEV // PORTFOLIO INTRO</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio toggle button */}
          <button
            onClick={handleToggleSound}
            aria-label={isAudioMuted ? 'Turn on sound' : 'Mute sound'}
            className="p-2 rounded-full border border-current/30 hover:border-current text-xs bg-current/5 backdrop-blur-md transition-all duration-200 cursor-pointer pointer-events-auto flex items-center gap-1.5"
            title={isAudioMuted ? 'Enable Sound' : 'Mute Sound'}
          >
            {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span className="hidden sm:inline text-[10px] font-mono">{isAudioMuted ? 'MUTED' : 'AUDIO ON'}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              completeIntro();
            }}
            className="px-4 py-1.5 rounded-full border border-current/30 hover:border-current text-xs font-semibold uppercase tracking-wider bg-current/5 backdrop-blur-md transition-all duration-200 cursor-pointer pointer-events-auto"
          >
            SKIP INTRO →
          </button>
        </div>
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

        {/* Terminal Sub-logger Status */}
        <div className="h-5 mt-4 flex items-center justify-center max-w-md px-4">
          <span
            ref={terminalLogRef}
            className="text-[11px] font-mono opacity-60 tracking-tight truncate"
          >
            &gt; initializing neural pipelines &amp; runtime...
          </span>
          <span className="inline-block w-1.5 h-3 bg-current ml-1 animate-pulse opacity-70" />
        </div>
      </div>

      {/* ── Center Stage 2: Name & Attributes Reveal (Centered 50% / 50%) ── */}
      <div className="intro-stage-reveal absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 pointer-events-none opacity-0 max-w-4xl mx-auto">
        {/* Multilingual Greeting Badge */}
        <div className="h-7 mb-2 flex items-center justify-center">
          <span
            ref={greetingRef}
            className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase opacity-0 px-3 py-0.5 rounded-full border border-current/20 bg-current/10"
          >
            HELLO
          </span>
        </div>

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
              SOFTWARE &amp; PRODUCT ENGINEER
            </span>
          </div>
        </div>

        {/* Focus Tags */}
        <div className="flex flex-wrap justify-center items-center gap-2.5 mt-5">
          {['AI ENGINEERING', 'FINTECH ARCHITECTURE', 'AGRI-TECH'].map((tag, idx) => (
            <span
              key={idx}
              className="intro-tags-item opacity-0 text-[11px] font-semibold tracking-wider px-3.5 py-1.5 rounded-full border border-current/15 bg-current/5 uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info & Tap to Skip Hint */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 flex justify-between items-center text-xs font-medium uppercase tracking-wider opacity-70">
        <span>INDONESIA 🇮🇩</span>
        <span className="text-[10px] font-mono tracking-normal lowercase opacity-60 hidden sm:inline">tap anywhere to skip</span>
        <span>FELICH.DEV</span>
      </div>
    </div>
  );
}
