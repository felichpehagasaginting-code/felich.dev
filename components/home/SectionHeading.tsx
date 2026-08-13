'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface SectionHeadingProps {
  eyebrow: string;
  titleKey: string;
  subKey: string;
  viewAllHref?: string;
  viewAllKey?: string;
}

export default function SectionHeading({ eyebrow, titleKey, subKey, viewAllHref, viewAllKey }: SectionHeadingProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--brand-bg)] border border-[var(--brand)]/20 text-[var(--brand)] text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ borderRadius: '4px' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />
          {eyebrow}
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-[-0.01em] text-[var(--text-primary)]">
          {t(titleKey)}
        </h2>
        <p className="text-[var(--text-muted)] text-[13px] mt-1.5 max-w-xl leading-relaxed">
          {t(subKey)}
        </p>
      </div>
      {viewAllHref && viewAllKey && (
        <Link
          href={viewAllHref}
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-[11px] font-semibold text-[var(--text-primary)] border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-all flex-shrink-0"
          style={{ borderRadius: '6px' }}
        >
          {t(viewAllKey)}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}