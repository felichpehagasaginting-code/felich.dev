'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const glitchText = '404';

function GlitchText() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset({
        x: Math.random() * 8 - 4,
        y: Math.random() * 4 - 2,
      });
      setTimeout(() => setOffset({ x: 0, y: 0 }), 100);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative select-none mb-6">
      {/* Glitch layers */}
      <span
        className="absolute inset-0 text-8xl md:text-[10rem] font-black text-blue-500/30 blur-[1px]"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)`, clipPath: 'inset(20% 0 30% 0)' }}
      >
        {glitchText}
      </span>
      <span
        className="absolute inset-0 text-8xl md:text-[10rem] font-black text-pink-500/30 blur-[1px]"
        style={{ transform: `translate(${-offset.x}px, ${-offset.y}px)`, clipPath: 'inset(50% 0 10% 0)' }}
      >
        {glitchText}
      </span>
      {/* Main text */}
      <h1 className="text-8xl md:text-[10rem] font-black bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x relative">
        {glitchText}
      </h1>
    </div>
  );
}

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {/* Animated Emoji */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
          className="text-7xl mb-4"
        >
          🚀
        </motion.div>

        {/* Glitch 404 */}
        {mounted && <GlitchText />}

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl font-bold mb-2"
        >
          Lost in Space
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-neutral-500 dark:text-neutral-400 text-sm mb-8 max-w-sm mx-auto"
        >
          The page you&apos;re looking for has drifted into another galaxy.
          Let&apos;s navigate you back to safety.
        </motion.p>

        {/* Animated scan line */}
        <motion.div
          className="w-48 h-[2px] mx-auto mb-8 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800"
        >
          <motion.div
            className="h-full w-1/3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            animate={{ x: ['-100%', '400%'] }}
            transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
          />
        </motion.div>

        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <motion.span
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Back to Home
            </motion.span>
          </Link>
          <Link href="/contact">
            <motion.span
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
            >
              Contact Me
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
