'use client';

import { motion } from 'framer-motion';

export default function AnimatedDivider({ className = '' }: { className?: string }) {
  const binary = "100110101100101001101";

  return (
    <div className={`relative w-full overflow-hidden flex flex-col items-center ${className}`}>
      {/* Moving Binary Stream */}
      <div className="absolute inset-0 flex justify-center opacity-[0.03] dark:opacity-[0.07] text-[8px] font-mono pointer-events-none select-none tracking-[1em]">
        <motion.div
           animate={{ x: ["-20%", "20%"] }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className="whitespace-nowrap"
        >
          {binary}{binary}{binary}{binary}{binary}
        </motion.div>
      </div>

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="h-[1px] md:h-[2px] w-full bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent origin-left"
      />
      
      {/* Gliding Light Streak */}
      <motion.div
        initial={{ left: '-20%' }}
        whileInView={{ left: '120%' }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
        className="absolute top-0 h-[1px] md:h-[2px] w-[30%] bg-gradient-to-r from-transparent via-blue-500/50 dark:via-blue-400/50 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.3)]"
      />
    </div>
  );
}
