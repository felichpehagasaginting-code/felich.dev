'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import TypingAnimation from '@/components/TypingAnimation';
import AnimatedCounter from '@/components/AnimatedCounter';
import PageTransition from '@/components/PageTransition';
import Reveal from '@/components/Reveal';
import SpotifyWidget from '@/components/SpotifyWidget';
import LiveVisitorBadge from '@/components/LiveVisitorBadge';
import Script from 'next/script';
import LazySection from '@/components/LazySection';
import { useTranslation } from 'react-i18next';

const Hero3DWrapper = dynamic(() => import('@/components/Hero3DWrapper'), { ssr: false });

// Dynamic imports: both Terminal (~30KB) and SkillsGrid (~74KB of SVG icons)
// are code-split into separate async chunks that load only when their
// respective LazySection scrolls into view — not at initial page load.
const Terminal = dynamic(() => import('@/components/Terminal'), {
  ssr: false,
  loading: () => <div className="h-80 rounded-2xl bg-neutral-100/40 dark:bg-neutral-900/20 border border-neutral-200/30 dark:border-neutral-800/30 animate-pulse" />,
});

const SkillsGrid = dynamic(() => import('@/components/SkillsGrid'), {
  ssr: false,
  loading: () => <div className="h-48 rounded-2xl bg-neutral-100/40 dark:bg-neutral-900/20 border border-neutral-200/30 dark:border-neutral-800/30 animate-pulse" />,
});
export default function Home() {
  const { t } = useTranslation();
  const [localTime, setLocalTime] = useState('');
  const timeFmt = useMemo(() => new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }), []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const updateTime = useCallback(() => setLocalTime(timeFmt.format(new Date())), [timeFmt]);


  return (
    <PageTransition>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Felich',
            url: 'https://felich.dev',
            jobTitle: 'Software Engineer',
            knowsAbout: ['AI Engineering', 'FinTech', 'Next.js', 'TypeScript', 'Machine Learning'],
            sameAs: [
              'https://github.com/felichpehagasaginting-code',
              'https://www.linkedin.com/in/felich-pehagasa-ginting-b6a8a32a6/',
              'https://www.instagram.com/fel.comp',
            ],
          }),
        }}
      />
      <div>
        {/* Hero Section */}
        <Reveal width="auto">
          <section className="mb-12 flex flex-col md:flex-row items-center gap-12 md:gap-8 overflow-visible">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
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
              <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter leading-[1.1] md:leading-tight px-0.5 overflow-visible">
                {t('hi_im')}{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x pb-4 inline-block md:drop-shadow-sm">
                  Felich
                </span>
              </h1>

              <div className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 font-medium mb-8 min-h-[3.5rem] md:min-h-[2rem] relative z-10 px-0.5 overflow-visible">
                <TypingAnimation
                  texts={[
                    t('hero_typing_se'),
                    t('hero_typing_ai'),
                    t('hero_typing_devops'),
                    t('hero_typing_fs'),
                  ]}
                />
              </div>

                <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-sm text-neutral-500 dark:text-neutral-400 mb-8 relative z-10">
                  <div className="flex items-center gap-2 group cursor-help relative"
                    onMouseEnter={updateTime}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span>{t('location')}</span>
                    
                    {/* Time Tooltip */}
                    <div className="absolute -top-10 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3 py-1 rounded-lg text-xs font-mono shadow-xl whitespace-nowrap pointer-events-none z-50">
                      {t('location_tooltip')}: {localTime} (WIB)
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 group cursor-default">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span>{t('onsite')}</span>
                  </div>
                  
                  <div className="w-full sm:w-auto">
                    <SpotifyWidget />
                  </div>
                </div>

              <div className="space-y-4 text-neutral-600 dark:text-neutral-300 leading-relaxed relative z-10">
                <p>
                  {t('hero_para_1')}
                </p>
                <p>
                  {t('hero_para_2')}
                </p>
                <div className="py-2">
                  <p className="font-bold text-neutral-900 dark:text-white mb-2">{t('hero_skills_title')}</p>
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

              {/* Live Monitor moved to global fixed position */}
            </motion.div>
            
            <div className="w-full md:w-1/3 flex-shrink-0 animate-fade-in pointer-events-auto z-10 hover:cursor-grab active:cursor-grabbing interactive-element">
              <Hero3DWrapper />
            </div>
          </section>
        </Reveal>

        {/* Stats Counter Section */}
        <LazySection height="100px">
          <Reveal width="100%" delay={0.4}>
            <section className="mb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center group hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <AnimatedCounter end={32} className="text-3xl font-bold text-primary" suffix="+" />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{t('stats_skills')}</p>
                </div>
                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center group hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <AnimatedCounter end={8} className="text-3xl font-bold text-primary" suffix="+" />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{t('stats_achievements')}</p>
                </div>
                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center group hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <AnimatedCounter end={4} className="text-3xl font-bold text-primary" suffix="+" />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{t('stats_projects')}</p>
                </div>
                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center group hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <AnimatedCounter end={2} className="text-3xl font-bold text-primary" suffix="+" />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{t('stats_experience')}</p>
                </div>
              </div>
            </section>
          </Reveal>
        </LazySection>

        {/* Interactive Terminal Section */}
        <LazySection height="400px">
          <Reveal width="100%" delay={0.2}>
            <section className="mb-16">
              <Terminal />
            </section>
          </Reveal>
        </LazySection>

        {/* Skills Section — code-split via SkillsGrid (contains 74KB SkillIcons) */}
        <LazySection height="300px">

          <SkillsGrid />
        </LazySection>

        {/* Keyboard shortcut hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            {t('shortcut_hint')}
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
