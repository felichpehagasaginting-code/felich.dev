'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Briefcase, GraduationCap, MapPin, Calendar, ExternalLink, Rocket } from 'lucide-react';

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
    subtitle: 'Automated flight price monitor',
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
    subtitle: 'Coding learning platform',
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
    subtitle: 'Decision support for estate managers',
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
    subtitle: 'Gateway portal for the IT revolution',
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
    subtitle: 'On-device FFB classification',
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
    subtitle: 'AI-powered photobooth app',
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
    subtitle: 'Simplified tech education',
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
    subtitle: '2D hack-and-slash RPG',
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
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function TimelineCard({ event, index, showYear }: { event: TimelineEvent; index: number; showYear: boolean }) {
  const isLeft = index % 2 === 0;
  const isInternal = event.link?.startsWith('/');

  return (
    <div className={`relative flex items-start gap-4 md:gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}>
      {/* Year label (desktop) */}
      <div className={`hidden md:flex flex-col items-${isLeft ? 'end' : 'start'} w-32 flex-shrink-0 pt-6`}>
        {showYear ? (
          <motion.span
            initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`text-4xl font-black bg-gradient-to-br ${event.color} bg-clip-text text-transparent`}
          >
            {event.year}
          </motion.span>
        ) : (
          <span className="h-9" aria-hidden="true" />
        )}
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
        className={`flex-1 mb-12 group p-5 md:p-6 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] backdrop-blur-xl hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden liquid-glass`}
      >
        {/* Gradient shimmer on hover */}
        <div className={`absolute inset-0 bg-gradient-to-r ${event.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-2xl`} />

        {/* Left accent bar */}
        <div className={`absolute left-0 inset-y-0 w-1 bg-gradient-to-b ${event.color} rounded-l-2xl scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top`} />

        <div className="relative z-10">
          {/* Mobile year */}
          {showYear && (
            <span className={`md:hidden inline-block text-2xl font-black bg-gradient-to-br ${event.color} bg-clip-text text-transparent mb-1`}>
              {event.year}
            </span>
          )}

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
                {...(!isInternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="p-1.5 rounded-lg bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-primary transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)] mb-3">
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

          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
            {event.description}
          </p>

          {event.tags && (
            <div className="flex flex-wrap gap-1.5">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2.5 py-1 rounded-full font-semibold border border-[var(--border-default)] bg-[var(--bg-muted)] text-[var(--text-muted)] uppercase tracking-wide"
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
      <div className="hidden md:block absolute left-[8.5rem] top-0 bottom-0 w-[2px] bg-[var(--bg-muted)] overflow-hidden rounded-full" style={{ left: 'calc(8.5rem + 23px)' }}>
        <motion.div
          style={{ height: lineHeight }}
          className="w-full bg-gradient-to-b from-[var(--brand)] via-[var(--brand)] to-transparent rounded-full"
        />
      </div>

      <div className="space-y-0">
        {timelineData.map((event, index) => (
          <TimelineCard
            key={`${event.year}-${event.title}`}
            event={event}
            index={index}
            showYear={index === 0 || timelineData[index - 1].year !== event.year}
          />
        ))}
      </div>

      {/* Bottom cap */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        className="hidden md:flex items-center gap-3 ml-[calc(8.5rem+17px)] -mt-6"
      >
        <div className="w-12 h-6 rounded-full bg-gradient-to-r from-[var(--brand-bg)] to-[var(--brand-bg)] border border-[var(--border-default)] flex items-center justify-center">
          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Now</span>
        </div>
      </motion.div>
    </section>
  );
}
