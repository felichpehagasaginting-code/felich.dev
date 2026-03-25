'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import TypingAnimation from '@/components/TypingAnimation';
import AnimatedCounter from '@/components/AnimatedCounter';
import PageTransition from '@/components/PageTransition';

const skillCategories = [
  { name: 'All', count: 32 },
  { name: 'Frontend', count: 12 },
  { name: 'Backend', count: 8 },
  { name: 'Database', count: 5 },
  { name: 'Tools', count: 7 },
];

const skills = [
  { name: 'HTML', color: '#e34f26', category: 'Frontend' },
  { name: 'CSS', color: '#1572b6', category: 'Frontend' },
  { name: 'JavaScript', color: '#f7df1e', category: 'Frontend' },
  { name: 'TypeScript', color: '#3178c6', category: 'Frontend' },
  { name: 'React.js', color: '#61dafb', category: 'Frontend' },
  { name: 'Next.js', color: '#000000', category: 'Frontend' },
  { name: 'TailwindCSS', color: '#06b6d4', category: 'Frontend' },
  { name: 'Bootstrap', color: '#7952b3', category: 'Frontend' },
  { name: 'Framer Motion', color: '#0055ff', category: 'Frontend' },
  { name: 'Vite', color: '#646cff', category: 'Frontend' },
  { name: 'Redux', color: '#764abc', category: 'Frontend' },
  { name: 'Shadcn UI', color: '#000000', category: 'Frontend' },
  { name: 'Node.js', color: '#339933', category: 'Backend' },
  { name: 'Express.js', color: '#000000', category: 'Backend' },
  { name: 'Python', color: '#3776ab', category: 'Backend' },
  { name: 'Go', color: '#00add8', category: 'Backend' },
  { name: 'PHP', color: '#777bb4', category: 'Backend' },
  { name: 'Laravel', color: '#ff2d20', category: 'Backend' },
  { name: 'Prisma', color: '#2d3748', category: 'Backend' },
  { name: 'REST API', color: '#009688', category: 'Backend' },
  { name: 'PostgreSQL', color: '#4169e1', category: 'Database' },
  { name: 'MySQL', color: '#4479a1', category: 'Database' },
  { name: 'MongoDB', color: '#47a248', category: 'Database' },
  { name: 'Firebase', color: '#ffca28', category: 'Database' },
  { name: 'Supabase', color: '#3ecf8e', category: 'Database' },
  { name: 'Git', color: '#f05032', category: 'Tools' },
  { name: 'GitHub', color: '#181717', category: 'Tools' },
  { name: 'Docker', color: '#2496ed', category: 'Tools' },
  { name: 'VS Code', color: '#007acc', category: 'Tools' },
  { name: 'Postman', color: '#ff6c37', category: 'Tools' },
  { name: 'npm', color: '#cb3837', category: 'Tools' },
  { name: 'Vercel', color: '#000000', category: 'Tools' },
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filteredSkills = activeFilter === 'All'
    ? skills
    : skills.filter(s => s.category === activeFilter);

  return (
    <PageTransition>
      <div>
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Hi, I&apos;m{' '}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x pb-2 inline-block">
              Felich
            </span>
          </h1>

          <div className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 font-medium mb-4 h-8">
            <TypingAnimation
              texts={[
                'Software Engineer',
                'AI/ML Enthusiast',
                'Full Stack Developer',
                'FinTech Builder',
                'Open Source Contributor',
              ]}
            />
          </div>

          <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            <span className="flex items-center gap-1.5">
              <span>•</span>
              Based in Indonesia 🇮🇩
            </span>
            <span className="flex items-center gap-1.5">
              <span>•</span>
              Onsite
            </span>
          </div>

          <div className="space-y-4 text-neutral-600 dark:text-neutral-300 leading-relaxed">
            <p>
              A Software Engineer dedicated to building impactful digital solutions. I specialize in developing
              scalable web platforms and AI-driven systems using a modern tech stack, primarily Next.js, TypeScript,
              Python, and Node.js.
            </p>
            <p>
              My focus is on crafting software architecture that is well-structured, maintainable, and aligned with
              business goals. I combine technical expertise with proactive communication and leadership to ensure
              every project delivers logical clarity and a meaningful real-world impact.
            </p>
          </div>
        </motion.section>

        {/* Stats Counter Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-12"
        >
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
        </motion.section>

        {/* Skills Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <hr className="dotted-divider mb-8" />

          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <span className="text-lg">{'</>'}</span>
            Skills
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
            My professional skills.
          </p>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {skillCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveFilter(cat.name)}
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
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill) => (
                <motion.div
                  key={skill.name}
                  layout
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, y: 15 },
                    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 15 } }
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -4,
                    transition: { type: 'spring', stiffness: 400, damping: 10 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="skill-card group relative flex items-center gap-2 md:gap-2.5 px-3 py-1.5 md:px-4 md:py-2.5 rounded-xl md:rounded-2xl text-xs md:text-sm font-semibold 
                             bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800
                             cursor-default overflow-hidden transition-all duration-300"
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

                  {/* Dot indicator with glow */}
                  <div
                    className="relative w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ 
                      backgroundColor: skill.color, 
                      boxShadow: `0 0 12px ${skill.color}90` 
                    }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full animate-ping opacity-0 group-hover:opacity-60 hidden lg:block" 
                      style={{ backgroundColor: skill.color }} 
                    />
                  </div>

                  <span className="relative z-10 text-neutral-600 dark:text-neutral-300 transition-colors duration-300 group-hover:text-black dark:group-hover:text-white">
                    {skill.name}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.section>

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
