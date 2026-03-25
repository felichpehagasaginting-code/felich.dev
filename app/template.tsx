'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Top progress bar simulation on every route change */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-primary z-[100] origin-left"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{
          scaleX: { duration: 0.6, ease: 'circOut' },
          opacity: { duration: 0.4, ease: 'easeOut', delay: 0.4 },
        }}
      />
      {children}
    </>
  );
}
