'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      setScrollProgress(Math.min(progress, 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-10 right-6 md:bottom-6 md:right-24 z-40 w-12 h-12 rounded-full bg-white dark:bg-neutral-900 shadow-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-center group"
          aria-label="Back to top"
        >
          {/* SVG Progress Ring */}
          <svg className="absolute inset-0 w-12 h-12 -rotate-90" viewBox="0 0 44 44">
            {/* Background ring */}
            <circle
              cx="22" cy="22" r="18"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              className="text-neutral-200 dark:text-neutral-700"
            />
            {/* Progress ring */}
            <circle
              cx="22" cy="22" r="18"
              stroke="url(#progressGradient)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: 'stroke-dashoffset 0.1s ease',
              }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Arrow icon */}
          <svg className="w-4 h-4 text-neutral-600 dark:text-neutral-300 group-hover:text-primary transition-colors relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18"/>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
