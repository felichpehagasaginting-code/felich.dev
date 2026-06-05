'use client';

import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, filter: 'blur(4px)' },
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: 0.4,
        ease: [0.25, 1, 0.5, 1], // Apple-style spring-out easing
      }}
    >
      {children}
    </motion.div>
  );
}
