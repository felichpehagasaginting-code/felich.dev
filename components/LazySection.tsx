'use client';

import { useEffect, useRef, useState } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  height?: string;
}

export default function LazySection({ children, height = '200px' }: LazySectionProps) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '150px', // Start loading slightly before it enters the viewport for a seamless UX
        threshold: 0.01
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full">
      {isInView ? (
        children
      ) : (
        <div 
          style={{ '--lazy-height': height } as React.CSSProperties} 
          className="w-full rounded-3xl bg-[var(--bg-muted)] border border-[var(--border-default)] animate-pulse h-[var(--lazy-height)]" 
        />
      )}
    </div>
  );
}
