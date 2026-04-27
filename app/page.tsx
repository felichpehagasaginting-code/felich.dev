'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import TypingAnimation from '@/components/TypingAnimation';
import AnimatedCounter from '@/components/AnimatedCounter';
import PageTransition from '@/components/PageTransition';
import Hero3DWrapper from '@/components/Hero3DWrapper';
import AnimatedDivider from '@/components/AnimatedDivider';
import Reveal from '@/components/Reveal';
import { sounds } from '@/lib/sounds';
import { SkillIcons } from '@/components/SkillIcons';
import Terminal from '@/components/Terminal';
import SpotifyWidget from '@/components/SpotifyWidget';
import LiveVisitorBadge from '@/components/LiveVisitorBadge';
import Script from 'next/script';


const skillCategories = [
  { name: 'All', count: 50 },
  { name: 'Frontend', count: 16 },
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
  'Canvas API': 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API'
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [localTime, setLocalTime] = useState('');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredSkills = activeFilter === 'All'
    ? skills
    : skills.filter(s => s.category === activeFilter);

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
              whileHover={{ 
                perspective: 1000,
                rotateX: 1,
                rotateY: -1,
                transition: { type: 'spring', stiffness: 400, damping: 20 }
              }}
              className="flex-1 relative z-20"
            >
              <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter leading-[1.1] md:leading-tight px-0.5 overflow-visible">
                Hi, I&apos;m{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x pb-4 inline-block drop-shadow-sm">
                  Felich
                </span>
              </h1>

              <div className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 font-medium mb-8 min-h-[3.5rem] md:min-h-[2rem] relative z-10 px-0.5 overflow-visible">
                <TypingAnimation
                  texts={[
                    'Software Engineer',
                    'AI Engineer',
                    'DevOps Engineer',
                    'Fullstack Developer',
                  ]}
                />
              </div>

                <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-sm text-neutral-500 dark:text-neutral-400 mb-8 relative z-10">
                  <div className="flex items-center gap-2 group cursor-help relative">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span>Based in Indonesia 🇮🇩</span>
                    
                    {/* Time Tooltip */}
                    <div className="absolute -top-10 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3 py-1 rounded-lg text-xs font-mono shadow-xl whitespace-nowrap pointer-events-none z-50">
                      Local Time: {localTime} (WIB)
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 group cursor-default">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span>Available for Onsite</span>
                  </div>
                  
                  <div className="w-full sm:w-auto">
                    <SpotifyWidget />
                  </div>
                </div>

              <div className="space-y-4 text-neutral-600 dark:text-neutral-300 leading-relaxed relative z-10">
                <p>
                  A versatile engineer (Fullstack, AI/ML, & DevOps) dedicated to building impactful digital solutions. I specialize in developing
                  scalable web platforms and AI-driven systems using a modern tech stack, primarily Next.js, TypeScript,
                  Python, and Node.js.
                </p>
                <p>
                  My focus is on crafting software architecture that is well-structured, maintainable, and aligned with
                  business goals. I combine technical expertise with proactive communication and leadership to ensure
                  every project delivers logical clarity and a meaningful real-world impact.
                </p>
              </div>

              {/* Live Visitor Badge */}
              <div className="mt-6">
                <LiveVisitorBadge path="home" showViews />
              </div>
            </motion.div>
            
            <div className="w-full md:w-1/3 flex-shrink-0 animate-fade-in pointer-events-auto z-10 hover:cursor-grab active:cursor-grabbing interactive-element">
              <Hero3DWrapper />
            </div>
          </section>
        </Reveal>

        {/* Stats Counter Section */}
        <Reveal width="100%" delay={0.4}>
          <section className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center group hover:shadow-md hover:-translate-y-0.5 transition-all">
                <AnimatedCounter end={32} className="text-3xl font-bold text-primary" suffix="+" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Skills</p>
              </div>
              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center group hover:shadow-md hover:-translate-y-0.5 transition-all">
                <AnimatedCounter end={8} className="text-3xl font-bold text-primary" suffix="+" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Achievements</p>
              </div>
              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center group hover:shadow-md hover:-translate-y-0.5 transition-all">
                <AnimatedCounter end={4} className="text-3xl font-bold text-primary" suffix="+" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Projects</p>
              </div>
              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center group hover:shadow-md hover:-translate-y-0.5 transition-all">
                <AnimatedCounter end={2} className="text-3xl font-bold text-primary" suffix="+" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Years Exp.</p>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Interactive Terminal Section */}
        <Reveal width="100%" delay={0.2}>
          <section className="mb-16">
            <Terminal />
          </section>
        </Reveal>

        {/* Skills Section */}
        <section className="mb-16">
          <AnimatedDivider className="mb-8" />

          <Reveal>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span className="text-lg">{'</>'}</span>
              Skills
            </h2>
          </Reveal>
          
          <Reveal delay={0.4}>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
              My professional skills. Click to learn more.
            </p>
          </Reveal>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {skillCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => { setActiveFilter(cat.name); sounds.playPop(); }}
                onMouseEnter={() => sounds.playHover()}
                className={`filter-pill ${activeFilter === cat.name ? 'active' : ''}`}
              >
                {cat.name}
                <span className="ml-1.5 text-xs opacity-70">{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Skills grid */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
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
                    boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="skill-card group relative flex items-center gap-2 md:gap-2.5 px-3 py-1.5 md:px-4 md:py-2.5 rounded-xl md:rounded-2xl text-xs md:text-sm font-semibold 
                             bg-white/50 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200 dark:border-neutral-800
                             cursor-pointer overflow-hidden transition-all duration-300"
                  style={{
                    '--skill-color': skill.color,
                    '--skill-glow': `${skill.color}60`
                  } as React.CSSProperties}
                >
                  {/* Background Tint on Hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none hidden lg:block"
                    style={{ backgroundColor: skill.color }}
                  />

                  {/* Logo Indicator */}
                  <motion.div
                    className="relative w-4 h-4 md:w-5 md:h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center p-0.5"
                    style={{ 
                      filter: `drop-shadow(0 0 5px ${skill.color}50)` 
                    }}
                  >
                    {SkillIcons[skill.slug] ? (
                      <div className="w-full h-full flex items-center justify-center" style={{ color: skill.color }}>
                        {SkillIcons[skill.slug]}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-[10px]" style={{ color: skill.color }}>
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
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-600 to-primary"
                        />
                     </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Keyboard shortcut hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Press{' '}
            <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-[10px] font-mono">
              Ctrl+K
            </kbd>{' '}
            to open command palette
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
