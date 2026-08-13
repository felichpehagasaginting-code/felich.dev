'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import TypingAnimation from '@/components/TypingAnimation';
import SpotifyWidget from '@/components/SpotifyWidget';
import { useTranslation } from 'react-i18next';

const Hero3DWrapper = dynamic(() => import('@/components/Hero3DWrapper'), { ssr: false });

export default function Hero() {
  const { t } = useTranslation();
  const [localTime, setLocalTime] = useState('');
  const timeFmt = useMemo(() => new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }), []);

  const updateTime = useCallback(() => setLocalTime(timeFmt.format(new Date())), [timeFmt]);

  return (
    <section className="mb-12 flex flex-col md:flex-row items-center gap-12 md:gap-8 overflow-visible">
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ perspective: 1000 }}
        whileHover={{
          rotateX: 1,
          rotateY: -1,
          transition: { type: 'spring', stiffness: 400, damping: 20 }
        }}
        className="flex-1 relative z-20"
      >
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-[-0.01em] leading-[1.1] text-[var(--text-primary)] px-0.5 overflow-visible">
          {t('hi_im')}{' '}
          <span className="text-[var(--brand)] inline-block">
            Felich
          </span>
        </h1>

        <div className="text-lg md:text-xl text-[var(--text-muted)] font-medium mb-8 min-h-[3.5rem] md:min-h-[2rem] relative z-10 px-0.5 overflow-visible">
          <TypingAnimation
            texts={[
              t('hero_typing_se'),
              t('hero_typing_pe'),
              t('hero_typing_ai'),
              t('hero_typing_devops'),
              t('hero_typing_fs'),
            ]}
          />
        </div>

        <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-sm text-[var(--text-muted)] mb-8 relative z-10">
          <div className="flex items-center gap-2 group cursor-help relative"
            onMouseEnter={updateTime}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand)]"></span>
            </span>
            <span>{t('location')}</span>

            {/* Time Tooltip */}
            <div className="absolute -top-10 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--text-primary)] text-[var(--bg-base)] px-3 py-1 rounded-lg text-xs font-mono shadow-xl whitespace-nowrap pointer-events-none z-50">
              {t('location_tooltip')}: {localTime} (WIB)
            </div>
          </div>

          <div className="flex items-center gap-2 group cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]"></span>
            </span>
            <span>{t('onsite')}</span>
          </div>

          <div className="w-full sm:w-auto">
            <SpotifyWidget />
          </div>
        </div>

        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed relative z-10">
          <p>
            {t('hero_para_1')}
          </p>
          <p>
            {t('hero_para_2')}
          </p>
          <div className="py-2">
            <p className="font-bold text-[var(--text-primary)] mb-2">{t('hero_skills_title')}</p>
            <ul className="space-y-1.5 ml-1">
              <li className="flex items-center gap-2">
                <span className="text-primary">→</span> {t('hero_skills_1')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">→</span> {t('hero_skills_2')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">→</span> {t('hero_skills_3')}
              </li>
            </ul>
          </div>
          <p>
            {t('hero_para_3')}
          </p>
          <p className="font-bold text-primary">{t('lets_connect')}</p>
        </div>
      </motion.div>

      <div className="w-full md:w-1/3 flex-shrink-0 animate-fade-in pointer-events-auto z-10 hover:cursor-grab active:cursor-grabbing interactive-element">
        <Hero3DWrapper />
      </div>
    </section>
  );
}