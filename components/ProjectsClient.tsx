'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '@/components/Reveal';
import TiltCard from './TiltCard';
import { useProjectLikes } from '@/lib/useProjectLikes';
import { useTranslation } from 'react-i18next';
import { getProjectIcon } from '@/lib/projectIcons';
import { safeViewTransition } from '@/lib/viewTransitions';
import { introAudio } from '@/lib/introAudio';

const projectTypes = ['All', 'Web', 'Mobile', 'IoT'];
const projectCategories = ['All', 'Personal Project', 'Freelance'];
const projectTechs = ['All Tech', 'TypeScript', 'Python', 'Next.js', 'Flutter', 'PyTorch', 'Tailwind', 'Supabase'];

/* ── Markdown content renderer ───────────────────────────────────────── */

function renderFormattedContent(rawContent: string) {
  if (!rawContent) return null;
  const cleanText = rawContent.replace(/^---[\s\S]*?---/, '').trim();
  const lines = cleanText.split('\n');

  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('###') || trimmed.startsWith('##')) {
          const title = trimmed.replace(/^#+\s*/, '');
          return (
            <h4 key={idx} className="text-[13px] font-display font-bold text-[var(--text-primary)] pt-4 pb-1 flex items-center gap-2 border-b border-[var(--border-default)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] flex-shrink-0" />
              {title}
            </h4>
          );
        }

        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          const content = trimmed.replace(/^[-*]\s*/, '');
          const parts = content.split(/(\*\*.*?\*\*)/g);
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 text-[13px] text-[var(--text-muted)]">
              <span className="text-[var(--brand)] font-bold text-xs mt-0.5">•</span>
              <div className="flex-1">
                {parts.map((part, pIdx) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={pIdx} className="font-semibold text-[var(--text-primary)]">{part.slice(2, -2)}</strong>;
                  }
                  return part;
                })}
              </div>
            </div>
          );
        }

        const parts = trimmed.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={idx} className="text-[13px] text-[var(--text-muted)] leading-relaxed">
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={pIdx} className="font-semibold text-[var(--text-primary)]">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

/* ── Like Button ─────────────────────────────────────────────────────── */
function ProjectLikeButton({ slug }: { slug: string }) {
  const { likes, hasLiked, loading, toggleLike } = useProjectLikes(slug);
  const { t } = useTranslation();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleLike();
      }}
      disabled={hasLiked || loading}
      className={`w-full py-3 px-6 font-semibold text-[13px] flex items-center justify-center gap-3 transition-all duration-150 ${
        hasLiked
          ? 'bg-[var(--success)]/10 border border-[var(--success)]/30 text-[var(--success)] cursor-default'
          : 'bg-[var(--bg-muted)] hover:bg-[var(--brand-bg)] hover:border-[var(--brand)] text-[var(--text-primary)] border border-[var(--border-default)] active:scale-[0.98]'
      }`}
      style={{ borderRadius: '6px' }}
    >
      <svg
        className={`w-4 h-4 transition-transform duration-300 ${
          hasLiked ? 'text-[var(--success)] scale-110' : 'text-[var(--text-muted)]'
        }`}
        fill={hasLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span>{hasLiked ? t('projects_modal_liked') : t('projects_modal_like')}</span>
      <span className="px-2 py-0.5 text-[10px] font-mono bg-[var(--bg-surface)] border border-[var(--border-default)]" style={{ borderRadius: '4px' }}>
        {loading ? '—' : likes}
      </span>
    </button>
  );
}

