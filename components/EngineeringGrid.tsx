'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function EngineeringGrid() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20 dark:opacity-40">
      {/* Base Grid */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          color: 'rgba(0, 0, 0, 0.05)',
        }}
      />
      
      <div className="dark:block hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            color: 'rgba(255, 255, 255, 0.03)',
          }}
        />
      </div>

      {/* Radial Gradient Glow following mouse */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{
          background: `radial-gradient(600px circle at var(--x) var(--y), rgba(59, 130, 246, 0.06), transparent 40%)`,
          // @ts-ignore
          '--x': springX,
          '--y': springY,
        }}
      />

      {/* Subtle Dot Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.1]"
        style={{
          backgroundImage: 'radial-gradient(currentColor 0.5px, transparent 0.5px)',
          backgroundSize: '10px 10px',
          color: 'inherit'
        }}
      />
    </div>
  );
}
