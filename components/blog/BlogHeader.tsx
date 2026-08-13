'use client';

import { useTranslation } from 'react-i18next';

export default function BlogHeader({ count }: { count: number }) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--brand-bg)] border border-[var(--brand)]/20 text-[var(--brand)] text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ borderRadius: '4px' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />
        Journal
      </div>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-4xl font-display font-bold tracking-[-0.01em] text-[var(--text-primary)] mb-1">
            {t('blog_archive_title')}
          </h1>
          <p className="text-[13px] text-[var(--text-muted)] max-w-xl leading-relaxed">
            {t('blog_archive_desc')}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-muted)] text-[10px] font-mono font-semibold uppercase tracking-wider flex-shrink-0" style={{ borderRadius: '4px' }}>
          {count} {t('blog_entries')}
        </span>
      </div>
    </div>
  );
}