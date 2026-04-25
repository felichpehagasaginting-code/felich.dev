'use client';

import { useEffect, useRef, useState } from 'react';
import { useLayoutStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';

export default function ThemeWarp() {
  const { warp } = useLayoutStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!warp || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let progress = 0;
    const duration = 800; // ms
    const startTime = performance.now();

    const draw = (now: number) => {
      const elapsed = Math.max(0, now - startTime);
      progress = Math.min(elapsed / duration, 1);

      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const maxRadius = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)) * 1.2;
      const radius = Math.max(0, ease * maxRadius);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw ripple with noise/grain effect
      ctx.beginPath();
      ctx.arc(warp.x, warp.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = warp.color;
      ctx.fill();

      // Add a bit of "Elite" grain/noise edge
      if (progress < 1) {
        requestAnimationFrame(draw);
      }
    };

    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [warp]);

  return (
    <AnimatePresence>
      {warp && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="fixed inset-0 z-[9999] pointer-events-none"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
