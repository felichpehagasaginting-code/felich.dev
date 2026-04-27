'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { triggerImpact } from '@/lib/impact';
import Reveal from '@/components/Reveal';
import Image from 'next/image';
import TiltCard from './TiltCard';
import { useProjectLikes } from '@/lib/useProjectLikes';

const projectTypes = ['All', 'Web', 'Mobile'];
const projectCategories = ['All', 'Personal Project', 'Freelance'];

export default function ProjectsClient({ projects }: { projects: any[] }) {
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
            <TiltCard key={project.title}>
              <motion.div
                layoutId={`project-card-${project.title}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => { setSelectedProject(project); triggerImpact(); sounds.playPop(); }}
                onMouseEnter={() => sounds.playHover()}
                className="group cursor-pointer rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Image placeholder / Real Image */}
                <motion.div layoutId={`project-image-${project.title}`} className="h-44 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 relative overflow-hidden transition-colors group-hover:from-blue-500/10 group-hover:to-purple-500/10" style={{ transform: "translateZ(30px)" }}>
                  <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                  
                  {project.slug && (
                    <Image
                      src={`/images/projects/${project.slug}.png`}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 z-0"
                      priority={i < 2}
                    />
                  )}

                  {project.featured && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-[10px] uppercase font-bold tracking-widest rounded-md flex items-center gap-1.5 shadow-lg shadow-pink-500/20 z-10">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> Featured
                    </span>
                  )}
                  {!project.slug && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700 ease-out z-0">
                      <svg className="w-16 h-16 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                      </svg>
                    </div>
                  )}
                </motion.div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col" style={{ transform: "translateZ(40px)" }}>
                  <motion.h3 layoutId={`project-title-${project.title}`} className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </motion.h3>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4">
                    {project.description}
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                    {(project.techStack || []).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-[10px] rounded-full bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 font-bold tracking-tight border border-neutral-200/50 dark:border-neutral-700/50 group-hover:border-primary/30 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs font-semibold text-primary flex items-center gap-1 mt-2">
                    View Case Study
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
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
              className="relative w-full max-w-4xl max-h-[90vh] bg-white/70 dark:bg-neutral-900/60 backdrop-blur-[40px] rounded-[2.5rem] border border-white/40 dark:border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col sm:flex-row ring-1 ring-black/5 dark:ring-white/5"
            >
              <div className="sm:w-2/5 relative h-64 sm:h-auto border-b sm:border-b-0 sm:border-r border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent">
                <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(#3b82f6 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-neutral-900/80 to-transparent sm:hidden z-10"></div>
                
                {selectedProject.slug && (
                  <Image
                    src={`/images/projects/${selectedProject.slug}.png`}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    priority
                  />
                )}

                <div className="absolute inset-0 flex items-center justify-center p-12 pointer-events-none z-0">
                   <motion.div
                     initial={{ rotateY: 45, rotateX: -20, scale: 0.8, opacity: 0 }}
                     animate={{ rotateY: 0, rotateX: 0, scale: 1, opacity: 1 }}
                     transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
                     className={`relative ${selectedProject.slug ? 'opacity-0' : 'opacity-100'}`}
                   >
                     <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
                     <svg className="w-24 h-24 text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                     </svg>
                   </motion.div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="sticky top-0 z-50 p-6 flex justify-between items-center bg-white/40 dark:bg-black/20 backdrop-blur-md border-b border-white/20 dark:border-white/5">
                   <div className="flex gap-2">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-md border border-primary/20">{selectedProject.type}</span>
                      <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800/80 text-neutral-500 text-[10px] font-bold uppercase tracking-widest rounded-md border border-neutral-200 dark:border-neutral-700/50">{selectedProject.category}</span>
                   </div>
                   <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 bg-neutral-200/50 dark:bg-neutral-800/50 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-full transition-all group"
                  >
                    <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>

                <div className="p-8 md:p-10">
                  <motion.h2 layoutId={`project-title-${selectedProject.title}`} className="text-4xl font-extrabold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-neutral-900 via-neutral-600 to-neutral-400 dark:from-white dark:via-neutral-300 dark:to-neutral-500">
                    {selectedProject.title}
                  </motion.h2>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {(selectedProject.techStack || []).map((tech: string) => (
                      <span key={tech} className="px-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5 font-bold text-neutral-600 dark:text-neutral-300">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="prose dark:prose-invert max-w-none prose-p:text-neutral-600 dark:prose-p:text-neutral-400 prose-p:leading-relaxed mb-12">
                      <p className="text-lg font-medium text-neutral-800 dark:text-neutral-200">{selectedProject.description}</p>
                      <hr className="my-6 border-neutral-200 dark:border-neutral-800" />
                      <p>Architected with a focus on performance, user experience, and technical excellence. This project represents a deep dive into solving complex engineering challenges through modern software patterns.</p>
                  </div>

                  <div className="space-y-4 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-6">Execution & Resources</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProject.github && (
                        <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 p-4 bg-neutral-900 text-white rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-black/10 group">
                          <div className="flex items-center gap-3">
                             <svg className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                             <span className="text-sm font-bold">Source Code</span>
                          </div>
                          <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7"/></svg>
                        </a>
                      )}
                      
                      {selectedProject.live && selectedProject.live !== "" && (
                        <a href={selectedProject.live} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 p-4 bg-primary text-white rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 group">
                          <div className="flex items-center gap-3">
                             <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                             <span className="text-sm font-bold">Live System</span>
                          </div>
                          <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7"/></svg>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Like Button */}
                  <ProjectLikeButton slug={selectedProject.slug || selectedProject.title?.toLowerCase().replace(/\s+/g, '-')} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-component: Like button per project ──────────────────────────────────
function ProjectLikeButton({ slug }: { slug: string }) {
  const { likes, hasLiked, loading, toggleLike } = useProjectLikes(slug);

  return (
    <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
      <motion.button
        onClick={toggleLike}
        disabled={hasLiked || loading}
        whileHover={!hasLiked ? { scale: 1.06 } : {}}
        whileTap={!hasLiked ? { scale: 0.92 } : {}}
        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
          hasLiked
            ? 'bg-pink-50 dark:bg-pink-950/30 text-pink-500 border border-pink-200 dark:border-pink-800/50 cursor-default'
            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-pink-50 dark:hover:bg-pink-950/20 hover:text-pink-500 hover:border-pink-200'
        }`}
      >
        <motion.span
          animate={hasLiked ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          {hasLiked ? '❤️' : '🤍'}
        </motion.span>
        <span>{loading ? '—' : likes}</span>
        <span className="font-normal opacity-70">{hasLiked ? 'Liked!' : 'Like this project'}</span>
      </motion.button>
      {hasLiked && (
        <span className="text-xs text-neutral-400 font-mono">Synced to Firebase ✓</span>
      )}
    </div>
  );
}
