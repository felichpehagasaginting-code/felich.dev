'use client';

import { useEffect, useRef } from 'react';
import { useLayoutStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export default function ThemeWarp() {
  const { warp } = useLayoutStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!warp || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const particles: Particle[] = [];
    const particleCount = 40;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      particles.push({
        x: warp.x,
        y: warp.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color: warp.color,
        size: Math.random() * 3 + 1
      });
    }

    let progress = 0;
    const duration = 350; // Super fast / Instant feel
    const startTime = performance.now();

    const draw = (now: number) => {
      const elapsed = Math.max(0, now - startTime);
      progress = Math.min(elapsed / duration, 1);

      // Super sharp easing for "Snap" effect
      const ease = 1 - Math.pow(1 - progress, 5);
      
      const maxRadius = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)) * 1.2;
      const radius = ease * maxRadius;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      // 1. Draw Main Ripple (Fast)
      ctx.beginPath();
      ctx.arc(warp.x, warp.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = warp.color;
      ctx.fill();

      // 2. Fast Leading Glow
      if (progress < 0.5) {
        ctx.beginPath();
        ctx.arc(warp.x, warp.y, radius + 20, 0, Math.PI * 2);
        ctx.strokeStyle = warp.color;
        ctx.lineWidth = 10 * (1 - progress);
        ctx.globalAlpha = 0.3 * (1 - progress);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }

      // 3. High Velocity Particles
      particles.forEach(p => {
        p.x += p.vx * 1.5;
        p.y += p.vy * 1.5;
        p.vy += 0.5; // More gravity for fast fall
        p.life -= 0.05; // Faster fade

        if (p.life > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      });

      // 4. Subtle Screen Shake (Removed for "Instant" feel as requested)
      
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
          transition={{ duration: 0.2, delay: 0.2 }}
          className="fixed inset-0 z-[9999] pointer-events-none"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: '100vw', height: '100vh' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
