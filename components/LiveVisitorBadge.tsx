'use client';

import { useVisitorTracking } from '@/lib/useVisitorTracking';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  path?: string;
  showViews?: boolean;
  className?: string;
}

import { usePathname } from 'next/navigation';

export default function LiveVisitorBadge({
  path,
  showViews = false,
  className = '',
}: Props) {
  const pathname = usePathname();
  const currentPath = path || pathname.replace(/^\//, '') || 'home';
  const { onlineCount, totalViews } = useVisitorTracking(currentPath);

  return (
    <div className={`fixed bottom-24 left-4 md:bottom-6 md:left-24 z-[70] pointer-events-auto ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl shadow-lg liquid-glass group"
      >
        {/* Live online indicator */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={onlineCount}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[9px] font-black text-green-500 dark:text-green-400 uppercase tracking-tighter font-mono"
            >
              {Math.max(onlineCount, 1)}L
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="w-px h-2.5 bg-white/10" />

        {/* Total views */}
        <div className="flex items-center gap-1">
          <svg className="w-2.5 h-2.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-[9px] font-black text-neutral-500 dark:text-neutral-400 font-mono tracking-tighter">
            {totalViews ? totalViews.toLocaleString() : '---'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
