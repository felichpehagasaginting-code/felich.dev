'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import {
  Quote,
  Verified,
  ShieldCheck,
  MessageSquare,
  Clock,
  Sparkles,
  Download,
  ExternalLink,
  Cpu,
  Server,
  Code2,
  Network,
  Palette,
  Zap,
  CheckCircle2,
  Terminal,
  Layers,
  GraduationCap,
  Award,
  FolderGit2,
} from 'lucide-react';
import CareerTimeline from '@/components/CareerTimeline';
import { useTranslation } from 'react-i18next';
import { introAudio } from '@/lib/introAudio';

const CORE_COMPETENCIES = [
  {
    title: 'AI & Intelligent Systems',
    icon: Cpu,
    proficiency: 'Advanced',
    color: 'from-blue-500 to-indigo-600',
    skills: ['Autonomous AI Agents', 'LLM Prompt Engineering', 'PyTorch / TensorFlow', 'Computer Vision (OpenCV)', 'RAG & Vector Embeddings'],
    description: 'Designing multimodal reasoning loops, on-device Edge AI inference, and autonomous tool-calling pipelines.',
  },
  {
    title: 'Fullstack & Systems Architecture',
    icon: Code2,
    proficiency: 'Production Ready',
    color: 'from-cyan-500 to-blue-600',
    skills: ['Next.js 16 App Router', 'TypeScript', 'Python & Node.js', 'PostgreSQL & Supabase', 'REST & GraphQL APIs'],
    description: 'Constructing robust web applications with deterministic type safety, server components, and responsive state management.',
  },
  {
    title: 'Linux Systems & Virtualization',
    icon: Server,
    proficiency: 'Enterprise Grade',
    color: 'from-orange-500 to-red-600',
    skills: ['Ubuntu 24.04 LTS (Kernel 6.8)', 'VirtualBox Hypervisor', 'Docker Containerization', 'SELinux & Systemd', 'RHEL Administration'],
    description: 'Configuring isolated virtualization environments, container microservices, and secure Linux server deployments.',
  },
  {
    title: 'Network Simulation & Routing',
    icon: Network,
    proficiency: 'Intermediate',
    color: 'from-purple-500 to-pink-600',
    skills: ['MikroTik RouterOS', 'Cisco CCNA Track', 'VLAN & Firewall Rules', 'MQTT / LoRa Gateways', 'Traffic Engineering'],
    description: 'Simulating multi-node network topologies, routing protocols (OSPF), and IoT gateway failover mechanisms.',
  },
  {
    title: 'UI/UX & High-Performance Motion',
    icon: Palette,
    proficiency: 'Mastery',
    color: 'from-emerald-500 to-teal-600',
    skills: ['Framer Motion & WAAPI', 'Tailwind CSS Glassmorphism', 'HTML5 Canvas API', 'Accessible WCAG Design', 'Micro-interactions'],
    description: 'Crafting fluid 60FPS motion interfaces, custom shader canvases, and accessible, responsive design tokens.',
  },
];

const ENGINEERING_PRINCIPLES = [
  {
    title: 'Deterministic CI & Type Safety',
    subtitle: 'Zero Runtime Surprises',
    icon: ShieldCheck,
    desc: 'Every commit passes strict verification gates: ESLint rules, 100% TypeScript type checking, and unit testing.',
  },
  {
    title: 'Zero-Bloat Performance',
    subtitle: 'Sub-Second Response',
    icon: Zap,
    desc: 'Prioritizing native Web APIs, efficient bundle splitting, and zero-runtime CSS variables for snappy interactions.',
  },
  {
    title: 'AI-Augmented Architecture',
    subtitle: 'High Velocity Engineering',
    icon: Sparkles,
    desc: 'Leveraging frontier LLMs (Gemini & Claude) as cognitive force multipliers for system design and code verification.',
  },
  {
    title: 'Aesthetic & Human-Centric UI',
    subtitle: 'Intuitive & Memorable',
    icon: Layers,
    desc: 'Combining glassmorphic depth, harmonious color palettes, and micro-audio feedback into unforgettable software.',
  },
];

