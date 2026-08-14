'use client';

import { useEffect, useRef } from 'react';
import { useLayoutStore } from '@/lib/store';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useFocusTrap } from '@/lib/useFocusTrap';

import { AnimatePresence, motion } from 'framer-motion';
import Magnetic from '@/components/Magnetic';
import Logo from '@/components/Logo';
import { Clapperboard } from 'lucide-react';
import FelichAvatar from '@/components/FelichAvatar';
import DraggableSegmentedControl from '@/components/DraggableSegmentedControl';
import type { Theme } from '@/lib/store';
import { introAudio } from '@/lib/introAudio';

const langs = [
  { key: 'en' as const, label: 'US' },
  { key: 'id' as const, label: 'ID' },
  { key: 'zh' as const, label: 'ZH' },
  { key: 'de' as const, label: 'DE' },
];



const navLinks = [
  {
    href: '/', label: 'Home', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )
  },
  {
    href: '/about', label: 'About', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )
  },
  {
    href: '/achievements', label: 'Achievements', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
    )
  },
  {
    href: '/projects', label: 'Projects', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    )
  },
  {
    href: '/blog', label: 'Blog', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    )
  },
  {
    href: '/dashboard', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )
  },
  {
    href: '/contact', label: 'Contact', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    )
  },
  {
    href: '/guestbook', label: 'Guestbook', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    )
  },
  {
    href: '/uses', label: 'Uses', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )
  },
  {
    href: '/links', label: 'Links', icon: (
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

export default function MobileNav() {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen, theme, setTheme, language, setLanguage } = useLayoutStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useFocusTrap(menuRef, mobileMenuOpen, { autoFocusFirst: true });

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      if (menuRef.current) {
        menuRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <>
      <div className="fixed top-3 left-3 right-3 z-50 lg:hidden pointer-events-none">
        <div className="flex items-center justify-between px-5 py-3 bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-sm pointer-events-auto rounded-lg">
          <Link href="/" className="flex items-center gap-2 text-base font-display font-bold tracking-tight text-[var(--text-primary)]">
            <Logo className="w-5 h-5" />
            <span>Felich<span className="text-[var(--brand)]">.dev</span></span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-3 rounded-lg hover:bg-[var(--bg-muted)] transition-colors"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[var(--scrim)] backdrop-blur-md z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
              data-lenis-prevent
            />
            <motion.div
              ref={menuRef}
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: '-100%', scale: 0.95 }}
              animate={{ x: 0, scale: 1 }}
              exit={{ x: '-100%', scale: 0.95 }}
              transition={{ type: 'spring', damping: 24, stiffness: 250 }}
              className="fixed left-3 top-3 bottom-3 w-[calc(100vw-1.5rem)] max-w-sm z-50 overflow-y-auto p-6 lg:hidden bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-xl custom-scrollbar rounded-lg"
              data-lenis-prevent
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Magnetic>
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <FelichAvatar size={48} showBadge={false} />
                    </div>
                  </Magnetic>
                  <div>
                    <h2 className="font-bold flex items-center gap-1 text-[var(--text-primary)]">
                      Felich
                      <svg className="w-3.5 h-3.5 text-[var(--brand)]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </h2>
                  </div>

                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-lg hover:bg-[var(--bg-muted)] transition-colors"
                  title="Close menu"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-3 mb-6 w-full">
                <DraggableSegmentedControl
                  options={langs}
                  value={language}
                  onChange={setLanguage}
                  ariaLabel="Language switcher"
                />

                <DraggableSegmentedControl
                  options={themes}
                  value={theme}
                  onChange={setTheme}
                  ariaLabel="Theme switcher"
                />
              </div>

              <hr className="border-[var(--border-default)] mb-4" />

              <nav className="space-y-1" aria-label="Primary navigation">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => {
                          introAudio.playTick(1.0);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-4 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-[var(--brand-bg)] text-[var(--text-primary)] font-semibold border-l-[3px] border-[var(--brand)]'
                            : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)]'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span className="text-lg">{link.icon}</span>
                        <span>{link.label}</span>
                        {isActive && (
                          <svg className="w-4 h-4 ml-auto text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                <div className="pt-4 border-t border-[var(--border-default)]">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('replay-intro'));
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--brand)] bg-[var(--bg-muted)]/50 border border-[var(--border-default)] hover:border-[var(--brand)] transition-all cursor-pointer"
                  >
                    <Clapperboard size={14} className="text-[var(--brand)]" />
                    <span>Replay Intro Animation</span>
                  </button>

                </div>
              </nav>
            </motion.div>
          </>
        )}

      </AnimatePresence>
    </>
  );
}
