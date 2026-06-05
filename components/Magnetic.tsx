'use client';

import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface MagneticProps {
  children: React.ReactNode;
}

export default function Magnetic({ children }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch devices once on mount and disable magnetic effect
  useEffect(() => {
    setIsTouchDevice(
      'ontouchstart' in window || navigator.maxTouchPoints > 0
    );
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouchDevice || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    // Calculate distance and cap it for smooth movement
    const moveX = (clientX - centerX) * 0.35;
    const moveY = (clientY - centerY) * 0.35;
    setPosition({ x: moveX, y: moveY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  // On touch devices, just render children without the magnetic wrapper overhead
  if (isTouchDevice) {
    return <>{children}</>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
}
