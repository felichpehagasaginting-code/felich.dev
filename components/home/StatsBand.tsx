'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const STATS = [
  { key: 'stats_skills', end: 50, suffix: '+' },
  { key: 'stats_achievements', end: 12, suffix: '+' },
  { key: 'stats_projects', end: 8, suffix: '+' },
  { key: 'stats_experience', end: 3.89, suffix: '', decimals: 2, label: 'Cumulative GPA' },
] as const;

export default function StatsBand() {
  const { t } = useTranslation();
  const bandRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState<{ [key: number]: { x: number; y: number } }>({});

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Staggered card entrance with guaranteed visibility
        gsap.fromTo(
          '.stat-card',
          {
            y: 30,
            opacity: 0,
            scale: 0.95,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: bandRef.current,
              start: 'top 95%',
              once: true,
            },
          }
        );

        // Numeric rolling counters
        STATS.forEach((stat, index) => {
          const targetEl = document.querySelector(`.stat-val-${index}`);
          if (!targetEl) return;

          const obj = { val: 0 };
          const decimals = 'decimals' in stat ? stat.decimals : 0;

          gsap.to(obj, {
            val: stat.end,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bandRef.current,
              start: 'top 95%',
              once: true,
            },
            onUpdate: () => {
              if (targetEl) {
                targetEl.textContent = decimals ? obj.val.toFixed(decimals) : Math.floor(obj.val).toString();
              }
            },
            onComplete: () => {
              if (targetEl) {
                targetEl.textContent = decimals ? stat.end.toFixed(decimals) : stat.end.toString();
              }
            },
          });
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        STATS.forEach((stat, index) => {
          const targetEl = document.querySelector(`.stat-val-${index}`);
          if (targetEl) {
            targetEl.textContent = stat.end.toString();
          }
        });
      });
    },
    { scope: bandRef }
  );

  const handleMouseMove = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos((prev) => ({ ...prev, [index]: { x, y } }));
  };

  return (
    <section ref={bandRef} className="mb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const pos = mousePos[i] || { x: 0, y: 0 };

          return (
            <div
              key={stat.key}
              onMouseMove={(e) => handleMouseMove(i, e)}
              className="stat-card p-5 bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--brand)] hover:shadow-xl transition-all text-center rounded-2xl group relative overflow-hidden cursor-default hover:-translate-y-1"
            >
              {/* Dynamic Interactive Mouse Radial Spotlight */}
              <div
                className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{
                  background: `radial-gradient(200px circle at ${pos.x}px ${pos.y}px, rgba(59, 130, 246, 0.18), transparent 70%)`,
                }}
              />

              <div className="relative z-10 flex items-baseline justify-center gap-0.5">
                <span className={`stat-val-${i} text-3xl md:text-4xl font-display font-black text-[var(--brand)]`}>
                  {stat.end}
                </span>
                {stat.suffix && (
                  <span className="text-xl font-display font-bold text-[var(--brand)]">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <p className="relative z-10 text-[11px] text-[var(--text-muted)] font-mono uppercase tracking-wider mt-1.5 font-medium group-hover:text-[var(--text-primary)] transition-colors">
                {'label' in stat ? stat.label : t(stat.key)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}