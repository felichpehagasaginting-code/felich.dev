'use client';

import { useTranslation } from 'react-i18next';

export default function BlogDiveCta() {
  const { t } = useTranslation();

  return (
    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--brand)] group-hover:gap-4 transition-all">
      {t('blog_dive_deeper')}
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </span>
  );
}