export default function About() {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: t('testimonial_1_name'),
      role: t('testimonial_1_role'),
      initials: 'PC',
      text: t('testimonial_1_text'),
    },
    {
      name: t('testimonial_2_name'),
      role: t('testimonial_2_role'),
      initials: 'AM',
      text: t('testimonial_2_text'),
    },
    {
      name: t('testimonial_3_name'),
      role: t('testimonial_3_role'),
      initials: 'CL',
      text: t('testimonial_3_text'),
    },
  ];

  const bioContent = t('bio_p1') + ' ' + t('bio_p2') + ' ' + t('bio_p3');
  const readingTime = Math.ceil(bioContent.split(' ').length / 200);

  const downloadCV = () => {
    introAudio.playTick(1.0);
    window.print();
  };

  return (
    <PageTransition>
      <div className="space-y-12 pb-8">
        {/* ── Header & Action Bar ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-[var(--text-primary)]">
                About Felich
              </h1>
              <p className="text-[13px] md:text-sm text-[var(--text-muted)] mt-1">
                Software Engineer • AI Systems Developer &amp; Systems Enthusiast
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={downloadCV}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--brand)] text-[var(--brand-contrast)] font-semibold text-xs hover:brightness-110 shadow-sm transition-all cursor-pointer"
                title="Print or Save CV as PDF"
              >
                <Download size={14} />
                <span>Save CV (PDF)</span>
              </button>
              <a
                href="https://www.linkedin.com/in/felich-pehagasa-ginting-b6a8a32a6/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-default)] font-semibold text-xs hover:bg-[var(--border-default)] transition-all"
              >
                <span>LinkedIn</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* ── Quick Stats Ticker Bar ─────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
                <GraduationCap size={13} className="text-[var(--brand)]" />
                <span>Academic IPK</span>
              </div>
              <p className="text-xl font-display font-bold text-[var(--success)]">3.89 <span className="text-xs text-[var(--text-muted)] font-normal">/ 4.0</span></p>
              <p className="text-[10px] font-mono text-[var(--text-muted)]">Semesters 1 &amp; 2</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
                <FolderGit2 size={13} className="text-[var(--brand)]" />
                <span>Flagship Projects</span>
              </div>
              <p className="text-xl font-display font-bold text-[var(--text-primary)]">8+ Built</p>
              <p className="text-[10px] font-mono text-[var(--text-muted)]">AI, Web &amp; IoT Stack</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
                <Award size={13} className="text-[var(--brand)]" />
                <span>Accreditations</span>
              </div>
              <p className="text-xl font-display font-bold text-[var(--text-primary)]">12+ Awards</p>
              <p className="text-[10px] font-mono text-[var(--text-muted)]">IBM, OSN &amp; Google</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
                <ShieldCheck size={13} className="text-[var(--success)]" />
                <span>Undergraduate</span>
              </div>
              <p className="text-xl font-display font-bold text-[var(--text-primary)]">D4 TRPL</p>
              <p className="text-[10px] font-mono text-[var(--text-muted)]">Cohort 2025 – 2029</p>
            </div>
          </div>
        </motion.div>

        <hr className="dotted-divider" />

        {/* ── Story & Bio ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-display font-bold text-[var(--text-primary)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />
            Background &amp; Engineering Story
          </h2>

          <div className="space-y-3.5 text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
            <p>{t('bio_p1')}</p>
            <p>{t('bio_p2')}</p>
            <p>{t('bio_p3')}</p>
          </div>

          {/* System Signature Badge */}
          <div className="flex items-center gap-6 mt-6 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] w-fit">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] mb-0.5 flex items-center gap-1">
                <Verified className="w-3 h-3 text-[var(--brand)]" />
                <span>Verified System Signature</span>
              </p>
              <p className="text-2xl font-display font-bold text-[var(--brand)] select-none">
                Felich Pehagasa Ginting
              </p>
            </div>
            <div className="w-px h-8 bg-[var(--border-default)]" />
            <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider space-y-1">
              <span className="flex items-center gap-1 text-[var(--success)] font-semibold">
                <ShieldCheck className="w-3 h-3" /> SYS.AUTH: VERIFIED
              </span>
              <span>ID: FLCH-2026-X</span>
            </div>
          </div>
        </motion.div>

        <hr className="dotted-divider" />

        {/* ── Core Competencies & Skills Radar Matrix ─────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-xl font-display font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[var(--brand)]" />
              Core Competencies &amp; Technical Capabilities
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Comprehensive architectural capabilities across software engineering, artificial intelligence, and infrastructure domains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CORE_COMPETENCIES.map((comp) => (
              <motion.div
                key={comp.title}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--brand)] hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${comp.color} flex items-center justify-center text-white shadow-xs`}>
                      <comp.icon size={18} />
                    </div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">
                      {comp.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[var(--brand-bg)] text-[var(--brand)]">
                    {comp.proficiency}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {comp.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {comp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-[10px] font-mono rounded bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <hr className="dotted-divider" />

        {/* ── Engineering Principles Bento Grid ──────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-xl font-display font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[var(--brand)]" />
              Engineering Philosophy &amp; How I Build Systems
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Foundational design and software engineering principles guiding every architectural decision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ENGINEERING_PRINCIPLES.map((principle) => (
              <motion.div
                key={principle.title}
                whileHover={{ y: -3, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--brand)] transition-all space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[var(--brand-bg)] text-[var(--brand)] flex items-center justify-center">
                    <principle.icon size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">
                      {principle.title}
                    </h3>
                    <p className="text-[10px] font-mono text-[var(--text-muted)]">
                      {principle.subtitle}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-1">
                  {principle.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <hr className="dotted-divider" />

        {/* ── Career & Academic Timeline ──────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-xl font-display font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--brand)]" />
              Career Timeline &amp; Milestone Roadmap
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Chronological milestones across engineering projects, academia, and technical achievements.
            </p>
          </div>

          <CareerTimeline />
        </motion.section>

        <hr className="dotted-divider" />

        {/* ── Testimonials ────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-xl font-display font-bold text-[var(--text-primary)] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[var(--brand)]" />
              Peer &amp; Mentor Testimonials
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Feedback from collaborators, instructors, and peers on engineering collaboration and problem solving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--brand)] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <Quote size={24} className="text-[var(--brand)] opacity-40" />
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed italic">
                    &quot;{item.text}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-[var(--border-default)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--brand-bg)] text-[var(--brand)] font-bold text-xs flex items-center justify-center border border-[var(--border-default)]">
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[var(--text-primary)]">{item.name}</h4>
                    <p className="text-[10px] font-mono text-[var(--text-muted)]">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </PageTransition>
  );
}
