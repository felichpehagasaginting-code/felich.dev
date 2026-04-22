'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Briefcase, GraduationCap, MapPin, Calendar, ExternalLink } from 'lucide-react';

interface TimelineEvent {
  type: 'work' | 'education' | 'milestone';
  year: string;
  title: string;
  subtitle: string;
  location: string;
  period: string;
  description: string;
  tags?: string[];
  link?: string;
  color: string;
  icon: 'work' | 'education' | 'milestone';
}

const timelineData: TimelineEvent[] = [
  {
    type: 'education',
    year: '2025',
    title: 'D4 Software Engineering Technology',
    subtitle: 'Politeknik Kelapa Sawit Citra Widya Edukasi',
    location: 'Indonesia',
    period: '2025 – 2029',
    description: 'Pursuing a 4-year applied technology degree with a deep focus on software architecture, AI systems, and enterprise application development.',
    tags: ['Software Engineering', 'AI/ML', 'System Design'],
    color: 'from-pink-500 to-rose-500',
    icon: 'education',
  },
  {
    type: 'work',
    year: '2024',
    title: 'Freelance Software Engineer',
    subtitle: 'Self-Employed',
    location: 'Indonesia (Remote)',
    period: '2024 – Present',
    description: 'Building production-grade web apps, AI/ML pipelines, and FinTech solutions for clients globally. Delivering end-to-end solutions from architecture to deployment.',
    tags: ['Next.js', 'Python', 'AI Engineering', 'FinTech'],
    color: 'from-blue-500 to-indigo-600',
    icon: 'work',
  },
  {
    type: 'work',
    year: '2023',
    title: 'Fullstack Developer',
    subtitle: 'Various Client Projects',
    location: 'Indonesia',
    period: '2023 – 2024',
    description: 'Developed and delivered multiple full-stack web applications using React/Next.js, Node.js, and Python. Specialized in database optimization and scalable API design.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'REST API'],
    color: 'from-violet-500 to-purple-600',
    icon: 'work',
  },
  {
    type: 'milestone',
    year: '2022',
    title: 'Started Programming Journey',
    subtitle: 'Self-Learning',
    location: 'Indonesia',
    period: '2022',
    description: 'Began a deep-dive into software engineering — from HTML/CSS basics to modern JavaScript frameworks. Built first real-world projects and discovered a passion for AI.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Python Basics'],
    color: 'from-emerald-500 to-teal-500',
    icon: 'milestone',
  },
];

function TimelineIcon({ type }: { type: TimelineEvent['icon'] }) {
  if (type === 'education') return <GraduationCap className="w-5 h-5" />;
  if (type === 'work') return <Briefcase className="w-5 h-5" />;
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function TimelineCard({ event, index }: { event: TimelineEvent; index: number }) {
  const isLeft = index % 2 === 0;

  return (
    <div className={`relative flex items-start gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}>
      {/* Year label (desktop) */}
      <div className={`hidden md:flex flex-col items-${isLeft ? 'end' : 'start'} w-32 flex-shrink-0 pt-6`}>
        <motion.span
          initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className={`text-4xl font-black bg-gradient-to-br ${event.color} bg-clip-text text-transparent`}
        >
          {event.year}
        </motion.span>
      </div>

      {/* Center dot */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', damping: 12, delay: index * 0.1 + 0.2 }}
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${event.color} flex items-center justify-center text-white shadow-lg z-10 relative`}
        >
          <TimelineIcon type={event.icon} />
          {/* Glow */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${event.color} opacity-40 blur-md -z-10`} />
        </motion.div>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -4 }}
        className={`flex-1 mb-12 group p-5 md:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/50 backdrop-blur-xl hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)] transition-all duration-300 relative overflow-hidden`}
      >
        {/* Gradient shimmer on hover */}
        <div className={`absolute inset-0 bg-gradient-to-r ${event.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-2xl`} />

        {/* Left accent bar */}
        <div className={`absolute left-0 inset-y-0 w-1 bg-gradient-to-b ${event.color} rounded-l-2xl scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top`} />

        <div className="relative z-10">
          {/* Mobile year */}
          <span className={`md:hidden inline-block text-2xl font-black bg-gradient-to-br ${event.color} bg-clip-text text-transparent mb-1`}>
            {event.year}
          </span>

          <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
            <div>
              <h3 className="font-bold text-base md:text-lg leading-tight">{event.title}</h3>
              <p className={`text-sm font-semibold bg-gradient-to-r ${event.color} bg-clip-text text-transparent mt-0.5`}>
                {event.subtitle}
              </p>
            </div>
            {event.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-primary transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {event.location}
            </span>
            <span className="opacity-50">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              {event.period}
            </span>
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
            {event.description}
          </p>

          {event.tags && (
            <div className="flex flex-wrap gap-1.5">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2.5 py-1 rounded-full font-semibold border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function CareerTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 20%'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={containerRef} className="relative">
      {/* Animated vertical line (desktop only) */}
      <div className="hidden md:block absolute left-[8.5rem] top-0 bottom-0 w-[2px] bg-neutral-100 dark:bg-neutral-800 overflow-hidden rounded-full" style={{ left: 'calc(8.5rem + 23px)' }}>
        <motion.div
          style={{ height: lineHeight }}
          className="w-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"
        />
      </div>

      <div className="space-y-0">
        {timelineData.map((event, index) => (
          <TimelineCard key={index} event={event} index={index} />
        ))}
      </div>

      {/* Bottom cap */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        className="hidden md:flex items-center gap-3 ml-[calc(8.5rem+17px)] -mt-6"
      >
        <div className="w-12 h-6 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Now</span>
        </div>
      </motion.div>
    </section>
  );
}
