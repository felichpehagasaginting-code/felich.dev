'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isText, setIsText] = useState(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement;
      
      // Interactive detection
      const isInteractive = target.closest('a') || target.closest('button') || target.closest('.interactive-element');
      setIsHovering(!!isInteractive);

      // Text detection for terminal cursor
      const textTags = ['P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'];
      const isTextNode = textTags.includes(target.tagName) || target.closest('p') || target.closest('span');
      setIsText(!!isTextNode && !isInteractive);
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Main Cursor / Terminal Block */}
          <motion.div
            className="fixed pointer-events-none z-[9999] hidden lg:flex items-center justify-center mix-blend-difference"
            animate={{
              x: position.x - (isText ? 6 : 4),
              y: position.y - (isText ? 10 : 4),
              width: isText ? 12 : (isHovering ? 0 : 8),
              height: isText ? 20 : (isHovering ? 0 : 8),
              borderRadius: isText ? '2px' : '50%',
              scale: isHovering && !isText ? 0 : 1,
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.1 }}
            style={{
              backgroundColor: 'white',
            }}
          >
            {isText && (
               <motion.div 
                 animate={{ opacity: [1, 0, 1] }} 
                 transition={{ duration: 0.8, repeat: Infinity }} 
                 className="w-full h-full bg-white opacity-50"
               />
            )}
          </motion.div>

          {/* Outer ring / glow cursor */}
          <motion.div
            className="fixed pointer-events-none z-[9998] hidden lg:block mix-blend-screen"
            animate={{
              x: position.x - (isHovering ? 40 : (isText ? 10 : 20)),
              y: position.y - (isHovering ? 40 : (isText ? 10 : 20)),
              width: isHovering ? 80 : (isText ? 20 : 40),
              height: isHovering ? 80 : (isText ? 20 : 40),
              opacity: isHovering ? 0.3 : (isText ? 0 : 0.8),
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.5 }}
            style={{
              borderRadius: '50%',
              border: (isHovering || isText) ? 'none' : '2px solid rgba(59, 130, 246, 0.5)',
              background: isHovering 
                ? 'radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(139,92,246,0.4) 60%, transparent 100%)' 
                : 'transparent',
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
