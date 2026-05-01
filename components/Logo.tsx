'use client';

import { motion } from 'framer-motion';

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
      
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full"
      >
        {/* Outer Ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="10 20"
          className="text-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Core Shape - Stylized 'F' / Nexus */}
        <motion.path
          d="M35 25V75M35 25H65M35 50H55"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Animated Orbits */}
        <motion.circle
          cx="50"
          cy="50"
          r="4"
          fill="currentColor"
          className="text-primary"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <motion.circle
          cx="80"
          cy="50"
          r="3"
          fill="currentColor"
          className="text-primary/60"
          animate={{ 
            rotate: 360,
            transformOrigin: "50% 50%"
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}
