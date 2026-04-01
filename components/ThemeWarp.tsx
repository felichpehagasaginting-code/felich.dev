'use client';

import { useLayoutStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeWarp() {
  const { warp } = useLayoutStore();

  return (
    <AnimatePresence>
      {warp && (
        <motion.div
           key={`${warp.x}-${warp.y}`}
           initial={{ scale: 0, opacity: 1 }}
           animate={{ scale: 4, opacity: 0 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
           className="fixed pointer-events-none z-[9999] rounded-full"
           style={{
             left: warp.x,
             top: warp.y,
             width: '100vmax',
             height: '100vmax',
             marginLeft: '-50vmax',
             marginTop: '-50vmax',
             backgroundColor: warp.color,
             filter: 'blur(20px)',
           }}
        />
      )}
    </AnimatePresence>
  );
}
