'use client';

import dynamic from 'next/dynamic';
import LazySection from '@/components/LazySection';
import Reveal from '@/components/Reveal';

const Terminal = dynamic(() => import('@/components/Terminal'), {
  ssr: false,
  loading: () => <div className="h-80 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-default)] animate-pulse" />,
});

export default function TerminalSection() {
  return (
    <LazySection height="400px">
      <Reveal width="100%" delay={0.2}>
        <section className="mb-16">
          <Terminal />
        </section>
      </Reveal>
    </LazySection>
  );
}