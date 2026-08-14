'use client';

import React, { useRef, useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import TypingAnimation from '@/components/TypingAnimation';
import SpotifyWidget from '@/components/SpotifyWidget';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowRight, Terminal } from 'lucide-react';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

const Hero3DWrapper = dynamic(() => import('@/components/Hero3DWrapper'), { ssr: false });

const GLYPHS = '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function Hero() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);
  const nameScrambleRef = useRef<HTMLSpanElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  const [localTime, setLocalTime] = useState('');
  const timeFmt = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
    []
  );

  const updateTime = useCallback(() => setLocalTime(timeFmt.format(new Date())), [timeFmt]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 1. Kinetic Staggered Entrance Timeline
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.from('.hero-badge-pill', {
          y: -20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
        })
          .from(
            '.hero-title-line',
            {
              y: 35,
              opacity: 0,
              rotateX: 45,
              transformOrigin: '0% 50% -50',
              duration: 0.8,
            },
            '-=0.3'
          )
          .from(
            '.hero-typing-wrap',
            {
              y: 20,
              opacity: 0,
              duration: 0.6,
            },
            '-=0.4'
          )
          .from(
            '.hero-status-row > *',
            {
              scale: 0.9,
              opacity: 0,
              duration: 0.5,
              stagger: 0.06,
            },
            '-=0.3'
          )
          .from(
            '.hero-bio-p',
            {
              y: 15,
              opacity: 0,
              duration: 0.6,
              stagger: 0.08,
            },
            '-=0.3'
          )
          .from(
            '.hero-cta-group',
            {
              y: 20,
              opacity: 0,
              duration: 0.5,
            },
            '-=0.2'
          );

        // 2. Character Scramble Effect on "Felich"
        const targetText = 'Felich';
        let frame = 0;
        const totalFrames = 25;

        const scrambleInterval = setInterval(() => {
          if (!nameScrambleRef.current) return;
          frame++;
          const progress = frame / totalFrames;
          const chars = targetText
            .split('')
            .map((char, index) => {
              if (index / targetText.length < progress) {
                return char;
              }
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join('');

          nameScrambleRef.current.innerText = chars;

          if (frame >= totalFrames) {
            clearInterval(scrambleInterval);
            if (nameScrambleRef.current) nameScrambleRef.current.innerText = targetText;
          }
        }, 35);

        // 3. Fluid Mouse Follower Aura & Magnetic Button Gravity
        const aura = auraRef.current;
        const ctaBtn = ctaBtnRef.current;

        if (aura && heroRef.current) {
          const quickAuraX = gsap.quickTo(aura, 'x', { duration: 0.6, ease: 'power2.out' });
          const quickAuraY = gsap.quickTo(aura, 'y', { duration: 0.6, ease: 'power2.out' });

          const handleMouseMove = (e: MouseEvent) => {
            const rect = heroRef.current?.getBoundingClientRect();
            if (!rect) return;
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            quickAuraX(x - 120);
            quickAuraY(y - 120);
          };

          heroRef.current.addEventListener('mousemove', handleMouseMove);
        }

        if (ctaBtn) {
          const quickBtnX = gsap.quickTo(ctaBtn, 'x', { duration: 0.3, ease: 'power2.out' });
          const quickBtnY = gsap.quickTo(ctaBtn, 'y', { duration: 0.3, ease: 'power2.out' });

          const handleBtnMove = (e: MouseEvent) => {
            const rect = ctaBtn.getBoundingClientRect();
            const relX = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
            const relY = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
            quickBtnX(relX);
            quickBtnY(relY);
          };

          const handleBtnLeave = () => {
            quickBtnX(0);
            quickBtnY(0);
          };

          ctaBtn.addEventListener('mousemove', handleBtnMove);
          ctaBtn.addEventListener('mouseleave', handleBtnLeave);
        }
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        if (nameScrambleRef.current) nameScrambleRef.current.innerText = 'Felich';
      });
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      className="mb-12 flex flex-col md:flex-row items-center gap-12 md:gap-8 overflow-hidden relative p-1"
    >
      {/* Fluid Interactive Mouse Glow Aura */}
      <div
        ref={auraRef}
        className="hidden md:block absolute w-60 h-60 rounded-full bg-[var(--brand)]/15 blur-3xl pointer-events-none -z-10 transition-opacity"
        aria-hidden="true"
      />

      <div className="flex-1 relative z-20 space-y-6">
        {/* Availability Badge */}
        <div className="hero-badge-pill inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] text-xs font-mono text-[var(--text-muted)] shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]" />
          </span>
          <span>Available for High-Impact Projects</span>
        </div>

        {/* Kinetic Hero Heading */}
        <h1 className="hero-title-line text-4xl md:text-6xl font-display font-bold tracking-tight leading-[1.1] text-[var(--text-primary)]">
          {t('hi_im')}{' '}
          <span
            ref={nameScrambleRef}
            className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand)] via-purple-400 to-cyan-400 inline-block font-mono tracking-tighter"
          >
            Felich
          </span>
        </h1>

        {/* Dynamic Typing Title */}
        <div className="hero-typing-wrap text-lg md:text-xl text-[var(--text-muted)] font-medium min-h-[3rem] md:min-h-[2rem]">
          <TypingAnimation
            texts={[
              t('hero_typing_se'),
              t('hero_typing_pe'),
              t('hero_typing_ai'),
              t('hero_typing_devops'),
              t('hero_typing_fs'),
            ]}
          />
        </div>

        {/* Location & Status Chips */}
        <div className="hero-status-row flex flex-wrap items-center gap-y-4 gap-x-6 text-sm text-[var(--text-muted)]">
          <div
            className="flex items-center gap-2 group cursor-help relative"
            onMouseEnter={updateTime}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand)]" />
            </span>
            <span>{t('location')}</span>

            {/* Time Tooltip */}
            <div className="absolute -top-10 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--text-primary)] text-[var(--bg-base)] px-3 py-1 rounded-lg text-xs font-mono shadow-xl whitespace-nowrap pointer-events-none z-50">
              {t('location_tooltip')}: {localTime} (WIB)
            </div>
          </div>

          <div className="flex items-center gap-2 group cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]" />
            </span>
            <span>{t('onsite')}</span>
          </div>

          <div className="w-full sm:w-auto">
            <SpotifyWidget />
          </div>
        </div>

        {/* Bio Paragraphs */}
        <div className="space-y-3 text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
          <p className="hero-bio-p">{t('hero_para_1')}</p>
          <p className="hero-bio-p">{t('hero_para_2')}</p>
          <p className="hero-bio-p">{t('hero_para_3')}</p>
        </div>

        {/* Magnetic Interactive CTA Buttons */}
        <div className="hero-cta-group pt-2 flex flex-wrap items-center gap-3">
          <Link
            ref={ctaBtnRef}
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--brand)] text-[var(--brand-contrast)] font-semibold text-xs hover:brightness-110 shadow-md transition-all cursor-pointer select-none"
          >
            <span>Explore Flagship Work</span>
            <ArrowRight size={14} />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] font-semibold text-xs hover:border-[var(--brand)] transition-all cursor-pointer"
          >
            <Sparkles size={14} className="text-[var(--brand)]" />
            <span>{t('lets_connect')}</span>
          </Link>
        </div>
      </div>

      <div className="w-full md:w-1/3 flex-shrink-0 pointer-events-auto z-10 hover:cursor-grab active:cursor-grabbing interactive-element">
        <Hero3DWrapper />
      </div>
    </section>
  );
}