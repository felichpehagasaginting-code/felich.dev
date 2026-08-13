'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useLayoutStore } from '@/lib/store';

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  const { theme } = useLayoutStore();
  const reduced = Boolean(useReducedMotion());

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
        {theme === 'vanilla' ? (
          <VanillaMark reduced={reduced} />
        ) : theme === 'violet' ? (
          <VioletMark reduced={reduced} />
        ) : (
          <NoirMark reduced={reduced} />
        )}
      </svg>
    </div>
  );
}

/* Noir (default, dark) — nexus disc: dashed orbit ring + solid core 'F' */
function NoirMark({ reduced }: { reduced: boolean }) {
  return (
    <>
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="10 20"
        className="text-primary/30"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50% 50%" }}
      />
      <circle cx="50" cy="50" r="34" className="fill-primary/10" />
      <motion.path
        d="M35 25V75M35 25H65M35 50H55"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="4"
        fill="currentColor"
        className="text-primary"
        animate={reduced ? undefined : { scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle
        cx="80"
        cy="50"
        r="3"
        fill="currentColor"
        className="text-primary/60"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "80px 50px" }}
      />
    </>
  );
}

/* Vanilla (light) — app badge: rounded square outline + minimal 'F' */
function VanillaMark({ reduced }: { reduced: boolean }) {
  return (
    <>
      <rect
        x="12"
        y="12"
        width="76"
        height="76"
        rx="22"
        stroke="currentColor"
        strokeWidth="3"
        className="text-primary"
      />
      <rect
        x="17"
        y="17"
        width="66"
        height="66"
        rx="17"
        stroke="currentColor"
        strokeWidth="1"
        className="text-primary/30"
      />
      <path
        d="M38 26V74M38 26H64M38 50H56"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
      <motion.circle
        cx="70"
        cy="70"
        r="3.5"
        fill="currentColor"
        className="text-primary"
        animate={reduced ? undefined : { scale: [1, 1.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </>
  );
}

/* Violet — crystal: hexagonal badge with gradient core */
function VioletMark({ reduced }: { reduced: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="violet-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D2C3F6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      <motion.path
        d="M50 8 L84 29 V71 L50 92 L16 71 V29 Z"
        stroke="url(#violet-logo-grad)"
        strokeWidth="3"
        fill="none"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50% 50%" }}
      />
      <motion.path
        d="M50 20 L76 35.5 V64.5 L50 80 L24 64.5 V35.5 Z"
        fill="url(#violet-logo-grad)"
        fillOpacity="0.18"
        animate={reduced ? undefined : { scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transformOrigin: "50% 50%" }}
      />
      <path
        d="M40 32V68M40 32H62M40 50H54"
        stroke="url(#violet-logo-grad)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.circle
        cx="76"
        cy="38"
        r="2.5"
        fill="#D2C3F6"
        animate={reduced ? undefined : { opacity: [1, 0.2, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
    </>
  );
}