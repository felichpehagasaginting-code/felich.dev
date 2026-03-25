'use client';

import { useLayoutStore } from '@/lib/store';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { sounds } from '@/lib/sounds';

import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
  )},
  { href: '/about', label: 'About', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
  )},
  { href: '/achievements', label: 'Achievements', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
  )},
  { href: '/projects', label: 'Projects', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
  )},
  { href: '/dashboard', label: 'Dashboard', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
  )},
  { href: '/contact', label: 'Contact', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
  )},
  { href: '/guestbook', label: 'Guestbook', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
  )},
  { href: '/uses', label: 'Uses', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
  )},
  { href: '/links', label: 'Links', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
  )},
];

function ThemeSwitcher() {
  const { theme, setTheme } = useLayoutStore();

  const themes: { key: 'light' | 'dark' | 'yellow'; icon: string }[] = [
    { key: 'light', icon: '☀️' },
    { key: 'dark', icon: '🌙' },
    { key: 'yellow', icon: '⚡' },
  ];

  return (
    <div className="flex items-center gap-1">
      {themes.map((t) => (
        <button
          key={t.key}
          onClick={() => { setTheme(t.key); sounds.playSwitch(); }}
          className={`theme-btn ${theme === t.key ? 'active' : ''}`}
          aria-label={`Switch to ${t.key} theme`}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}

function LanguageSwitcher() {
  const { language, toggleLanguage } = useLayoutStore();

  return (
    <button
      onClick={() => { toggleLanguage(); sounds.playSwitch(); }}
      className="flex items-center rounded-full border border-neutral-200 dark:border-neutral-700 overflow-hidden text-xs font-semibold"
    >
      <span className={`px-2.5 py-1 transition-all ${language === 'en' ? 'bg-primary text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>
        US
      </span>
      <span className={`px-2.5 py-1 transition-all ${language === 'id' ? 'bg-primary text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>
        ID
      </span>
    </button>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { theme } = useLayoutStore();
  const [statusIndex, setStatusIndex] = useState(0);
  const statuses = ['Internship', 'Collaborate'];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-64 min-w-[256px] h-screen sticky top-0 p-6 overflow-y-auto border-r border-neutral-200/50 dark:border-neutral-800/50">
      {/* Profile */}
      <div className="mb-6">
        <div className="mb-4 group cursor-pointer">
          <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden ring-4 ring-neutral-200/50 dark:ring-neutral-700/50 shadow-lg transition-transform duration-500 group-hover:scale-105 group-hover:ring-primary/50">
            <Image
              src="/images/profile.jpg"
              alt="Felich"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 112px"
              priority
            />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-lg font-bold flex items-center justify-center gap-1.5">
            Felich
            <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </h1>

          {/* Status badge */}
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-xs font-medium text-green-700 dark:text-green-400 overflow-hidden">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
            <span className="whitespace-nowrap flex gap-1">
              Open to
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
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <LanguageSwitcher />
      </div>

      {/* Theme row */}
      <div className="flex items-center justify-center mb-6">
        <ThemeSwitcher />
      </div>

      <hr className="border-neutral-200 dark:border-neutral-800 mb-4" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
              {isActive && (
                <svg className="w-4 h-4 ml-auto text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Command Palette hint */}
      <div className="mt-4 mb-2">
        <button
          onClick={() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <span className="flex-1 text-left">Command Palette</span>
          <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-[10px] font-mono">⌘K</kbd>
        </button>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
          &copy; {new Date().getFullYear()} Felich.
          <br />All rights reserved.
        </p>
      </div>
    </aside>
  );
}
