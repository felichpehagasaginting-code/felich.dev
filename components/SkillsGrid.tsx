'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SkillIcons } from '@/components/SkillIcons';
import AnimatedDivider from '@/components/AnimatedDivider';
import Reveal from '@/components/Reveal';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const skillCategories = [
  { name: 'All', count: 52 },
  { name: 'Frontend', count: 18 },
  { name: 'Backend', count: 14 },
  { name: 'Database', count: 6 },
  { name: 'Tools', count: 14 },
];

const skills = [
  { name: 'HTML', color: '#e34f26', category: 'Frontend', slug: 'html5' },
  { name: 'CSS', color: '#1572b6', category: 'Frontend', slug: 'css3' },
  { name: 'JavaScript', color: '#f7df1e', category: 'Frontend', slug: 'javascript' },
  { name: 'TypeScript', color: '#3178c6', category: 'Frontend', slug: 'typescript' },
  { name: 'React.js', color: '#61dafb', category: 'Frontend', slug: 'react' },
  { name: 'Next.js', color: '#000000', category: 'Frontend', slug: 'nextdotjs' },
  { name: 'TailwindCSS', color: '#06b6d4', category: 'Frontend', slug: 'tailwindcss' },
  { name: 'Bootstrap', color: '#7952b3', category: 'Frontend', slug: 'bootstrap' },
  { name: 'Framer Motion', color: '#0055ff', category: 'Frontend', slug: 'framer' },
  { name: 'Vite', color: '#646cff', category: 'Frontend', slug: 'vite' },
  { name: 'Redux', color: '#764abc', category: 'Frontend', slug: 'redux' },
  { name: 'Shadcn UI', color: '#000000', category: 'Frontend', slug: 'shadcnui' },
  { name: 'GSAP', color: '#88ce02', category: 'Frontend', slug: 'gsap' },
  { name: 'Canvas API', color: '#ff6b6b', category: 'Frontend', slug: 'canvas' },
  { name: 'Node.js', color: '#339933', category: 'Backend', slug: 'nodedotjs' },
  { name: 'Express.js', color: '#000000', category: 'Backend', slug: 'express' },
  { name: 'Python', color: '#3776ab', category: 'Backend', slug: 'python' },
  { name: 'Go', color: '#00add8', category: 'Backend', slug: 'go' },
  { name: 'PHP', color: '#777bb4', category: 'Backend', slug: 'php' },
  { name: 'Laravel', color: '#ff2d20', category: 'Backend', slug: 'laravel' },
  { name: 'Prisma', color: '#2d3748', category: 'Backend', slug: 'prisma' },
  { name: 'Sanity CMS', color: '#f03e2f', category: 'Backend', slug: 'sanity' },
  { name: 'PostgreSQL', color: '#4169e1', category: 'Database', slug: 'postgresql' },
  { name: 'MySQL', color: '#4479a1', category: 'Database', slug: 'mysql' },
  { name: 'MongoDB', color: '#47a248', category: 'Database', slug: 'mongodb' },
  { name: 'Firebase', color: '#ffca28', category: 'Database', slug: 'firebase' },
  { name: 'Supabase', color: '#3ecf8e', category: 'Database', slug: 'supabase' },
  { name: 'Git', color: '#f05032', category: 'Tools', slug: 'git' },
  { name: 'GitHub', color: '#181717', category: 'Tools', slug: 'github' },
  { name: 'Docker', color: '#2496ed', category: 'Tools', slug: 'docker' },
  { name: 'VS Code', color: '#007acc', category: 'Tools', slug: 'visualstudiocode' },
  { name: 'Postman', color: '#ff6c37', category: 'Tools', slug: 'postman' },
  { name: 'npm', color: '#cb3837', category: 'Tools', slug: 'npm' },
  { name: 'Vercel', color: '#000000', category: 'Tools', slug: 'vercel' },
  { name: 'Vitest', color: '#729b1b', category: 'Tools', slug: 'vitest' },
  { name: 'Playwright', color: '#2ead33', category: 'Tools', slug: 'playwright' },
  { name: 'Gemini AI', color: '#1a73e8', category: 'Tools', slug: 'geminiai' },
  { name: 'Rust', color: '#dea584', category: 'Backend', slug: 'rust' },
  { name: 'PyTorch', color: '#ee4c2c', category: 'Backend', slug: 'pytorch' },
  { name: 'TensorFlow', color: '#ff6f00', category: 'Backend', slug: 'tensorflow' },
  { name: 'Svelte', color: '#ff3e00', category: 'Frontend', slug: 'svelte' },
  { name: 'React Query', color: '#ff4154', category: 'Frontend', slug: 'reactquery' },
  { name: 'tRPC', color: '#398ad7', category: 'Backend', slug: 'trpc' },
  { name: 'Claude', color: '#D97757', category: 'Tools', slug: 'claude' },
  { name: 'Redis', color: '#dc382d', category: 'Database', slug: 'redis' },
  { name: 'Linux', color: '#fcc624', category: 'Tools', slug: 'linux' },
  { name: 'Cloudflare', color: '#f38020', category: 'Tools', slug: 'cloudflare' },
  { name: 'IBM', color: '#0530AD', category: 'Backend', slug: 'ibm' },
  { name: 'Langflow', color: '#1B1B1B', category: 'Tools', slug: 'langflow' },
  { name: 'REST API', color: '#009688', category: 'Backend', slug: 'postman' },
  { name: 'Lenis', color: '#ff0000', category: 'Frontend', slug: 'lenis' },
  { name: 'Smooth Scroll', color: '#000000', category: 'Frontend', slug: 'scroll' },
];

