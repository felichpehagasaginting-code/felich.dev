'use client';

import React, { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

interface GlitchNameProps {
  text?: string;
  className?: string;
}

const GLYPHS = '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// 4-Directional particle definitions
const PARTICLES_DOWN = [
  { symbol: '01', left: '15%', delay: '0s', duration: '2.8s', size: '10px' },
  { symbol: '•', left: '65%', delay: '1.2s', duration: '3.4s', size: '8px' },
  { symbol: '↓', left: '85%', delay: '0.6s', duration: '2.5s', size: '11px' },
];

const PARTICLES_UP = [
  { symbol: '{ }', left: '25%', delay: '0.4s', duration: '3.2s', size: '10px' },
  { symbol: 'λ', left: '45%', delay: '1.6s', duration: '2.6s', size: '11px' },
  { symbol: '↑', left: '75%', delay: '0.9s', duration: '3.0s', size: '12px' },
];

const PARTICLES_RIGHT = [
  { symbol: '</>', top: '20%', delay: '0.2s', duration: '3.6s', size: '10px' },
  { symbol: '→', top: '70%', delay: '1.8s', duration: '2.9s', size: '12px' },
  { symbol: '+', top: '45%', delay: '1.0s', duration: '3.3s', size: '11px' },
];

const PARTICLES_LEFT = [
  { symbol: '*', top: '30%', delay: '0.5s', duration: '3.1s', size: '12px' },
  { symbol: '←', top: '80%', delay: '1.4s', duration: '2.7s', size: '12px' },
  { symbol: '#', top: '15%', delay: '2.1s', duration: '3.5s', size: '10px' },
];

export default function GlitchName({ text = 'Felich', className = '' }: GlitchNameProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState(text);
  const [glitchPhase, setGlitchPhase] = useState<'idle' | 'pre-glitch' | 'glitch' | 'resolving'>('idle');

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayText(text);
      setGlitchPhase('idle');
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    if (glitchPhase === 'idle') {
      setDisplayText(text);
      timeoutId = setTimeout(() => {
        setGlitchPhase('pre-glitch');
      }, 2800);
    } else if (glitchPhase === 'pre-glitch') {
      // Phase 2: Pre-glitch preparation (micro-jitter on specific glyphs)
      let ticks = 0;
      const maxTicks = 6; // ~210ms (6 * 35ms)

      intervalId = setInterval(() => {
        ticks++;
        const chars = text.split('');
        const scrambled = chars.map((char) => {
          if (char === ' ') return ' ';
          return Math.random() < 0.35
            ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            : char;
        }).join('');

        setDisplayText(scrambled);

        if (ticks >= maxTicks) {
          clearInterval(intervalId);
          setGlitchPhase('glitch');
        }
      }, 35);
    } else if (glitchPhase === 'glitch') {
      // Phase 3: Peak Matrix Flurry
      let ticks = 0;
      const maxTicks = 8; // ~280ms (8 * 35ms)

      intervalId = setInterval(() => {
        ticks++;
        let scrambled = '';
        for (let i = 0; i < text.length; i++) {
          scrambled += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }

        setDisplayText(scrambled);

        if (ticks >= maxTicks) {
          clearInterval(intervalId);
          setGlitchPhase('resolving');
        }
      }, 35);
    } else if (glitchPhase === 'resolving') {
      // Phase 4: Left-to-right character lock-in resolution back to target text
      let lockedIndex = 0;
      const targetLen = text.length;

      intervalId = setInterval(() => {
        lockedIndex++;

        let resolved = text.slice(0, Math.min(lockedIndex, targetLen));
        for (let i = lockedIndex; i < targetLen; i++) {
          resolved += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }

        setDisplayText(resolved);

        if (lockedIndex >= targetLen) {
          clearInterval(intervalId);
          setDisplayText(text);
          setGlitchPhase('idle');
        }
      }, 35);
    }

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [glitchPhase, text, shouldReduceMotion]);

  const isGlitching = glitchPhase === 'pre-glitch' || glitchPhase === 'glitch';

  return (
    <span className={`relative inline-block select-none overflow-visible align-baseline px-2 ${className}`}>
      {/* ── 4-Way Omnidirectional Floating Particles Aura ───────────────── */}
      {!shouldReduceMotion && (
        <span className="pointer-events-none absolute -inset-x-8 -inset-y-6 overflow-visible z-0 select-none block" aria-hidden="true">
          {/* Top to Bottom (Down) */}
          {PARTICLES_DOWN.map((p, i) => (
            <span
              key={`down-${i}`}
              className="absolute font-mono text-[var(--brand)] opacity-60 font-semibold will-change-transform animate-fly-down"
              style={{
                left: p.left,
                fontSize: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            >
              {p.symbol}
            </span>
          ))}

          {/* Bottom to Top (Up) */}
          {PARTICLES_UP.map((p, i) => (
            <span
              key={`up-${i}`}
              className="absolute font-mono text-[var(--brand)] opacity-60 font-semibold will-change-transform animate-fly-up"
              style={{
                left: p.left,
                fontSize: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            >
              {p.symbol}
            </span>
          ))}

          {/* Left to Right (Right) */}
          {PARTICLES_RIGHT.map((p, i) => (
            <span
              key={`right-${i}`}
              className="absolute font-mono text-black dark:text-[var(--brand)] opacity-50 font-semibold will-change-transform animate-fly-right"
              style={{
                top: p.top,
                fontSize: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            >
              {p.symbol}
            </span>
          ))}

          {/* Right to Left (Left) */}
          {PARTICLES_LEFT.map((p, i) => (
            <span
              key={`left-${i}`}
              className="absolute font-mono text-black dark:text-[var(--brand)] opacity-50 font-semibold will-change-transform animate-fly-left"
              style={{
                top: p.top,
                fontSize: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            >
              {p.symbol}
            </span>
          ))}
        </span>
      )}

      {/* ── Cybernetic Black Glitch Text ────────────────────────────────── */}
      <span className="relative z-10 inline-block">
        {/* Base Solid Black Text */}
        <span
          className={`font-mono font-black text-black tracking-tighter inline-block relative drop-shadow-[0_2px_10px_rgba(0,0,0,0.15)] transition-transform duration-75 ${
            isGlitching ? 'scale-[1.02] [text-shadow:-1.5px_0_#00ffff,1.5px_0_#ff0055]' : ''
          }`}
        >
          {displayText}
        </span>

        {/* Glitch Layer 1 (Cyan / Red shift) */}
        {!shouldReduceMotion && isGlitching && (
          <span
            aria-hidden="true"
            data-text={displayText}
            className="absolute inset-0 font-mono font-black text-black select-none pointer-events-none tracking-tighter glitch-layer-1 opacity-80"
          >
            {displayText}
          </span>
        )}

        {/* Glitch Layer 2 (Magenta / Violet shift) */}
        {!shouldReduceMotion && isGlitching && (
          <span
            aria-hidden="true"
            data-text={displayText}
            className="absolute inset-0 font-mono font-black text-black select-none pointer-events-none tracking-tighter glitch-layer-2 opacity-80"
          >
            {displayText}
          </span>
        )}
      </span>
    </span>
  );
}
