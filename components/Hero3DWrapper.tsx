'use client';

import dynamic from 'next/dynamic';

const Hero3D = dynamic(() => import('@/components/Hero3D'), { 
  ssr: false, 
  loading: () => <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded-full" /> 
});

export default function Hero3DWrapper() {
  return <Hero3D />;
}