const marqueeSkills = skills.slice(0, 18);

const skillLinks: Record<string, string> = {
  'HTML': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  'CSS': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  'JavaScript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  'TypeScript': 'https://www.typescriptlang.org/',
  'React.js': 'https://react.dev/',
  'Next.js': 'https://nextjs.org/',
  'TailwindCSS': 'https://tailwindcss.com/',
  'Bootstrap': 'https://getbootstrap.com/',
  'Framer Motion': 'https://www.framer.com/motion/',
  'Vite': 'https://vitejs.dev/',
  'Redux': 'https://redux.js.org/',
  'Shadcn UI': 'https://ui.shadcn.com/',
  'Node.js': 'https://nodejs.org/',
  'Express.js': 'https://expressjs.com/',
  'Python': 'https://www.python.org/',
  'Go': 'https://go.dev/',
  'PHP': 'https://www.php.net/',
  'Laravel': 'https://laravel.com/',
  'Prisma': 'https://www.prisma.io/',
  'PostgreSQL': 'https://www.postgresql.org/',
  'MySQL': 'https://www.mysql.com/',
  'MongoDB': 'https://www.mongodb.com/',
  'Firebase': 'https://firebase.google.com/',
  'Supabase': 'https://supabase.com/',
  'Git': 'https://git-scm.com/',
  'GitHub': 'https://github.com/',
  'Docker': 'https://www.docker.com/',
  'VS Code': 'https://code.visualstudio.com/',
  'Postman': 'https://www.postman.com/',
  'npm': 'https://www.npmjs.com/',
  'Vercel': 'https://vercel.com/',
  'Vitest': 'https://vitest.dev/',
  'Playwright': 'https://playwright.dev/',
  'Gemini AI': 'https://deepmind.google/technologies/gemini/',
  'GSAP': 'https://greensock.com/gsap/',
  'Canvas API': 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API',
  'Rust': 'https://www.rust-lang.org/',
  'PyTorch': 'https://pytorch.org/',
  'TensorFlow': 'https://www.tensorflow.org/',
  'Svelte': 'https://svelte.dev/',
  'React Query': 'https://tanstack.com/query',
  'tRPC': 'https://trpc.io/',
  'Claude': 'https://claude.ai/',
  'Redis': 'https://redis.io/',
  'Linux': 'https://www.kernel.org/',
  'Cloudflare': 'https://www.cloudflare.com/',
  'IBM': 'https://www.ibm.com/',
  'Langflow': 'https://www.langflow.org/',
  'REST API': 'https://restfulapi.net/',
  'Lenis': 'https://lenis.darkroom.engineering/',
  'Smooth Scroll': 'https://lenis.darkroom.engineering/',
};

