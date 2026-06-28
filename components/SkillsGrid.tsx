'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SkillIcons } from '@/components/SkillIcons';
import AnimatedDivider from '@/components/AnimatedDivider';
import Reveal from '@/components/Reveal';
import { sounds } from '@/lib/sounds';

// ── Static data ─────────────────────────────────────────────────────────────
// Moved here from page.tsx so it is only bundled as part of the async chunk
// that loads when the skills section scrolls into view (via LazySection +
// next/dynamic). The main page.tsx no longer pays the cost of loading 74 KB of
// SVG icon data on first paint.

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
  'IBM': 'https://www.ibm.com/',
  'Langflow': 'https://www.langflow.org/',
  'GSAP': 'https://gsap.com/',
  'Sanity CMS': 'https://www.sanity.io/',
  'Vitest': 'https://vitest.dev/',
  'Playwright': 'https://playwright.dev/',
  'Gemini AI': 'https://deepmind.google/technologies/gemini/',
  'Canvas API': 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API',
  'Lenis': 'https://lenis.darkroom.engineering/',
  'Smooth Scroll': 'https://lenis.darkroom.engineering/',
};

// ── Component ────────────────────────────────────────────────────────────────

export default function SkillsGrid() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredSkills = activeFilter === 'All'
    ? skills
    : skills.filter(s => s.category === activeFilter);

  return (
    <section className="mb-16">
      <AnimatedDivider className="mb-8" />

      <Reveal>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span className="text-lg">{'</>'}</span>
          {t('stats_skills')}
        </h2>
      </Reveal>

      <Reveal delay={0.4}>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
          {t('skills_subtitle')}
        </p>
      </Reveal>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {skillCategories.map((cat) => {
          const localizedName = cat.name === 'All' ? t('skills_filter_all') :
                                cat.name === 'Frontend' ? t('skills_filter_frontend') :
                                cat.name === 'Backend' ? t('skills_filter_backend') :
                                cat.name === 'Database' ? t('skills_filter_database') :
                                cat.name === 'Tools' ? t('skills_filter_tools') : cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => { setActiveFilter(cat.name); sounds.playPop(); }}
              onMouseEnter={() => sounds.playHover()}
              className={`filter-pill ${activeFilter === cat.name ? 'active' : ''}`}
            >
              {localizedName}
              <span className="ml-1.5 text-xs opacity-70">{cat.count}</span>
            </button>
          );
        })}
      </div>

      {/* Skills grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{
          visible: { transition: { staggerChildren: 0.02 } },
          hidden: {}
        }}
        className="flex flex-wrap gap-2 md:gap-3"
      >
        <AnimatePresence>
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.name}
              layout
              onMouseEnter={() => sounds.playHover()}
              onClick={() => {
                sounds.playPop();
                const link = skillLinks[skill.name];
                if (link) window.open(link, '_blank');
              }}
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 15 } }}
              exit={{ opacity: 0, scale: 0.8, y: -10, transition: { duration: 0.2 } }}
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
              className="skill-card group relative flex items-center gap-2 md:gap-2.5 px-3 py-1.5 md:px-4 md:py-2.5 rounded-xl md:rounded-2xl text-xs md:text-sm font-semibold
                         bg-white/50 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200 dark:border-neutral-800
                         cursor-pointer overflow-hidden transition-all duration-300"
              style={{
                '--skill-color': skill.color,
                '--skill-glow': `${skill.color}60`,
                '--skill-drop-shadow': `drop-shadow(0 0 5px ${skill.color}50)`
              } as React.CSSProperties}
            >
              {/* Background Tint on Hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none hidden lg:block bg-[var(--skill-color)]"
              />

              {/* Logo Indicator */}
              <motion.div
                className="relative w-4 h-4 md:w-5 md:h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center p-0.5 [filter:var(--skill-drop-shadow)]"
              >
                {SkillIcons[skill.slug] ? (
                  <div className="w-full h-full flex items-center justify-center text-[var(--skill-color)]">
                    {SkillIcons[skill.slug]}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-[10px] text-[var(--skill-color)]">
                    {skill.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </motion.div>

              <span className="relative z-10 text-neutral-600 dark:text-neutral-300 transition-colors duration-300 group-hover:text-black dark:group-hover:text-white">
                {skill.name}
              </span>

              {/* Technical Meta-Data Tooltip */}
              <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-[7px] font-mono text-neutral-400 uppercase tracking-tighter">
                    Spec v1.0
                 </span>
              </div>

              <div className="absolute inset-0 bg-white/95 dark:bg-neutral-950/90 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center px-4 z-20">
                 <div className="flex items-center justify-between mb-1">
                    <span className="text-[7px] font-bold font-mono tracking-widest text-primary/70 uppercase">
                      {skill.category}
                    </span>
                    <span className="text-[7px] font-mono text-neutral-400">VER_1.2</span>
                 </div>

                 <div className="flex items-center justify-between pointer-events-none">
                    <span className="text-[9px] font-mono font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-tighter">Expertise</span>
                    <span className="text-[9px] font-bold font-mono text-primary">
                      {(skill.name.length * 7 + 38) % 30 + 70}%
                    </span>
                 </div>

                 <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 mt-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(skill.name.length * 7 + 38) % 30 + 70}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-blue-600 to-primary"
                    />
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
