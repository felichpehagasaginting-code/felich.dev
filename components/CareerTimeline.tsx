'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, MapPin, Calendar, ExternalLink, Rocket, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { introAudio } from '@/lib/introAudio';

interface TimelineEvent {
  type: 'work' | 'education' | 'milestone' | 'project';
  year: string;
  title: string;
  subtitle: string;
  location: string;
  period: string;
  description: string;
  tags?: string[];
  link?: string;
  color: string;
  icon: 'work' | 'education' | 'milestone' | 'project';
}

const timelineData: TimelineEvent[] = [
  {
    type: 'project',
    year: '2026',
    title: 'FlightTracker',
    subtitle: 'Automated flight price monitor & Telegram notifier',
    location: 'Personal Project',
    period: 'Aug 2026',
    description: 'Real-time flight ticket price tracker for KNO→CGK routes via Playwright Google Flights scraping, paired with instant Telegram alert dispatch.',
    tags: ['JavaScript', 'Playwright', 'Node.js', 'Automation'],
    link: '/projects/flight-tracker',
    color: 'from-[var(--brand)] to-[var(--brand-strong,var(--brand))]',
    icon: 'project',
  },
  {
    type: 'project',
    year: '2026',
    title: 'PemrogramanTRPL',
    subtitle: 'Interactive coding & matriculation platform',
    location: 'Education Platform',
    period: 'Aug 2026',
    description: 'Interactive coding learning & matriculation platform for incoming TRPL students — live Python execution, quizzes, gamification, and progress tracking.',
    tags: ['Education', 'Python', 'Gamification'],
    link: '/projects/pemrograman-trpl',
    color: 'from-[var(--brand)] to-[var(--brand-strong,var(--brand))]',
    icon: 'project',
  },
  {
    type: 'project',
    year: '2026',
    title: 'Estate Harvest Rotation Planner',
    subtitle: 'Decision support system for estate managers',
    location: 'Agri-Tech',
    period: 'Jul 2026',
    description: 'Data-driven mobile decision support system automating daily FFB harvest rotation scheduling for oil palm estates using mathematical priority models.',
    tags: ['Agriculture', 'Mobile', 'Decision System'],
    link: '/projects/estate-harvest-rotation-planner',
    color: 'from-[var(--brand)] to-[var(--brand-strong,var(--brand))]',
    icon: 'project',
  },
  {
    type: 'project',
    year: '2026',
    title: 'NETTAS 2026',
    subtitle: 'High-performance gateway portal',
    location: 'Event Portal',
    period: 'Jul 2026',
    description: 'High-performance gateway portal built with modern frontend tooling — dynamic transitions, state management, and scalable layout architecture.',
    tags: ['Next.js', 'TypeScript', 'Frontend'],
    link: '/projects/nettas-2026',
    color: 'from-[var(--brand)] to-[var(--brand-strong,var(--brand))]',
    icon: 'project',
  },
  {
    type: 'project',
    year: '2026',
    title: 'Edge AI PalmOil',
    subtitle: 'On-device FFB classification on Edge AI hardware',
    location: 'Agri-Tech / IoT',
    period: 'Jun 2026',
    description: 'Automated FFB classification on MAX78000 ultra-low-power Edge AI hardware with MQTT/LoRa gateway failover, TimescaleDB, and a real-time dashboard.',
    tags: ['Edge AI', 'IoT', 'Computer Vision'],
    link: '/projects/edge-ai-palmoil',
    color: 'from-[var(--brand)] to-[var(--brand-strong,var(--brand))]',
    icon: 'project',
  },
  {
    type: 'project',
    year: '2026',
    title: 'Photobooth-AI',
    subtitle: 'Cross-platform computer vision photobooth',
    location: 'Personal Project',
    period: 'May 2026',
    description: 'Cross-platform interactive photobooth harnessing computer vision and AI — real-time background removal, style transfer, and dynamic photo filters.',
    tags: ['Computer Vision', 'AI', 'Real-time'],
    link: '/projects/photobooth-ai',
    color: 'from-[var(--brand)] to-[var(--brand-strong,var(--brand))]',
    icon: 'project',
  },
  {
    type: 'project',
    year: '2026',
    title: 'StackWay',
    subtitle: 'Ultra-simplified tech education platform',
    location: 'Education Platform',
    period: 'Apr 2026',
    description: 'Ultra-simplified tech education platform breaking complex engineering concepts into intuitive real-world analogies across 6 intensive learning paths.',
    tags: ['Education', 'Platform', 'System Design'],
    link: '/projects/stackway',
    color: 'from-[var(--brand)] to-[var(--brand-strong,var(--brand))]',
    icon: 'project',
  },
  {
    type: 'project',
    year: '2026',
    title: 'Blade Ascension',
    subtitle: '2D hack-and-slash RPG browser game',
    location: 'Game Dev',
    period: 'Mar 2026',
    description: 'Action-packed 2D hack-and-slash RPG browser game on HTML5 Canvas — custom collision detection, combo chains, particle physics, and progression.',
    tags: ['JavaScript', 'Canvas', 'Game Dev'],
    link: '/projects/blade-ascension',
    color: 'from-[var(--brand)] to-[var(--brand-strong,var(--brand))]',
    icon: 'project',
  },
  {
    type: 'education',
    year: '2025',
    title: 'D4 Software Engineering Technology',
    subtitle: 'Politeknik Kelapa Sawit Citra Widya Edukasi',
    location: 'Indonesia',
    period: '2025 – 2029',
    description: 'Pursuing a 4-year applied technology degree with a deep focus on software architecture, AI systems, and enterprise application development.',
    tags: ['Software Engineering', 'AI/ML', 'System Design'],
    color: 'from-[var(--brand)] to-[var(--brand-strong,var(--brand))]',
    icon: 'education',
  },
];

