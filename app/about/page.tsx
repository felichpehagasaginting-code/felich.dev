'use client';

import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { Quote, Verified, ShieldCheck, MessageSquare, Clock, Sparkles } from 'lucide-react';
import CareerTimeline from '@/components/CareerTimeline';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: t('testimonial_1_name'),
      role: t('testimonial_1_role'),
      initials: 'PC',
      text: t('testimonial_1_text'),
    },
    {
      name: t('testimonial_2_name'),
      role: t('testimonial_2_role'),
      initials: 'AM',
      text: t('testimonial_2_text'),
    },
    {
      name: t('testimonial_3_name'),
      role: t('testimonial_3_role'),
      initials: 'CL',
      text: t('testimonial_3_text'),
    },
  ];

  const bioContent = t('bio_p1') + ' ' + t('bio_p2') + ' ' + t('bio_p3');
  const readingTime = Math.ceil(bioContent.split(' ').length / 200);

  return (
    <PageTransition>
      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-4xl font-display font-bold tracking-[-0.01em] text-[var(--text-primary)] mb-1">{t('about')}</h1>
          <p className="text-[13px] text-[var(--text-muted)]">
            {t('about_desc')}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[var(--brand-bg)] border border-[var(--brand)]/20 text-[var(--brand)] text-[10px] font-mono font-semibold uppercase tracking-wider" style={{ borderRadius: '4px' }}>
              <Clock className="w-3 h-3" />
              {readingTime} {t('about_reading_time')}
            </span>
          </div>
        </motion.div>

        <hr className="dotted-divider mb-8" />

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="space-y-4 text-[13px] text-[var(--text-muted)] leading-relaxed mb-8"
        >
          <p>{t('bio_p1')}</p>
          <p>{t('bio_p2')}</p>
          <p>{t('bio_p3')}</p>
        </motion.div>

        <div className="flex items-center gap-6 mb-10 p-5 bg-[var(--bg-surface)] border border-[var(--border-default)] w-fit" style={{ borderRadius: '8px' }}>
          <div className="flex flex-col">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] mb-1 flex items-center gap-1.5">
              <Verified className="w-3 h-3 text-[var(--brand)]" /> {t('signature')}
            </p>
            <p className="text-4xl font-display font-bold text-[var(--brand)] select-none">
              Felich
            </p>
          </div>
          <div className="w-px h-10 bg-[var(--border-default)]" />
          <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest flex flex-col gap-1.5 leading-none">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-[var(--success)]" /> SYS.AUTH: VERIFIED</span>
            <span>ID: FLCH-2026-X</span>
            <span className="opacity-50" suppressHydrationWarning>TS: {new Date().toLocaleDateString('en-US')}</span>
          </div>
        </div>

        <hr className="dotted-divider mb-12" />

        {/* Career Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              {t('timeline_title')}
            </h2>
            <p className="text-[var(--text-muted)] text-sm">
              {t('timeline_desc')}
            </p>
          </div>

          <CareerTimeline />
        </motion.section>

        <hr className="dotted-divider mb-8" />

        {/* Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[var(--brand)]" /> {t('testimonials_title')}
          </h2>
          <p className="text-[var(--text-muted)] text-sm mb-6">{t('testimonials_desc')}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group p-6 rounded-3xl border border-[var(--border-default)] bg-[var(--glass-bg)] backdrop-blur-xl hover:border-[var(--brand)]/30 transition-all duration-300 hover:shadow-[0_10px_40px_var(--brand-bg)] flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl text-[var(--brand)]/20 mb-2 font-serif group-hover:text-[var(--brand)]/40 transition-colors">
                    <Quote className="fill-current" />
                  </div>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed mb-6 font-medium relative z-10">
                    {t.text}
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-default)]">
                  <div className="w-10 h-10 rounded-full bg-[var(--text-primary)] text-[var(--bg-base)] border border-[var(--border-default)] flex items-center justify-center text-sm font-bold shadow-inner">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-muted)] group-hover:from-[var(--brand)] group-hover:to-[var(--brand-strong,var(--brand))] transition-all">
                      {t.name}
                    </h4>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </PageTransition>
  );
}
