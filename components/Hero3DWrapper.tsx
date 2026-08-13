'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Hero3D = dynamic(() => import('@/components/Hero3D'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[var(--bg-muted)] animate-pulse rounded-full" />
});

export default function Hero3DWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const idleId =
      'requestIdleCallback' in window
        ? window.requestIdleCallback(() => setMounted(true), { timeout: 1000 })
        : globalThis.setTimeout(() => setMounted(true), 200);

    return () => {
      if ('cancelIdleCallback' in window && typeof idleId === 'number') {
        window.cancelIdleCallback(idleId);
      } else {
        globalThis.clearTimeout(idleId);
      }
    };
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 bg-[var(--bg-muted)] animate-pulse rounded-full" />;
  }

  return <Hero3D />;
}
