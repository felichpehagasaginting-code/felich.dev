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
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Live online indicator */}
      <AnimatePresence mode="wait">
        <motion.div
          key={onlineCount}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-widest"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          {onlineCount > 0 ? (
            <span>{onlineCount} online</span>
          ) : (
            <span>Live</span>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Total views */}
      {showViews && totalViews !== null && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] text-neutral-400 font-mono"
        >
          {totalViews.toLocaleString()} views
        </motion.span>
      )}
    </div>
  );
}