export default function SkillsGrid() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('All');
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = marqueeTrackRef.current;
        if (!track) return;

        // Dynamic speed horizontal ticker
        const tween = gsap.to(track, {
          xPercent: -50,
          repeat: -1,
          duration: 25,
          ease: 'none',
        });

        // Scroll velocity acceleration binding
        ScrollTrigger.create({
          onUpdate: (self) => {
            const v = Math.abs(self.getVelocity());
            const timeScale = gsap.utils.clamp(1, 4, 1 + v / 500);
            gsap.to(tween, { timeScale, duration: 0.3, overwrite: 'auto' });
            gsap.to(tween, { timeScale: 1, duration: 1.2, delay: 0.3, ease: 'power2.out' });
          },
        });

        // Hover deceleration
        track.addEventListener('mouseenter', () => {
          gsap.to(tween, { timeScale: 0.2, duration: 0.5 });
        });
        track.addEventListener('mouseleave', () => {
          gsap.to(tween, { timeScale: 1, duration: 0.5 });
        });
      });
    },
    { scope: sectionRef }
  );

  const filteredSkills =
    activeFilter === 'All' ? skills : skills.filter((s) => s.category === activeFilter);

  return (
    <section ref={sectionRef} className="mb-16 space-y-8">
      <AnimatedDivider className="mb-4" />

      <div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
          <span className="text-xl text-[var(--brand)] font-mono">{'</>'}</span>
          {t('stats_skills')}
        </h2>
        <p className="text-xs md:text-sm text-[var(--text-muted)]">
          {t('skills_subtitle')}
        </p>
      </div>

      {/* ── Dynamic Infinite GSAP Marquee Ribbon ─────────────────────── */}
      <div className="relative w-full overflow-hidden py-3 bg-[var(--bg-surface)] border-y border-[var(--border-default)] rounded-2xl">
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[var(--bg-surface)] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[var(--bg-surface)] to-transparent z-10 pointer-events-none" />

        <div ref={marqueeTrackRef} className="flex gap-4 w-max select-none cursor-grab">
          {[...marqueeSkills, ...marqueeSkills].map((skill, index) => (
            <div
              key={`${skill.name}-${index}`}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-default)] text-xs font-mono font-semibold text-[var(--text-primary)] whitespace-nowrap shadow-xs hover:border-[var(--brand)] transition-colors"
            >
              <div className="w-4 h-4 flex items-center justify-center text-[var(--brand)]">
                {SkillIcons[skill.slug] || skill.name.slice(0, 2)}
              </div>
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {skillCategories.map((cat) => {
          const localizedName =
            cat.name === 'All'
              ? t('skills_filter_all')
              : cat.name === 'Frontend'
              ? t('skills_filter_frontend')
              : cat.name === 'Backend'
              ? t('skills_filter_backend')
              : cat.name === 'Database'
              ? t('skills_filter_database')
              : cat.name === 'Tools'
              ? t('skills_filter_tools')
              : cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveFilter(cat.name)}
              className={`filter-pill text-xs font-mono ${activeFilter === cat.name ? 'active' : ''}`}
            >
              {localizedName}
              <span className="ml-1.5 text-[10px] opacity-70">({cat.count})</span>
            </button>
          );
        })}
      </div>

      {/* Skills grid */}
      <div className="flex flex-wrap gap-2 md:gap-2.5">
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.name}
              layout
              onClick={() => {
                const link = skillLinks[skill.name];
                if (link) window.open(link, '_blank');
              }}
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { type: 'spring', stiffness: 220, damping: 18 },
              }}
              exit={{ opacity: 0, scale: 0.85, y: -10, transition: { duration: 0.15 } }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="skill-card group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-default)] cursor-pointer overflow-hidden transition-all duration-300 hover:border-[var(--brand)] hover:shadow-sm"
            >
              <div className="w-4 h-4 flex items-center justify-center text-[var(--brand)]">
                {SkillIcons[skill.slug] || (
                  <span className="font-bold text-[9px]">{skill.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <span className="text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
