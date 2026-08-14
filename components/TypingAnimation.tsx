'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TypingAnimationProps {
  texts: string[];
  holdDuration?: number;
  className?: string;
}

const GLYPHS = '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function TypingAnimation({
  texts,
  holdDuration = 2400,
  className = '',
}: TypingAnimationProps) {
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(() => texts[0] || '');
  const [glitchPhase, setGlitchPhase] = useState<'idle' | 'pre-glitch' | 'glitch' | 'resolving'>('idle');

  useEffect(() => {
    if (prefersReducedMotion || !texts.length) {
      setDisplayText(texts[0] || '');
      setGlitchPhase('idle');
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const currentText = texts[currentIndex];
    const nextIndex = (currentIndex + 1) % texts.length;
    const nextText = texts[nextIndex];

    if (glitchPhase === 'idle') {
      setDisplayText(currentText);
      timeoutId = setTimeout(() => {
        setGlitchPhase('pre-glitch');
      }, holdDuration);
    } else if (glitchPhase === 'pre-glitch') {
      // Phase 2: Pre-glitch preparation (micro jitter / preliminary glyph flickers)
      let ticks = 0;
      const maxTicks = 6; // ~210ms total (6 * 35ms)

      intervalId = setInterval(() => {
        ticks++;
        const chars = currentText.split('');
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
      // Phase 3: Peak Glitch Shift (matrix flurry shifting length to target string)
      let ticks = 0;
      const maxTicks = 9; // ~270ms total (9 * 30ms)

      intervalId = setInterval(() => {
        ticks++;
        const targetLen = nextText.length;
        const currentLen = currentText.length;
        const progress = ticks / maxTicks;
        const currentTargetLen = Math.round(currentLen + (targetLen - currentLen) * progress);

        let scrambled = '';
        for (let i = 0; i < currentTargetLen; i++) {
          if (nextText[i] === ' ' && Math.random() < 0.6) {
            scrambled += ' ';
          } else {
            scrambled += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }

        setDisplayText(scrambled);

        if (ticks >= maxTicks) {
          clearInterval(intervalId);
          setGlitchPhase('resolving');
        }
      }, 30);
    } else if (glitchPhase === 'resolving') {
      // Phase 4: Resolution & Clean Lock-In from left-to-right
      let lockedIndex = 0;
      const targetLen = nextText.length;

      intervalId = setInterval(() => {
        lockedIndex += 2; // lock 2 characters per tick for crisp pace

        let resolved = nextText.slice(0, Math.min(lockedIndex, targetLen));
        for (let i = lockedIndex; i < targetLen; i++) {
          if (nextText[i] === ' ') {
            resolved += ' ';
          } else {
            resolved += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }

        setDisplayText(resolved);

        if (lockedIndex >= targetLen) {
          clearInterval(intervalId);
          setDisplayText(nextText);
          setCurrentIndex(nextIndex);
          setGlitchPhase('idle');
        }
      }, 35);
    }

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [currentIndex, glitchPhase, holdDuration, texts, prefersReducedMotion]);

  const isGlitching = glitchPhase === 'pre-glitch' || glitchPhase === 'glitch';

  return (
    <span
      className={`inline-flex items-center select-none font-mono tracking-tight transition-all duration-100 ${
        isGlitching
          ? 'text-[var(--text-primary)] [text-shadow:-1.5px_0_#00ffff,1.5px_0_#ff0055] scale-[1.01]'
          : 'text-[var(--text-muted)]'
      } ${className}`}
    >
      <span className="relative">
        {displayText}
        {isGlitching && (
          <span
            aria-hidden="true"
            className="absolute inset-0 select-none pointer-events-none opacity-70 animate-pulse font-mono tracking-tight"
          >
            {displayText}
          </span>
        )}
      </span>

      {/* Terminal Block Cursor with Glitch Energy */}
      <motion.span
        animate={{
          opacity: isGlitching ? [1, 0.2, 1] : [1, 0, 1],
          backgroundColor: isGlitching ? 'var(--brand-strong, var(--brand))' : 'var(--brand)',
        }}
        transition={{ duration: isGlitching ? 0.15 : 0.8, repeat: Infinity }}
        className="ml-1.5 inline-block w-1.5 h-4.5 rounded-xs align-middle shadow-xs"
      />
    </span>
  );
}
