---
name: gsap
description: >-
  Use this skill when designing, building, or optimizing complex web animations,
  ScrollTrigger timelines, text reveal effects, FLIP layout transitions, SVG path morphing,
  or high-performance UI motion effects using GreenSock Animation Platform (GSAP) in React 19 and Next.js App Router.
---

# ⚡ GSAP (GreenSock Animation Platform) Skill & Workflow Guide

Comprehensive guide for integrating high-performance GSAP animations into **Next.js 16 (App Router)** and **React 19** applications.

---

## 🚀 Quick Setup & Best Practices in React 19

### 1. Installation & Imports

Use `gsap` alongside `@gsap/react` for proper lifecycle cleanup and scoping:

```typescript
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins once in client component context
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}
```

---

## 🛠️ Core Patterns

### Pattern 1: Basic Animation with `@gsap/react` (`useGSAP`)

Always scope animations using the `scope` property in `useGSAP`. This ensures automatic cleanup on component unmount and prevents memory leaks:

```tsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function HeroBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Target elements using scoped selectors inside containerRef
      gsap.from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power2.out',
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="hero-container">
      <h1 className="hero-title text-5xl font-bold">Welcome</h1>
      <p className="hero-subtitle text-xl text-neutral-400">High-performance GSAP animations</p>
    </div>
  );
}
```

---

### Pattern 2: ScrollTrigger Parallax & Staggered Reveal

Use `ScrollTrigger` for scroll-driven animations and pin elements seamlessly:

```tsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeatureSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.from('.feature-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)',
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-20 px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="feature-card p-6 bg-surface rounded-2xl">Feature 1</div>
        <div className="feature-card p-6 bg-surface rounded-2xl">Feature 2</div>
        <div className="feature-card p-6 bg-surface rounded-2xl">Feature 3</div>
      </div>
    </section>
  );
}
```

---

### Pattern 3: Responsive Animations with `gsap.matchMedia()`

Handle different screen sizes and accessibility settings gracefully:

```tsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ResponsiveSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop animations
      mm.add('(min-width: 1024px)', () => {
        gsap.to('.animated-box', { x: 300, rotation: 360, duration: 2 });
      });

      // Mobile animations
      mm.add('(max-width: 1023px)', () => {
        gsap.to('.animated-box', { y: 150, duration: 1.5 });
      });

      // Accessibility: Honor reduced motion preference
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.animated-box', { opacity: 1 });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      <div className="animated-box w-20 h-20 bg-primary rounded-xl" />
    </div>
  );
}
```

---

## 📌 Performance Rules for GSAP

1. **Animate Transform Properties Only**: Prefer `x`, `y`, `scale`, `rotation`, `opacity` over `top`, `left`, `width`, `height`, `margin`, which trigger expensive layout reflows.
2. **Use GPU Acceleration**: GSAP automatically applies `force3D: true` for 3D transforms (`x`, `y`, `z`).
3. **Always Scope Selectors**: Always pass `{ scope: ref }` to `useGSAP()` to avoid global DOM selector collisions.
4. **Revert Context on Unmount**: `@gsap/react` handles context reversion automatically when using `useGSAP()`.
5. **Next.js Hydration Guard**: Wrap plugin registration with `if (typeof window !== 'undefined')` to prevent SSR errors.
