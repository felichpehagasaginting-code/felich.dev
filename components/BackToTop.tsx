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
          className="fixed bottom-10 right-6 md:bottom-6 md:right-24 z-40 w-12 h-12 rounded-full bg-[var(--bg-surface)] shadow-xl border border-[var(--border-default)] flex items-center justify-center group"
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
              className="text-[var(--border-default)]"
            />
            {/* Progress ring */}
            <circle
              cx="22" cy="22" r="18"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-[var(--brand)] transition-[stroke-dashoffset] duration-100 ease-out"
            />
          </svg>

          {/* Arrow icon */}
          <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--brand)] transition-colors relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18"/>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
