'use client';

import Reveal from '@/components/Reveal';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useTranslation } from 'react-i18next';

const STATS = [
  { key: 'stats_skills', end: 50, suffix: '+' },
  { key: 'stats_achievements', end: 10, suffix: '+' },
  { key: 'stats_projects', end: 8, suffix: '+' },
  { key: 'stats_experience', end: 1, suffix: '+' },
] as const;

export default function StatsBand() {
  const { t } = useTranslation();

  return (
    <Reveal width="100%" delay={0.4}>
      <section className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.key}
              className="p-4 bg-[var(--bg-surface)] border border-[var(--border-default)] text-center group hover:border-[var(--brand)] transition-all"
              style={{ borderRadius: '8px' }}
            >
              <AnimatedCounter end={stat.end} className="text-3xl font-display font-bold text-[var(--brand)]" suffix={stat.suffix} />
              <p className="text-[11px] text-[var(--text-muted)] font-mono uppercase tracking-wider mt-1">{t(stat.key)}</p>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}