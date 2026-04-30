'use client';

import { useVisitorTracking } from '@/lib/useVisitorTracking';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  path?: string;
  showViews?: boolean;
  className?: string;
}

export default function LiveVisitorBadge({
  path = 'home',
  showViews = false,
  className = '',
}: Props) {
  const { onlineCount, totalViews } = useVisitorTracking(path);

  return (
    <div className={`fixed top-20 right-4 md:top-6 md:right-8 z-[70] pointer-events-auto ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl shadow-xl liquid-glass group"
      >
        {/* Live online indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={onlineCount}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-bold text-green-500 dark:text-green-400 uppercase tracking-widest font-mono"
            >
              {onlineCount} LIVE
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="w-px h-3 bg-white/10" />

        {/* Total views */}
        <div className="flex items-center gap-1.5">
          <svg className="w-3 h-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 font-mono">
            {totalViews ? totalViews.toLocaleString() : '---'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
