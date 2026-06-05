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
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!warp || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Use logical pixels for rendering, CSS handles display size
    const dpr = Math.min(window.devicePixelRatio, 2); // Cap at 2x for perf
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles with burst spread
    const particles: Particle[] = [];
    const particleCount = 30; // Reduced from 40 for smoother rendering
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
        size: Math.random() * 3 + 1,
      });
    }

    const duration = 350;
    const startTime = performance.now();
    const maxRadius = Math.sqrt(
      window.innerWidth ** 2 + window.innerHeight ** 2
    ) * 1.2;

    const draw = (now: number) => {
      const elapsed = Math.max(0, now - startTime);
      const progress = Math.min(elapsed / duration, 1);

      // Super sharp easing for "Snap" effect
      const ease = 1 - Math.pow(1 - progress, 5);
      const radius = ease * maxRadius;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Draw Main Ripple (Fast)
      ctx.beginPath();
      ctx.arc(warp.x, warp.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = warp.color;
      ctx.fill();

      // 2. Fast Leading Glow (only first half of animation)
      if (progress < 0.5) {
        const glowAlpha = 0.3 * (1 - progress * 2);
        ctx.beginPath();
        ctx.arc(warp.x, warp.y, radius + 20, 0, Math.PI * 2);
        ctx.strokeStyle = warp.color;
        ctx.lineWidth = 10 * (1 - progress);
        ctx.globalAlpha = glowAlpha;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }

      // 3. High Velocity Particles with batch rendering
      ctx.save();
      for (const p of particles) {
        p.x += p.vx * 1.5;
        p.y += p.vy * 1.5;
        p.vy += 0.5;
        p.life -= 0.05;

        if (p.life > 0) {
          ctx.globalAlpha = p.life;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }
      }
      ctx.restore();

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
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
            className="w-screen h-screen"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
