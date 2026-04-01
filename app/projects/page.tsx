'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { triggerImpact } from '@/lib/impact';
import Reveal from '@/components/Reveal';

const projectTypes = ['All', 'Web', 'Mobile'];
const projectCategories = ['All', 'Personal Project', 'Freelance'];

const projects = [
  {
    title: 'Felich Portfolio',
    description: 'Personal website & portfolio, built from scratch using Next.js, TypeScript, Tailwind CSS, and Express.js.',
    image: null,
    type: 'Web',
    category: 'Personal Project',
    featured: true,
    techStack: ['Next.js', 'TypeScript', 'TailwindCSS', 'Express.js'],
    links: {
      github: 'https://github.com/felichpehagasaginting-code',
      live: '/',
    },
  },
  {
    title: 'AI/ML Pipeline',
    description: 'Machine learning pipeline for financial data analysis with quantitative modeling capabilities.',
    image: null,
    type: 'Web',
    category: 'Personal Project',
    featured: false,
    techStack: ['Python', 'TensorFlow', 'PostgreSQL', 'Docker'],
    links: {
      github: 'https://github.com/felichpehagasaginting-code',
    },
  },
  {
    title: 'FinTech Dashboard',
    description: 'A robust financial platform with real-time data visualization and transaction processing.',
    image: null,
    type: 'Web',
    category: 'Freelance',
    featured: false,
    techStack: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
    links: {
      github: 'https://github.com/felichpehagasaginting-code',
    },
  },
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
    image: null,
    type: 'Web',
    category: 'Freelance',
    featured: false,
    techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe'],
    links: {
      github: 'https://github.com/felichpehagasaginting-code',
    },
  },
];

export default function Projects() {
  const [activeType, setActiveType] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const filtered = projects.filter(p =>
    (activeType === 'All' || p.type === activeType) &&
    (activeCategory === 'All' || p.category === activeCategory)
  );

  return (
    <div>
      <Reveal width="100%">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Projects</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            A showcase of both private and open-source projects I&apos;ve built or contributed to.
          </p>
        </div>
      </Reveal>

      <hr className="dotted-divider mb-8" />

      {/* Type filter */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Type</span>
        <div className="flex gap-2">
          {projectTypes.map((type) => (
            <button
              key={type}
              onClick={() => { setActiveType(type); sounds.playPop(); }}
              onMouseEnter={() => sounds.playHover()}
              className={`filter-pill text-xs ${activeType === type ? 'active' : ''}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Category</span>
        <div className="flex flex-wrap gap-2">
          {projectCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); sounds.playPop(); }}
              onMouseEnter={() => sounds.playHover()}
              className={`filter-pill text-xs ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <motion.div
              layoutId={`project-card-${project.title}`}
              key={project.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => { setSelectedProject(project as any); triggerImpact(); sounds.playPop(); }}
              onMouseEnter={() => sounds.playHover()}
              className="group cursor-pointer rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image placeholder (Blueprint Style) */}
              <motion.div layoutId={`project-image-${project.title}`} className="h-44 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 relative overflow-hidden transition-colors group-hover:from-blue-500/10 group-hover:to-purple-500/10">
                <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                {project.featured && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-[10px] uppercase font-bold tracking-widest rounded-md flex items-center gap-1.5 shadow-lg shadow-pink-500/20 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> Featured
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700 ease-out z-0">
                  <svg className="w-16 h-16 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
              </motion.div>

              {/* Content */}
              <div className="p-5">
                <motion.h3 layoutId={`project-title-${project.title}`} className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                  {project.title}
                </motion.h3>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4">
                  {project.description}
                </div>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="text-xs font-semibold text-primary flex items-center gap-1">
                  View Case Study
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-12 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-alias"
            />
            
            <motion.div
              layoutId={`project-card-${selectedProject.title}`}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white/95 dark:bg-neutral-950/90 backdrop-blur-3xl rounded-[2rem] border border-white/50 dark:border-neutral-800/80 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-y-auto overflow-x-hidden scrollbar-hide"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-50 p-2.5 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-neutral-800 dark:text-white rounded-full transition-all backdrop-blur-md hover:rotate-90"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>

              <motion.div layoutId={`project-image-${selectedProject.title}`} className="h-64 sm:h-80 bg-gradient-to-b from-blue-500/10 to-transparent dark:from-blue-500/20 relative flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(#3b82f6 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
                
                {/* Simulated Data Stream Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/5 to-transparent h-[200%] animate-scan" style={{ animationDuration: '3s' }}></div>

                <motion.svg 
                  initial={{ scale: 0.8, rotateX: 45, opacity: 0 }}
                  animate={{ scale: 1, rotateX: 0, opacity: 1 }}
                  transition={{ duration: 0.8, type: 'spring' }}
                  className="w-32 h-32 text-blue-500/40 dark:text-blue-500/60 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </motion.svg>
              </motion.div>

              <div className="p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold rounded-full text-neutral-600 dark:text-neutral-300">
                    {selectedProject.type}
                  </span>
                  <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold rounded-full text-neutral-600 dark:text-neutral-300">
                    {selectedProject.category}
                  </span>
                </div>

                <motion.h2 layoutId={`project-title-${selectedProject.title}`} className="text-3xl md:text-5xl font-bold mb-6">
                  {selectedProject.title}
                </motion.h2>

                <div className="flex flex-wrap gap-2 mb-10">
                  {selectedProject.techStack.map((tech: string) => (
                    <span key={tech} className="px-3 py-1 text-sm rounded-lg bg-primary/10 text-primary font-medium">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="md:col-span-2 space-y-8">
                    <section>
                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <span className="text-primary">💡</span> The Problem
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        Traditional solutions lacked the performance and scalability needed for the modern web. There was a critical need for an architecture that combines real-time data processing with extremely intuitive user interfaces, heavily demanding rapid prototyping and state management optimizations.
                      </p>
                    </section>
                    
                    <section>
                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <span className="text-green-500">✅</span> The Solution
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                        Leveraging <strong>Next.js App Router</strong> for dynamic SSR and <strong>Tailwind CSS</strong> for rapid UI iteration, we built a monolithic repository. It extensively uses <em>Framer Motion</em> to provide fluid micro-interactions, reducing perceived latency and increasing overall user engagement.
                      </p>
                      <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        The <strong>{selectedProject.title}</strong> ensures that data payloads are strictly typed with TypeScript, drastically lowering runtime errors.
                      </p>
                    </section>
                  </div>

                  <div className="space-y-6 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-2xl h-fit">
                    <h3 className="text-lg font-bold mb-4 border-b border-neutral-200 dark:border-neutral-700 pb-2">Links & Resources</h3>
                    
                    {selectedProject.links.github && (
                      <a href={selectedProject.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 rounded-xl hover:shadow-md transition-shadow group">
                        <svg className="w-5 h-5 text-neutral-700 dark:text-neutral-300 group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-primary transition-colors">GitHub Repository</span>
                      </a>
                    )}
                    
                    {selectedProject.links.live && (
                      <a href={selectedProject.links.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-primary text-white rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-shadow">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                        <span className="text-sm font-bold">Live Preview</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
