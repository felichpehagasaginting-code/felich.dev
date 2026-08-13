'use client';

import dynamic from 'next/dynamic';
import LazySection from '@/components/LazySection';

const SkillsGrid = dynamic(() => import('@/components/SkillsGrid'), {
  ssr: false,
  loading: () => <div className="h-48 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-default)] animate-pulse" />,
});

export default function SkillsSection() {
  return (
    <LazySection height="300px">
      <SkillsGrid />
    </LazySection>
  );
}