function TimelineIcon({ type }: { type: TimelineEvent['icon'] }) {
  if (type === 'education') return <GraduationCap className="w-5 h-5" />;
  if (type === 'work') return <Briefcase className="w-5 h-5" />;
  if (type === 'project') return <Rocket className="w-5 h-5" />;
  return <Sparkles className="w-5 h-5" />;
}

export default function CareerTimeline() {
  const [filterType, setFilterType] = useState<'all' | 'project' | 'education'>('all');

  const filteredEvents = timelineData.filter((event) => {
    if (filterType === 'all') return true;
    return event.type === filterType;
  });

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            introAudio.playTick(1.0);
            setFilterType('all');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-[var(--brand)] text-[var(--brand-contrast)] font-bold shadow-xs'
              : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
          }`}
        >
          All Milestones ({timelineData.length})
        </button>
        <button
          onClick={() => {
            introAudio.playTick(1.0);
            setFilterType('project');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
            filterType === 'project'
              ? 'bg-[var(--brand)] text-[var(--brand-contrast)] font-bold shadow-xs'
              : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
          }`}
        >
          🚀 Flagship Projects ({timelineData.filter((e) => e.type === 'project').length})
        </button>
        <button
          onClick={() => {
            introAudio.playTick(1.0);
            setFilterType('education');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
            filterType === 'education'
              ? 'bg-[var(--brand)] text-[var(--brand-contrast)] font-bold shadow-xs'
              : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
          }`}
        >
          🎓 Education &amp; Degree ({timelineData.filter((e) => e.type === 'education').length})
        </button>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 md:pl-8 border-l border-[var(--border-default)] space-y-8">
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event, index) => {
            const isInternal = event.link?.startsWith('/');

            return (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative group"
              >
                {/* Dot */}
                <div
                  className={`absolute -left-[31px] md:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--brand)] flex items-center justify-center shadow-xs text-[var(--brand)] group-hover:scale-110 transition-transform`}
                >
                  <div className="w-2 h-2 rounded-full bg-[var(--brand)]" />
                </div>

                {/* Card Container */}
                <div className="p-5 md:p-6 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--brand)] hover:shadow-md transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[var(--brand-bg)] text-[var(--brand)] uppercase tracking-wider">
                        {event.period}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        {event.location}
                      </span>
                    </div>

                    {event.link && (
                      isInternal ? (
                        <Link
                          href={event.link}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand)] hover:underline"
                        >
                          <span>Explore Project</span>
                          <ExternalLink size={12} />
                        </Link>
                      ) : (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand)] hover:underline"
                        >
                          <span>Explore</span>
                          <ExternalLink size={12} />
                        </a>
                      )
                    )}
                  </div>

                  <div>
                    <h3 className="text-base md:text-lg font-bold text-[var(--text-primary)]">
                      {event.title}
                    </h3>
                    <p className="text-xs font-medium text-[var(--text-muted)]">
                      {event.subtitle}
                    </p>
                  </div>

                  <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
                    {event.description}
                  </p>

                  {event.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] font-mono rounded bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-default)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
