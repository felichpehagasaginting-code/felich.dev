'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutStore } from '@/lib/store';

export default function AdaptiveBackground() {
  const [timeStyle, setTimeStyle] = useState('none');
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

  // We only show strong overlays when in dark theme for night, or light theme for day.
  // Actually, we can just apply a subtle blend mode overlay globally.

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={timeStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: theme === 'dark' || theme === 'light' || theme === 'apple' ? 1 : 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3 }}
          className="absolute inset-0"
        >
          {/* Animated Background Blobs for Liquid Feel - Simplified for performance */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                x: [0, 80, -40, 0], 
                y: [0, -80, 40, 0],
                scale: [1, 1.1, 0.9, 1]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[80px] md:blur-[120px] opacity-30 md:opacity-40 bg-gradient-to-br from-blue-600/30 to-purple-600/30"
            />
            {!isMobile && (
              <motion.div 
                animate={{ 
                  x: [0, -100, 60, 0], 
                  y: [0, 100, -60, 0],
                  scale: [1, 0.95, 1.2, 1]
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-[30%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[140px] opacity-30 bg-gradient-to-br from-pink-500/20 to-orange-500/20"
              />
            )}
            <motion.div 
              animate={{ 
                x: [0, 60, -80, 0], 
                y: [0, 80, -40, 0],
                scale: [1, 1.05, 0.95, 1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] rounded-full blur-[70px] md:blur-[110px] opacity-20 md:opacity-25 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20"
            />
          </div>

          {/* Siri-inspired Global Aura (Active in Apple Theme) */}
          {theme === 'apple' && (
            <div className="absolute inset-0 pointer-events-none z-50">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(10,132,255,0.12),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(191,90,242,0.12),transparent_50%)]" />
              {!isMobile && (
                <motion.div 
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 border-[20px] border-transparent bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-[40px] opacity-30"
                />
              )}
            </div>
          )}

          {timeStyle === 'morning' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/10 via-orange-300/10 to-transparent mix-blend-overlay dark:mix-blend-color-dodge" />
          )}
          {timeStyle === 'day' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/10 via-cyan-300/10 to-transparent mix-blend-overlay dark:mix-blend-color-dodge" />
          )}
          {timeStyle === 'evening' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/15 via-purple-500/10 to-transparent mix-blend-overlay dark:mix-blend-color-dodge" />
          )}
          {timeStyle === 'night' && (
            <>
              {/* Starry night subtle effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-purple-900/10 to-black/30 mix-blend-multiply dark:mix-blend-overlay" />
              <div 
                className="absolute inset-0 opacity-10 dark:opacity-20 mix-blend-screen" 
                style={{
                  backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
                  backgroundSize: '80px 80px',
                }}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
