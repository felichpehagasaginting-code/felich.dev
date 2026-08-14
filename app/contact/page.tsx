'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import CopyButton from '@/components/CopyButton';
import { Calendar, Download, Sparkles, Send, CheckCircle2, MessageSquare, ArrowRight, Clock, MapPin, Globe, Mail, Rocket, Briefcase, Handshake, Coffee } from 'lucide-react';
import { introAudio } from '@/lib/introAudio';

const GithubIcon = ({ size = 24 }: { size?: number; strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
);

const InstagramIcon = ({ size = 24 }: { size?: number; strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);

const LinkedinIcon = ({ size = 24 }: { size?: number; strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);

const QUICK_INTENTS = [
  {
    id: 'project',
    label: 'New Project / Freelance',
    icon: Rocket,
    template: "Hi Felich, I have an upcoming project and would love to collaborate with you. Here are the initial details:\n\n- Scope / Goal: \n- Timeline: ",
  },
  {
    id: 'job',
    label: 'Job / Internship Offer',
    icon: Briefcase,
    template: "Hi Felich, we're impressed by your engineering portfolio and would like to discuss an opportunity with our team at [Company Name].",
  },
  {
    id: 'ai',
    label: 'AI / ML Collaboration',
    icon: Handshake,
    template: "Hi Felich, I'm working on an intelligent AI/ML system and saw your work. Let's connect to discuss potential synergy!",
  },
  {
    id: 'chat',
    label: 'Coffee & Quick Chat',
    icon: Coffee,
    template: "Hi Felich, loved your portfolio and wanted to reach out to connect and talk about tech/software engineering!",
  },
];

const BUDGET_OPTIONS = [
  '< $1,000',
  '$1,000 - $3,000',
  '$3,000 - $5,000',
  '$5,000+',
  'Custom / Negotiable',
];

const socials = [
  {
    title: 'Stay in Touch',
    subtitle: 'Reach out via email for inquiries or collaborations.',
    cta: 'Go to Gmail',
    href: 'mailto:felichpehagasaginting@gmail.com',
    gradient: 'from-red-600 to-red-700',
    icon: Mail,
    fullWidth: true,
  },
  {
    title: 'Follow My Journey',
    subtitle: 'Follow my creative journey.',
    cta: 'Go to Instagram',
    href: 'https://www.instagram.com/fel.comp',
    gradient: 'from-pink-500 via-purple-500 to-orange-400',
    icon: InstagramIcon,
  },
  {
    title: "Let's Connect",
    subtitle: 'Connect with me professionally.',
    cta: 'Go to LinkedIn',
    href: 'https://www.linkedin.com/in/felich-pehagasa-ginting-b6a8a32a6/',
    gradient: 'from-blue-600 to-cyan-600',
    icon: LinkedinIcon,
  },
  {
    title: 'Explore the Code',
    subtitle: 'Explore my open-source work.',
    cta: 'Go to GitHub',
    href: 'https://github.com/felichpehagasaginting-code',
    gradient: 'from-neutral-800 to-neutral-900',
    icon: GithubIcon,
  },
  {
    title: 'Google Sites',
    subtitle: 'View my portfolio site.',
    cta: 'Go to Google Sites',
    href: 'https://sites.google.com/view/felichs-portfolio',
    gradient: 'from-emerald-600 to-teal-700',
    icon: Globe,
  },
];



export default function Contact() {
  const [selectedIntent, setSelectedIntent] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);

  const handleSelectIntent = useCallback((intent: typeof QUICK_INTENTS[0]) => {
    setSelectedIntent(intent.id);
    setFormData(prev => ({
      ...prev,
      message: intent.template,
    }));
    introAudio.playTick(0.8);
  }, []);

  const downloadVCard = useCallback(() => {
    introAudio.playTick(1.0);
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Ginting;Felich;Pehagasa;;',
      'FN:Felich Pehagasa Ginting',
      'TITLE:Software Engineer (AI & FinTech)',
      'EMAIL;TYPE=INTERNET,WORK:felichpehagasaginting@gmail.com',
      'URL:https://felich.dev',
      'ADR;TYPE=WORK:;;Indonesia;;;;',
      'NOTE:Software Engineer specializing in AI Engineering & FinTech architecture.',
      'END:VCARD',
    ].join('\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'felich-pehagasa-ginting.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          inquiryType: selectedIntent || 'general',
          budget: selectedBudget || undefined,
        }),
      });

      if (res.ok) {
        introAudio.playChime();
        setStatus({
          type: 'success',
          message: 'Message sent successfully! Thanks for reaching out — I will get back to you soon 🚀',
        });
        setFormData({ name: '', email: '', message: '' });
        setSelectedIntent('');
        setSelectedBudget('');
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again or email directly.',
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Network error. Please check your connection or send an email directly.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden md:block">
          <MessageSquare size={120} />
        </div>

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-bg)] border border-[var(--brand)]/20 text-[var(--brand)] text-[10px] font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
            Open for Opportunities
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-[var(--text-primary)]">
            Let&apos;s Build Something Great Together
          </h1>

          <p className="text-[13px] md:text-sm text-[var(--text-muted)] leading-relaxed">
            Have a project in mind, an internship or full-time inquiry, or simply want to connect? 
            Feel free to send a message or book a quick 15-minute sync.
          </p>

          {/* Quick Action Utilities Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={downloadVCard}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-muted)] hover:bg-[var(--brand-bg)] hover:text-[var(--brand)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--brand)] transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Download size={14} />
              <span>Save Contact (.vcf)</span>
            </button>

            <button
              onClick={() => setMeetingModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--brand)] hover:brightness-110 text-[var(--brand-contrast)] transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Calendar size={14} />
              <span>Schedule 15-min Call</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Meeting Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {meetingModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMeetingModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-0 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[var(--brand-bg)] text-[var(--brand)] flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[var(--text-primary)]">Schedule 15-min Call</h3>
                    <p className="text-[11px] font-mono text-[var(--text-muted)]">Google Meet · Timezone Asia/Jakarta (WIB)</p>
                  </div>
                </div>
                <button
                  onClick={() => setMeetingModalOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-muted)]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs text-[var(--text-muted)] leading-relaxed">
                <div className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-default)] space-y-2">
                  <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
                    <Clock size={14} className="text-[var(--brand)]" />
                    <span>15 Minutes Discovery &amp; Intro</span>
                  </div>
                  <p>
                    A casual conversation to align on engineering goals, technical stack, or full-time/internship opportunities.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-mono text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5"><MapPin size={12} /> Indonesia (UTC+7)</span>
                  <span className="flex items-center gap-1.5"><Globe size={12} /> Remote / On-site</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="mailto:felichpehagasaginting@gmail.com?subject=Schedule%2015-min%20Meeting&body=Hi%20Felich,%0A%0AI%20would%20like%20to%20schedule%20a%2015-minute%20intro%20call.%0A%0AProposed%20Date/Time:%20%0ATopic:%20"
                  className="flex-1 py-3 px-4 rounded-xl bg-[var(--brand)] text-[var(--brand-contrast)] font-semibold text-xs text-center hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Request Meeting via Email</span>
                  <ArrowRight size={14} />
                </a>
                <button
                  onClick={() => setMeetingModalOpen(false)}
                  className="py-3 px-4 rounded-xl bg-[var(--bg-muted)] text-[var(--text-primary)] font-semibold text-xs hover:bg-[var(--border-default)] transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Social Cards Grid ────────────────────────────────────────── */}
      <section className="space-y-4">
        <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Find me on social media
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socials.map((social, i) => (
            <motion.a
              key={social.title}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`social-card bg-gradient-to-br ${social.gradient} ${social.fullWidth ? 'md:col-span-2' : ''}`}
            >
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-1">{social.title}</h3>
                <p className="text-sm text-white/70 mb-4">{social.subtitle}</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-sm font-medium hover:bg-white/30 transition-colors">
                    {social.cta}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </span>
                  {social.href.startsWith('mailto:') && (
                    <CopyButton
                      text={social.href.replace('mailto:', '')}
                      label="email"
                      className="text-white/80 hover:text-white"
                    />
                  )}
                </div>
              </div>
              <div className="absolute top-4 right-4 text-white/30">
                <social.icon size={42} strokeWidth={1.5} />
              </div>
            </motion.a>

          ))}
        </div>
      </section>

      {/* ── macOS-Style Instagram Window ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative group"
      >
        <div className="relative rounded-2xl border border-[var(--border-default)] bg-[var(--glass-bg)] backdrop-blur-[50px] overflow-hidden shadow-2xl">
          {/* macOS Title Bar */}
          <div className="h-12 flex items-center px-4 bg-[var(--bg-base)] border-b border-[var(--border-default)] relative z-20">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] tracking-tight flex items-center gap-1.5">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.607 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.607-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.607-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.337 2.62 6.757 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.337-.2 6.757-2.62 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.62-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram — @fel.comp
              </span>
            </div>
          </div>

          {/* Window Content */}
          <div className="flex flex-col md:flex-row min-h-[380px]">
            <div className="w-full md:w-[300px] p-6 md:p-8 border-r border-[var(--border-default)] bg-[var(--bg-base)] relative z-10 flex flex-col items-center md:items-start">
              <div className="relative mb-4">
                <div className="absolute -inset-1 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full blur-[2px]" />
                <div className="relative w-20 h-20 rounded-full bg-[var(--bg-base)] p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[var(--bg-muted)] flex items-center justify-center">
                    <span className="text-2xl font-black bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] bg-clip-text text-transparent">F</span>
                  </div>
                </div>
              </div>

              <div className="text-center md:text-left w-full">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">fel.comp</h3>
                <p className="text-xs text-[var(--text-muted)] mb-5 font-medium leading-relaxed">
                  Building scalable AI &amp; FinTech systems.
                </p>

                <a
                  href="https://www.instagram.com/fel.comp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 rounded-lg bg-[var(--brand)] hover:brightness-110 text-[var(--brand-contrast)] text-xs font-bold text-center transition-all active:scale-95 shadow-md"
                >
                  Follow on Instagram
                </a>
              </div>
            </div>

            {/* Main Content Area (Grid) */}
            <div className="flex-1 p-6 bg-[var(--bg-base)]">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 h-full">
                {[
                  { id: 1, color: 'from-blue-600/20 to-indigo-600/20', label: 'NEURAL_CORE' },
                  { id: 2, color: 'from-emerald-600/20 to-teal-600/20', label: 'ARCHITECTURE' },
                  { id: 3, color: 'from-orange-600/20 to-rose-600/20', label: 'UX_PROTOCOL' },
                  { id: 4, color: 'from-pink-600/20 to-fuchsia-600/20', label: 'DATA_STREAM' },
                  { id: 5, color: 'from-violet-600/20 to-purple-600/20', label: 'AI_LOGIC' },
                  { id: 6, color: 'from-cyan-600/20 to-blue-600/20', label: 'CLOUD_NEXUS' },
                ].map((post, idx) => (
                  <motion.a
                    key={post.id}
                    href="https://www.instagram.com/fel.comp"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + idx * 0.04 }}
                    whileHover={{ scale: 1.04 }}
                    className="aspect-square relative group/post rounded-xl overflow-hidden bg-[var(--bg-muted)] border border-[var(--border-default)]"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${post.color}`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] group-hover/post:text-[var(--text-primary)] transition-colors">{post.label}</span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Smart Contact Form & Inquiry Builder ────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-6"
      >
        <div>
          <h2 className="text-xl font-display font-bold text-[var(--text-primary)] tracking-tight">
            Send an Instant Message
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Select an inquiry preset below to automatically format your message, or write your own.
          </p>
        </div>

        {/* Quick Intent Preset Chips */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
            Select Intent Preset
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_INTENTS.map((intent) => {
              const isSelected = selectedIntent === intent.id;
              const Icon = intent.icon;
              return (
                <button
                  key={intent.id}
                  type="button"
                  onClick={() => handleSelectIntent(intent)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--brand)] text-[var(--brand-contrast)] shadow-sm'
                      : 'bg-[var(--bg-base)] text-[var(--text-muted)] border border-[var(--border-default)] hover:border-[var(--brand)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{intent.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Optional Budget selector if project intent is chosen */}
        {selectedIntent === 'project' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2 pt-2 border-t border-[var(--border-default)]"
          >
            <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
              Estimated Budget Scope (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {BUDGET_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedBudget(opt)}
                  className={`px-3 py-1 rounded-md text-[11px] font-mono transition-all ${
                    selectedBudget === opt
                      ? 'bg-[var(--text-primary)] text-[var(--bg-base)] font-bold'
                      : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Status Notification */}
        {status && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
              status.type === 'success'
                ? 'bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/30'
                : 'bg-[var(--danger-bg)] text-[var(--danger)] border border-[var(--danger-border)]'
            }`}
          >
            {status.type === 'success' ? <CheckCircle2 size={16} className="flex-shrink-0" /> : <span>⚠️</span>}
            <span>{status.message}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name" className="text-[11px] font-mono text-[var(--text-muted)] mb-1 block">Your Name</label>
              <input
                id="contact-name"
                type="text"
                placeholder="e.g. Alex Morgan"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="text-[11px] font-mono text-[var(--text-muted)] mb-1 block">Your Email</label>
              <input
                id="contact-email"
                type="email"
                placeholder="e.g. alex@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="text-[11px] font-mono text-[var(--text-muted)] mb-1 block">Message Details</label>
            <textarea
              id="contact-message"
              placeholder="Tell me about your idea, timeline, or question..."
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="form-input resize-vertical"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3.5 px-6 rounded-xl bg-[var(--brand)] hover:brightness-110 disabled:opacity-50 text-[var(--brand-contrast)] font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Send Message</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
