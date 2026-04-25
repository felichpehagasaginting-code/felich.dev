'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function EngineeringGrid() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const checkDevice = () => {
      setShowGlow(window.innerWidth >= 1024 && !('ontouchstart' in window));
    };

    checkDevice();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', checkDevice);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkDevice);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20 dark:opacity-40">
      {/* Base Grid */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1.5px, transparent 1.5px),
            linear-gradient(to bottom, currentColor 1.5px, transparent 1.5px)
          `,
          backgroundSize: 'clamp(20px, 5vw, 40px) clamp(20px, 5vw, 40px)',
          color: 'rgba(0, 0, 0, 0.04)',
        }}
      />
      
      <div className="dark:block hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1.5px, transparent 1.5px),
              linear-gradient(to bottom, currentColor 1.5px, transparent 1.5px)
            `,
            backgroundSize: 'clamp(20px, 5vw, 40px) clamp(20px, 5vw, 40px)',
            color: 'rgba(255, 255, 255, 0.02)',
          }}
        />
      </div>

      {/* Radial Gradient Glow following mouse */}
      {showGlow && (
        <motion.div
          className="absolute inset-0 z-10"
          style={{
            background: `radial-gradient(600px circle at var(--x) var(--y), rgba(59, 130, 246, 0.08), transparent 40%)`,
            // @ts-ignore
            '--x': springX,
            '--y': springY,
          }}
        />
      )}

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