/* ── Main Component ──────────────────────────────────────────────────── */
export default function ProjectsClient({ projects }: { projects: any[] }) {
  const { t } = useTranslation();
  const [activeType, setActiveType] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTech, setActiveTech] = useState('All Tech');
  const [modalTab, setModalTab] = useState<'overview' | 'preview'>('overview');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const filtered = projects.filter(p => {
    const matchType =
      activeType === 'All' ||
      p.type === activeType ||
      (Array.isArray(p.type) && p.type.includes(activeType));
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchTech =
      activeTech === 'All Tech' ||
      (p.techStack && p.techStack.some((tech: string) => tech.toLowerCase().includes(activeTech.toLowerCase())));
    return matchType && matchCat && matchTech;
  });


  const openProjectModal = useCallback((project: any) => {
    introAudio.playTick(1.0);
    safeViewTransition(() => {
      setSelectedProject(project);
    });
  }, []);

  const closeProjectModal = useCallback(() => {
    introAudio.playTick(0.8);
    safeViewTransition(() => {
      setSelectedProject(null);
    });
  }, []);

  // Event listener for opening project modal from AIChatbot or external triggers
  useEffect(() => {
    const handleOpenBySlug = (e: CustomEvent<string>) => {
      const targetSlug = e.detail;
      const found = projects.find(p => p.slug === targetSlug || p.title?.toLowerCase().replace(/\s+/g, '-') === targetSlug);
      if (found) {
        openProjectModal(found);
      }
    };

    window.addEventListener('open-project-modal', handleOpenBySlug as EventListener);
    return () => {
      window.removeEventListener('open-project-modal', handleOpenBySlug as EventListener);
    };
  }, [projects, openProjectModal]);

  // Keyboard navigation (J / K, Arrow keys, Enter, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProject) {
        if (e.key === 'Escape') {
          closeProjectModal();
        }
        return;
      }

      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'j' || e.key === 'J') {
        setFocusedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowLeft' || e.key === 'k' || e.key === 'K') {
        setFocusedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter' && focusedIndex >= 0 && focusedIndex < filtered.length) {
        openProjectModal(filtered[focusedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, focusedIndex, filtered, openProjectModal, closeProjectModal]);

  return (
    <div className="space-y-8">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <Reveal width="100%">
        <div className="relative p-8 md:p-10 overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-default)]" style={{ borderRadius: '8px' }}>
          {/* Blueprint grid backdrop */}
          <div className="absolute inset-0 architectural-grid pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--brand-bg)] border border-[var(--brand)]/20 text-[var(--brand)] text-[10px] font-semibold uppercase tracking-widest" style={{ borderRadius: '4px' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />
              Engineering Portfolio
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-[-0.01em] text-[var(--text-primary)]" suppressHydrationWarning>
              {t('link_projects')}
            </h1>

            <p className="text-[var(--text-muted)] text-[13px] md:text-sm leading-relaxed max-w-lg" suppressHydrationWarning>
              {t('projects_desc')}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                <span>{projects.length} Systems</span>
              </div>
              <span className="text-[var(--border-default)]">|</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />
                <span>Open Source</span>
              </div>
              <span className="text-[var(--border-default)]">|</span>
              <div className="text-[9px] text-[var(--text-muted)] font-mono">
                Keyboard: <kbd className="px-1 py-0.5 bg-[var(--bg-muted)] rounded text-[var(--text-primary)]">J</kbd>/<kbd className="px-1 py-0.5 bg-[var(--bg-muted)] rounded text-[var(--text-primary)]">K</kbd> to navigate
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-3" style={{ borderRadius: '8px' }}>
        {/* Type filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--text-muted)] mr-2" suppressHydrationWarning>
            {t('projects_filter_type')}
          </span>
          {projectTypes.map((type) => {
            const label = type === 'All' ? t('projects_filter_all') : type;
            const count = type === 'All'
              ? projects.length 
              : projects.filter(p => p.type === type || (Array.isArray(p.type) && p.type.includes(type))).length;
            return (
              <button
                key={type}
                onClick={() => {
                  introAudio.playTick(1.0);
                  setActiveType(type);
                }}
                className={`px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-150 ${
                  activeType === type
                    ? 'bg-[var(--brand)] text-[var(--brand-contrast)] shadow-sm'
                    : 'bg-[var(--bg-base)] text-[var(--text-muted)] border border-[var(--border-default)] hover:border-[var(--brand-strong)] hover:text-[var(--text-primary)]'
                }`}
                style={{ borderRadius: '6px' }}
                suppressHydrationWarning
              >
                <span>{label}</span>
                <span className={`text-[9px] px-1 py-0.5 font-mono ${
                    activeType === type ? 'bg-[var(--brand-contrast)]/15' : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
                }`} style={{ borderRadius: '4px' }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-default)]">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--text-muted)] mr-2" suppressHydrationWarning>
            {t('projects_filter_category')}
          </span>
          {projectCategories.map((cat) => {
            const label = cat === 'All' ? t('projects_filter_all') :
                          cat === 'Personal Project' ? t('projects_personal') :
                          cat === 'Freelance' ? t('projects_freelance') : cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  introAudio.playTick(1.0);
                  setActiveCategory(cat);
                }}
                className={`px-3 py-1.5 text-[11px] font-medium transition-all duration-150 ${
                  activeCategory === cat
                    ? 'bg-[var(--text-primary)] text-[var(--bg-base)] font-semibold'
                    : 'bg-transparent text-[var(--text-muted)] border border-[var(--border-default)] hover:bg-[var(--bg-muted)]'
                }`}
                style={{ borderRadius: '6px' }}
                suppressHydrationWarning
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Tech stack filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border-default)]">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--text-muted)] mr-2">
            Technology
          </span>
          {projectTechs.map((tech) => (
            <button
              key={tech}
              onClick={() => {
                introAudio.playTick(1.0);
                setActiveTech(tech);
              }}
              className={`px-2.5 py-1 text-[10px] font-mono rounded transition-all ${
                activeTech === tech
                  ? 'bg-[var(--brand-bg)] text-[var(--brand)] font-bold border border-[var(--brand)]'
                  : 'bg-[var(--bg-base)] text-[var(--text-muted)] border border-[var(--border-default)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>


      {/* ── Bento Grid Showcase 2.0 ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => {
            const icon = getProjectIcon(project.slug);
            const isFeaturedFlagship = project.featured && i === 0;
            const isFocused = focusedIndex === i;

            return (
              <div 
                key={project.title} 
                className={`${isFeaturedFlagship ? 'md:col-span-2' : 'col-span-1'}`}
              >
                <TiltCard>
                  <motion.div
                    layoutId={`project-card-${project.title}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    onClick={() => openProjectModal(project)}
                    tabIndex={0}
                    onFocus={() => setFocusedIndex(i)}
                    className={`group cursor-pointer bg-[var(--bg-surface)] border overflow-hidden transition-all duration-200 flex flex-col h-full [transform-style:preserve-3d] ${
                      isFocused 
                        ? 'border-[var(--brand)] shadow-[0_0_0_2px_var(--brand)]' 
                        : 'border-[var(--border-default)] hover:border-[var(--brand)] hover:shadow-lg'
                    }`}
                    style={{ 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      viewTransitionName: `project-card-${project.slug || i}` as any,
                    }}
                  >
                    {/* Card Header */}
                    <div className="px-5 pt-5 pb-3 border-b border-[var(--border-default)] flex items-center justify-between [transform:translateZ(30px)]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center p-1.5 bg-[var(--brand-bg)] text-[var(--brand)] border border-[var(--brand)]/15" style={{ borderRadius: '6px' }}>
                          {icon}
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-sm md:text-base text-[var(--text-primary)] tracking-tight group-hover:text-[var(--brand)] transition-colors">
                            {project.title}
                          </h3>
                          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                            {Array.isArray(project.type) ? project.type.join(' · ') : project.type}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {project.featured && (
                          <span className="px-2 py-0.5 bg-[var(--warning)]/10 border border-[var(--warning)]/25 text-[var(--warning)] text-[9px] font-semibold uppercase tracking-widest flex items-center gap-1" style={{ borderRadius: '4px' }}>
                            <span className="w-1 h-1 rounded-full bg-[var(--warning)] animate-pulse" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between [transform:translateZ(40px)]">
                      <div>
                        <p className={`text-[13px] text-[var(--text-muted)] leading-relaxed mb-4 ${isFeaturedFlagship ? 'line-clamp-3 md:line-clamp-4' : 'line-clamp-2'}`}>
                          {project.description}
                        </p>

                        {/* Feature highlights */}
                        {project.features && project.features.length > 0 && (
                          <div className={`mb-4 space-y-1.5 ${isFeaturedFlagship ? 'grid grid-cols-1 md:grid-cols-2 gap-2 space-y-0' : ''}`}>
                            {project.features.slice(0, isFeaturedFlagship ? 4 : 2).map((feat: string, fIdx: number) => (
                              <div key={fIdx} className="flex items-center gap-2 text-[11px] text-[var(--text-primary)] font-medium">
                                <span className="w-1 h-1 rounded-full bg-[var(--brand)] flex-shrink-0" />
                                <span className="truncate">{feat}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer & Quick actions */}
                      <div className="pt-3 border-t border-[var(--border-default)] space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex flex-wrap gap-1">
                            {(project.techStack || []).slice(0, isFeaturedFlagship ? 6 : 4).map((tech: string) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 text-[10px] bg-[var(--bg-muted)] text-[var(--text-muted)] font-semibold border border-[var(--border-default)]"
                                style={{ borderRadius: '4px' }}
                              >
                                {tech}
                              </span>
                            ))}
                            {(project.techStack || []).length > (isFeaturedFlagship ? 6 : 4) && (
                              <span className="px-1.5 py-0.5 text-[10px] bg-[var(--bg-muted)] text-[var(--text-muted)] font-semibold" style={{ borderRadius: '4px' }}>
                                +{(project.techStack || []).length - (isFeaturedFlagship ? 6 : 4)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--brand-bg)] rounded transition-colors"
                                title="View GitHub Repository"
                                aria-label="GitHub repository"
                              >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                              </a>
                            )}
                            {project.live && (
                              <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 text-[var(--brand)] hover:bg-[var(--brand-bg)] rounded transition-colors"
                                title="Open Live System"
                                aria-label="Live system demo"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--brand)] group-hover:translate-x-0.5 transition-transform">
                          <span>View Case Study</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </TiltCard>
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Architecture Deep-Dives ──────────────────────────────────── */}
      {filtered.length > 0 && (
        <section className="mt-12 pt-8 border-t border-[var(--border-default)] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                Engineering Deep-Dives
              </h2>
              <p className="text-[11px] text-[var(--text-muted)] mt-1 font-mono uppercase tracking-wider">
                Architecture · Technical Stack · Implementation
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {filtered.map((proj) => (
              <div
                key={proj.slug || proj.title}
                className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4"
                style={{ borderRadius: '8px' }}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[var(--brand-bg)] text-[var(--brand)] text-[10px] font-semibold uppercase tracking-wider" style={{ borderRadius: '4px' }}>
                        {Array.isArray(proj.type) ? proj.type.join(' / ') : proj.type}
                      </span>
                      <span className="px-2 py-0.5 bg-[var(--bg-muted)] text-[var(--text-muted)] text-[10px] font-semibold uppercase tracking-wider" style={{ borderRadius: '4px' }}>
                        {proj.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-display font-bold text-[var(--text-primary)] tracking-tight">
                      {proj.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1.5 bg-[var(--text-primary)] text-[var(--bg-base)] hover:brightness-110 transition-all"
                        style={{ borderRadius: '6px' }}
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        Repo
                      </a>
                    )}

                    {proj.live && proj.live !== "" && (
                      <a
                        href={proj.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1.5 bg-[var(--brand)] text-[var(--brand-contrast)] hover:brightness-110 transition-all"
                        style={{ borderRadius: '6px' }}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                        Live
                      </a>
                    )}
                  </div>
                </div>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1">
                  {(proj.techStack || []).map((tech: string) => (
                    <span key={tech} className="px-2 py-0.5 text-[10px] font-semibold bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-default)]" style={{ borderRadius: '4px' }}>
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Features */}
                {proj.features && proj.features.length > 0 && (
                  <div className="p-4 bg-[var(--bg-base)] border border-[var(--border-default)]" style={{ borderRadius: '6px' }}>
                    <h5 className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2">Key Capabilities</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {proj.features.map((feat: string, fIdx: number) => (
                        <div key={fIdx} className="flex items-center gap-2 text-[11px] font-medium text-[var(--text-primary)]">
                          <span className="w-1 h-1 rounded-full bg-[var(--brand)] flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content */}
                {proj.content && (
                  <div className="pt-2">
                    {renderFormattedContent(proj.content)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Case Study Modal ─────────────────────────────────────────── */}
      {hasMounted && createPortal(
        <AnimatePresence>
          {selectedProject && (
            <div key="modal-overlay-container" className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto">
              <motion.div
                key="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeProjectModal}
                className="fixed inset-0 bg-[var(--scrim)] backdrop-blur-sm cursor-alias z-0"
              />
              
              <motion.div
                key={`modal-card-${selectedProject.slug || selectedProject.title}`}
                initial={{ opacity: 0, scale: 0.97, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 16 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-3xl max-h-[85vh] bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-[0_24px_80px_rgba(0,0,0,0.15)] overflow-y-auto overflow-x-hidden"
                style={{ borderRadius: '8px' }}
              >
                {/* Sticky header */}
                <div className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center bg-[var(--bg-surface)]/90 backdrop-blur-md border-b border-[var(--border-default)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center p-1 bg-[var(--brand-bg)] text-[var(--brand)]" style={{ borderRadius: '6px' }}>
                      {getProjectIcon(selectedProject.slug)}
                    </div>
                    <div className="flex gap-1.5">
                      <span className="px-2 py-0.5 bg-[var(--brand-bg)] text-[var(--brand)] text-[10px] font-semibold uppercase tracking-wider" style={{ borderRadius: '4px' }}>
                        {Array.isArray(selectedProject.type) ? selectedProject.type.join(' / ') : selectedProject.type}
                      </span>
                      <span className="px-2 py-0.5 bg-[var(--bg-muted)] text-[var(--text-muted)] text-[10px] font-semibold uppercase tracking-wider" style={{ borderRadius: '4px' }}>
                        {selectedProject.category === 'Personal Project' ? t('projects_personal') :
                         selectedProject.category === 'Freelance' ? t('projects_freelance') : selectedProject.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closeProjectModal}
                    className="p-2 bg-[var(--bg-muted)] hover:bg-[var(--brand-bg)] text-[var(--text-primary)] transition-all group"
                    aria-label="Close"
                    title="Close"
                    style={{ borderRadius: '6px' }}
                  >
                    <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 space-y-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold tracking-[-0.01em] text-[var(--text-primary)] mb-2">
                      {selectedProject.title}
                    </h2>
                    <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Modal Tabs */}
                  <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-2">
                    <button
                      onClick={() => setModalTab('overview')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        modalTab === 'overview'
                          ? 'bg-[var(--brand)] text-[var(--brand-contrast)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      📖 Overview &amp; Architecture
                    </button>
                    <button
                      onClick={() => setModalTab('preview')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        modalTab === 'preview'
                          ? 'bg-[var(--brand)] text-[var(--brand-contrast)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      🎬 Live Demo &amp; Preview
                    </button>
                  </div>

                  {modalTab === 'preview' ? (
                    /* Live Demo Sandbox View */
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] p-6 text-center space-y-4">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-[var(--brand-bg)] text-[var(--brand)] flex items-center justify-center">
                          {getProjectIcon(selectedProject.slug)}
                        </div>
                        <div className="max-w-md mx-auto space-y-1">
                          <h4 className="font-display font-bold text-base text-[var(--text-primary)]">
                            {selectedProject.title} Interactive Sandbox
                          </h4>
                          <p className="text-xs text-[var(--text-muted)]">
                            {selectedProject.live
                              ? 'This project is live and running on production cloud infrastructure.'
                              : 'This system is hosted as an open-source technical architecture on GitHub.'}
                          </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 pt-2">
                          {selectedProject.live && (
                            <a
                              href={selectedProject.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-2.5 rounded-xl bg-[var(--brand)] text-[var(--brand-contrast)] font-semibold text-xs hover:brightness-110 shadow-md transition-all flex items-center gap-2"
                            >
                              <span>Launch Production App</span>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                            </a>
                          )}
                          {selectedProject.github && (
                            <a
                              href={selectedProject.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-2.5 rounded-xl bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-default)] font-semibold text-xs hover:bg-[var(--border-default)] transition-all flex items-center gap-2"
                            >
                              <span>View Source on GitHub</span>
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Overview View */
                    <>
                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedProject.techStack || []).map((tech: string) => (
                          <span key={tech} className="px-2.5 py-1 text-[11px] bg-[var(--bg-muted)] border border-[var(--border-default)] font-semibold text-[var(--text-muted)]" style={{ borderRadius: '4px' }}>
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Features */}
                      {selectedProject.features && selectedProject.features.length > 0 && (
                        <div className="p-4 bg-[var(--bg-base)] border border-[var(--border-default)]" style={{ borderRadius: '6px' }}>
                          <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] mb-3">Key Capabilities</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {selectedProject.features.map((feat: string, fIdx: number) => (
                              <div key={fIdx} className="flex items-center gap-2 text-[11px] font-medium text-[var(--text-primary)]">
                                <span className="w-1 h-1 rounded-full bg-[var(--brand)] flex-shrink-0" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}


                  {/* Body content */}
                  {selectedProject.content && (
                    <div>
                      {renderFormattedContent(selectedProject.content)}
                    </div>
                  )}

                  {/* Resources */}
                  <div className="space-y-3 pt-6 border-t border-[var(--border-default)]">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">{t('projects_modal_resources')}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProject.github && (
                        <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 p-3 bg-[var(--text-primary)] text-[var(--bg-base)] hover:brightness-110 transition-all group" style={{ borderRadius: '6px' }}>
                          <div className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                            <span className="text-[11px] font-semibold">{t('projects_modal_source')}</span>
                          </div>
                          <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7"/></svg>
                        </a>
                      )}
                      
                      {selectedProject.live && selectedProject.live !== "" && (
                        <a href={selectedProject.live} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 p-3 bg-[var(--brand)] text-[var(--brand-contrast)] hover:brightness-110 transition-all group" style={{ borderRadius: '6px' }}>
                          <div className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                            <span className="text-[11px] font-semibold">{t('projects_modal_live')}</span>
                          </div>
                          <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7"/></svg>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Like button */}
                  <ProjectLikeButton slug={selectedProject.slug || selectedProject.title?.toLowerCase().replace(/\s+/g, '-')} />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
