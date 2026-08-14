'use client';

import { useLayoutStore } from '@/lib/store';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Magnetic from '@/components/Magnetic';
import { GitBranch, Clapperboard } from 'lucide-react';
import Logo from '@/components/Logo';
import FelichAvatar from '@/components/FelichAvatar';


import { useTranslation } from 'react-i18next';
import type { Theme } from '@/lib/store';

const navLinks = [
  {
    href: '/', label: 'Home', key: 'link_home', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )
  },
  {
    href: '/about', label: 'About', key: 'link_about', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )
  },
  {
    href: '/achievements', label: 'Achievements', key: 'link_achievements', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
    )
  },
  {
    href: '/projects', label: 'Projects', key: 'link_projects', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    )
  },
  {
    href: '/blog', label: 'Blog', key: 'link_blog', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    )
  },
  {
    href: '/dashboard', label: 'Dashboard', key: 'link_dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )
  },
  {
    href: '/contact', label: 'Contact', key: 'link_contact', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    )
  },
  {
    href: '/guestbook', label: 'Guestbook', key: 'link_guestbook', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    )
  },
  {
    href: '/uses', label: 'Uses', key: 'link_uses', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )
  },
  {
    href: '/links', label: 'Links', key: 'link_links', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
    )
  },
];

const themes: {
  key: Theme;
  label: string;
  swatch: string;
  ring: string;
  icon: (active: boolean) => React.ReactNode;
}[] = [
  {
    key: 'vanilla',
    label: 'Vanilla Matcha',
    swatch: '#EAF4CE',
    ring: '#6B881F',
    icon: (active) => (
      <svg
        className={`w-4 h-4 transition-transform duration-200 ${
          active ? 'scale-110' : 'group-hover:scale-110'
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
  },
  {
    key: 'noir',
    label: 'Noir Silver',
    swatch: '#202025',
    ring: '#CDCDD6',
    icon: (active) => (
      <svg
        className={`w-4 h-4 transition-transform duration-200 ${
          active ? 'scale-110' : 'group-hover:scale-110'
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
  },
  {
    key: 'violet',
    label: 'Lavender Violet',
    swatch: '#EFEBFA',
    ring: '#7C6FC4',
    icon: (active) => (
      <svg
        className={`w-4 h-4 transition-transform duration-200 ${
          active ? 'scale-110' : 'group-hover:scale-110'
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
      </svg>
    ),
  },
];

function ThemeSwitcher() {
  const { theme, setTheme } = useLayoutStore();

  return (
    <div
      className="flex items-center justify-between gap-1 p-1 rounded-full bg-[var(--bg-muted)]/50 border border-[var(--border-default)] w-full h-10"
      role="group"
      aria-label="Theme switcher"
    >
      {themes.map((t) => {
        const isActive = theme === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setTheme(t.key)}
            className={`relative h-8 flex-1 rounded-full transition-all duration-200 flex items-center justify-center group cursor-pointer ${
              isActive
                ? 'bg-[var(--brand)] text-[var(--brand-contrast)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
            }`}
            aria-label={`Switch to ${t.label} theme`}
            aria-pressed={isActive}
            title={t.label}
          >
            {t.icon(isActive)}
          </button>
        );
      })}
    </div>
  );
}

function LanguageSwitcher() {
  const { language, setLanguage } = useLayoutStore();
  const langs = [
    { code: 'en', label: 'US' },
    { code: 'id', label: 'ID' },
    { code: 'zh', label: 'ZH' },
    { code: 'de', label: 'DE' },
  ] as const;

  return (
    <div
      className="flex items-center justify-between gap-1 p-1 rounded-full bg-[var(--bg-muted)]/50 border border-[var(--border-default)] w-full h-10"
      role="group"
      aria-label="Language switcher"
    >
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLanguage(l.code)}
          className={`relative h-8 flex-1 text-[10px] font-semibold tracking-widest rounded-full transition-all duration-200 flex items-center justify-center ${
            language === l.code
              ? 'bg-[var(--brand)] text-[var(--brand-contrast)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
          aria-label={`Switch language to ${l.code}`}
          aria-pressed={language === l.code}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function SectionLabel({ children, icon }: { children: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-1 mb-1.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)] flex items-center gap-1.5">
        {icon}
        {children}
      </p>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const [statusIndex, setStatusIndex] = useState(0);
  const statuses = [t('status_internship'), t('status_collaborate')];

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [statuses.length, prefersReducedMotion]);

  return (
    <aside
      className="hidden lg:flex flex-col w-64 min-w-[256px] h-[calc(100vh-2rem)] sticky top-4 ml-4 my-4 px-5 py-6 overflow-y-auto bg-[var(--bg-surface)] border border-[var(--border-default)] z-40 custom-scrollbar rounded-2xl shadow-md"
      data-lenis-prevent
    >
      {/* ── Profile header ─────────────────────────────────────────────── */}
      <div className="mb-6 text-center">
        <Magnetic>
          <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer flex items-center justify-center">
            <FelichAvatar size={96} showBadge={true} className="transition-transform duration-300 group-hover:scale-105" />
          </div>
        </Magnetic>


        <Link href="/" className="flex flex-col items-center gap-2 group">
          <Logo className="w-10 h-10" />
          <h1 className="text-lg font-display font-bold flex items-center justify-center gap-1.5 tracking-tight text-[var(--text-primary)]">
            <span>Felich<span className="text-[var(--brand)]">.dev</span></span>
            <svg className="w-3.5 h-3.5 text-[var(--brand)] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </h1>
        </Link>

        <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-[var(--brand-bg)]/60 border border-[var(--brand)]/25 text-xs font-medium text-[var(--text-primary)] overflow-hidden">
          <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--success)]"></span>
          </span>
          <span className="whitespace-nowrap flex gap-1">
            {t('status_open_to')}
            <div className="relative inline-flex items-center overflow-visible w-[68px] sm:w-[72px] text-left">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={statusIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 whitespace-nowrap"
                >
                  {statuses[statusIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </span>
        </div>
      </div>

      {/* ── Language & theme ───────────────────────────────────────────── */}
      <div className="space-y-3 mb-5">
        <div>
          <SectionLabel
            icon={
              <svg className="w-3.5 h-3.5 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            }
          >
            Language
          </SectionLabel>
          <LanguageSwitcher />
        </div>
        <div>
          <SectionLabel
            icon={
              <svg className="w-3.5 h-3.5 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            }
          >
            Theme
          </SectionLabel>
          <ThemeSwitcher />
        </div>
      </div>

      <hr className="border-[var(--border-default)] mb-4" />

      {/* ── Navigation ────────────────────────────────────────────────── */}
      <nav className="flex-1 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.icon}
              <span>{t(link.key)}</span>
              {isActive && (
                <svg className="w-4 h-4 ml-auto text-[var(--brand)]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <div className="mt-4 mb-2">
        <button
          onClick={() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })); }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-[var(--text-muted)] border border-[var(--border-default)] bg-[var(--bg-muted)]/30 hover:bg-[var(--bg-muted)] hover:border-[var(--brand)]/40 hover:text-[var(--text-primary)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="flex-1 text-left">{t('search_hint')}</span>
          <kbd className="px-1.5 py-0.5 bg-[var(--bg-base)] rounded-md border border-[var(--border-default)] text-[10px] font-mono">⌘K</kbd>
        </button>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <div className="pt-4 border-t border-[var(--border-default)] space-y-4">
        <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-xl bg-[var(--bg-muted)]/40 border border-[var(--border-default)]">
          <Magnetic>
            <a
              href="https://github.com/felichpehagasaginting-code"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Profile"
              aria-label="GitHub Profile"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--brand)] hover:bg-[var(--brand-bg)] border border-transparent hover:border-[var(--brand)]/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="https://www.linkedin.com/in/felich-pehagasa-ginting"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--brand)] hover:bg-[var(--brand-bg)] border border-transparent hover:border-[var(--brand)]/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="https://www.instagram.com/fel.comp"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram Profile"
              aria-label="Instagram Profile"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--brand)] hover:bg-[var(--brand-bg)] border border-transparent hover:border-[var(--brand)]/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.281.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
          </Magnetic>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--success)] group cursor-default">
            {t('status_available_for_work')}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 px-1">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('replay-intro'));
              }
            }}
            title="Replay Cinematic Intro"
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-muted)]/50 border border-[var(--border-default)] hover:border-[var(--brand)] hover:text-[var(--brand)] hover:bg-[var(--brand-bg)] text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Clapperboard size={12} className="text-[var(--brand)]" />
            <span>Replay Intro</span>
          </button>


          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-muted)]/30 border border-[var(--border-default)] group">
            <GitBranch className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--brand)] transition-colors" />
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap">
              v2.0
            </span>
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] text-center">
          &copy; {new Date().getFullYear()} Felich. All rights reserved.
        </p>
      </div>

    </aside>
  );
}