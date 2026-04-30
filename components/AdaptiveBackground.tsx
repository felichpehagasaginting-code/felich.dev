'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutStore } from '@/lib/store';

export default function AdaptiveBackground() {
  const [timeStyle, setTimeStyle] = useState('none');
  const { theme } = useLayoutStore();

  useEffect(() => {
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
    return () => clearInterval(interval);
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
          animate={{ opacity: theme === 'dark' || theme === 'light' ? 1 : 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3 }}
          className="absolute inset-0"
        >
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
                className="absolute inset-0 opacity-20 dark:opacity-40 mix-blend-screen" 
                style={{
                  backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                  backgroundPosition: '0 0, 20px 20px'
                }}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
