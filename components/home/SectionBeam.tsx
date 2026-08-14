'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function SectionBeam() {
  const beamRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      if (!pathRef.current || !beamRef.current) return;

      const path = pathRef.current;
      const pathLength = path.getTotalLength ? path.getTotalLength() : 1000;

      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
          },
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(path, { strokeDashoffset: 0 });
      });
    },
    { scope: beamRef }
  );

  return (
    <div
      ref={beamRef}
      className="hidden lg:block pointer-events-none fixed left-4 top-0 bottom-0 w-8 z-0 opacity-40 select-none overflow-visible"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 32 1000"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="beamGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.8" />
          </linearGradient>
          <filter id="beamGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient track */}
        <line
          x1="16"
          y1="0"
          x2="16"
          y2="1000"
          stroke="var(--border-default)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Glowing dynamic path */}
        <path
          ref={pathRef}
          d="M 16 0 L 16 1000"
          stroke="url(#beamGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#beamGlow)"
        />
      </svg>
    </div>
  );
}
