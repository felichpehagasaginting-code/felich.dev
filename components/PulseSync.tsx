'use client';

import { useEffect, useState } from 'react';
import { sounds } from '@/lib/sounds';
import { motion, AnimatePresence } from 'framer-motion';

export default function PulseSync() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      // Play a very subtle hover-like sound but quieter
      // Note: we might need a specific 'tick' sound if available, 
      // but playHover is subtle enough.
      sounds.playHover();
      
      setTimeout(() => setPulse(false), 2000);
    }, 10000); // Every 10 seconds for subtle ambiance

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {pulse && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1.2 }}
          exit={{ opacity: 0, scale: 1.5 }}
          className="fixed inset-0 pointer-events-none z-[100] border-4 border-primary/20 rounded-none"
        />
      )}
    </AnimatePresence>
  );
}
