'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import Image from 'next/image';
import { QrCode, Copy, Check, ExternalLink, Share2, Sparkles, X, MapPin, Globe, Mail, FileText } from 'lucide-react';
import { introAudio } from '@/lib/introAudio';
import FelichAvatar from '@/components/FelichAvatar';


const GithubIcon = ({ size = 22, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
);

const InstagramIcon = ({ size = 22, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);

const LinkedinIcon = ({ size = 22, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);

const links = [
  {
    title: 'Portfolio Website',
    description: 'You are here! Personal portfolio & engineering showcase.',
    url: 'https://felich.dev',
    icon: Globe,
    gradient: 'from-blue-600 to-indigo-700',
    internal: true,
  },
  {
    title: 'GitHub Repositories',
    description: 'Open-source projects, AI pipelines & systems.',
    url: 'https://github.com/felichpehagasaginting-code',
    icon: GithubIcon,
    gradient: 'from-neutral-800 to-neutral-950',
  },
  {
    title: 'LinkedIn Network',
    description: 'Professional career timeline & connections.',
    url: 'https://www.linkedin.com/in/felich-pehagasa-ginting-b6a8a32a6/',
    icon: LinkedinIcon,
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    title: 'Instagram',
    description: 'Daily creative journey, software tech & behind-the-scenes.',
    url: 'https://www.instagram.com/fel.comp',
    icon: InstagramIcon,
    gradient: 'from-pink-500 via-purple-600 to-orange-500',
  },
  {
    title: 'Email Direct',
    description: 'Direct inquiry for collaborations or internships.',
    url: 'mailto:felichpehagasaginting@gmail.com',
    icon: Mail,
    gradient: 'from-red-600 to-rose-700',
  },
  {
    title: 'Google Sites Archive',
    description: 'Original legacy portfolio archive on Google Sites.',
    url: 'https://sites.google.com/view/felichs-portfolio',
    icon: FileText,
    gradient: 'from-emerald-600 to-teal-700',
  },
];



export default function Links() {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const copyLink = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    introAudio.playTick(1.0);

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-lg mx-auto space-y-6 pb-8">
        {/* Profile header card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4 shadow-sm"
        >
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <FelichAvatar size={96} showBadge={true} />
          </div>

          <div className="space-y-1">

            <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
              Felich Pehagasa Ginting
            </h1>
            <p className="text-xs md:text-sm text-[var(--text-muted)] font-medium">
              Software Engineer • AI Engineering &amp; FinTech
            </p>
            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] font-mono text-[var(--text-muted)]">
              <MapPin size={12} className="text-[var(--brand)]" />
              <span>Indonesia · UTC+7 (WIB)</span>
            </div>
          </div>

          {/* Availability Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)] text-[10px] font-mono font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            Open for Freelance &amp; Roles
          </div>

          {/* Quick QR Code Trigger */}
          <div className="pt-2">
            <button
              onClick={() => {
                introAudio.playTick(1.0);
                setQrModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-muted)] hover:bg-[var(--brand-bg)] hover:text-[var(--brand)] text-[var(--text-primary)] border border-[var(--border-default)] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <QrCode size={14} />
              <span>Show QR Code Card</span>
            </button>
          </div>
        </motion.div>

        {/* Links list */}
        <div className="space-y-3">
          {links.map((link, i) => {
            const isCopied = copiedUrl === link.url;

            return (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative group"
              >
                <a
                  href={link.url}
                  target={link.internal ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className={`block p-4 rounded-2xl bg-gradient-to-r ${link.gradient} text-white shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 backdrop-blur-xs">
                      <link.icon size={22} className="text-white drop-shadow" />
                    </div>

                    <div className="flex-1 min-w-0 pr-2">

                      <h3 className="font-bold text-sm leading-tight truncate">{link.title}</h3>
                      <p className="text-[11px] text-white/80 line-clamp-1 leading-snug mt-0.5">{link.description}</p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Copy link button */}
                      <button
                        onClick={(e) => copyLink(e, link.url)}
                        className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer backdrop-blur-xs"
                        title="Copy link to clipboard"
                        aria-label={`Copy link for ${link.title}`}
                      >
                        {isCopied ? <Check size={13} className="text-green-300" /> : <Copy size={13} />}
                      </button>

                      <div className="p-2 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-transform">
                        <ExternalLink size={14} />
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* ── QR Code Popup Modal ────────────────────────────────────── */}
        <AnimatePresence>
          {qrModalOpen && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setQrModalOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs z-0 cursor-pointer"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative z-10 w-full max-w-sm bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-5"
              >
                <div className="flex justify-between items-center pb-2 border-b border-[var(--border-default)]">
                  <div className="flex items-center gap-2 text-left">
                    <QrCode size={18} className="text-[var(--brand)]" />
                    <div>
                      <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">Felich Bio Card</h3>
                      <p className="text-[10px] font-mono text-[var(--text-muted)]">Scan with smartphone camera</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setQrModalOpen(false)}
                    className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-muted)]"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* QR Code Container */}
                <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-inner inline-block mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://felich.dev/links"
                    alt="QR Code for Felich Links"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-mono font-semibold text-[var(--text-primary)]">https://felich.dev/links</p>
                  <p className="text-[11px] text-[var(--text-muted)]">Direct access to portfolio, GitHub, LinkedIn, and email.</p>
                </div>

                <button
                  onClick={() => {
                    if (navigator?.clipboard?.writeText) {
                      navigator.clipboard.writeText('https://felich.dev/links');
                      introAudio.playTick(1.0);
                    }
                    setQrModalOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[var(--brand)] text-[var(--brand-contrast)] font-semibold text-xs hover:brightness-110 transition-all cursor-pointer shadow-md"
                >
                  Copy Bio URL &amp; Close
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <p className="text-center text-xs font-mono text-[var(--text-muted)] pt-4">
          &copy; {new Date().getFullYear()} Felich Pehagasa Ginting. All links verified.
        </p>
      </div>
    </PageTransition>
  );
}
