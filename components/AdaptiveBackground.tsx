'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutStore, type Theme } from '@/lib/store';

const THEME_ORB: Record<Theme, { glow: string; accent: string }> = {
  vanilla: { glow: 'rgba(107, 136, 31, 0.14)', accent: 'rgba(85, 107, 20, 0.10)' },
  noir: { glow: 'rgba(205, 205, 214, 0.08)', accent: 'rgba(205, 205, 214, 0.06)' },
  violet: { glow: 'rgba(139, 122, 207, 0.16)', accent: 'rgba(124, 111, 196, 0.10)' },
};

export default function AdaptiveBackground() {
  const [timeStyle, setTimeStyle] = useState<'none' | 'morning' | 'day' | 'evening' | 'night'>('none');
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useLayoutStore();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const updateTime = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 10) {
        setTimeStyle('morning');
      } else if (hour >= 10 && hour < 16) {
        setTimeStyle('day');
      } else if (hour >= 16 && hour < 19) {
        setTimeStyle('evening');
      } else {
        setTimeStyle('night');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (timeStyle === 'none') return null;

  const orb = THEME_ORB[theme];

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.div
          key={timeStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3 }}
          className="absolute inset-0"
        >
          {/* Ambient brand orbs — subtle, theme-driven */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className={`absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[80px] md:blur-[120px] ${isMobile ? '' : 'animate-blob-1'}`}
              style={{ background: `radial-gradient(circle, ${orb.glow} 0%, transparent 70%)` }}
            />
            {!isMobile && (
              <div
                className="absolute top-[30%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[140px] animate-blob-2"
                style={{ background: `radial-gradient(circle, ${orb.accent} 0%, transparent 70%)` }}
              />
            )}
            <div
              className={`absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] rounded-full blur-[70px] md:blur-[110px] ${isMobile ? '' : 'animate-blob-3'}`}
              style={{ background: `radial-gradient(circle, ${orb.glow} 0%, transparent 70%)` }}
            />
          </div>

          {timeStyle === 'morning' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-bg)] via-transparent to-transparent mix-blend-overlay" />
          )}
          {timeStyle === 'evening' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-bg)] via-transparent to-transparent mix-blend-overlay" />
          )}
          {timeStyle === 'night' && (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-base)]/60" />
              <div className="absolute inset-0 opacity-[0.05] mix-blend-screen bg-star-pattern" />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}