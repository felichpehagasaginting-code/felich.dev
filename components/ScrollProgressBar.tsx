'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--brand)] via-purple-400 to-[var(--brand-strong,var(--brand))] z-[100] origin-left shadow-[0_0_12px_var(--brand)]"
      style={{ scaleX }}
    />
  );
}
