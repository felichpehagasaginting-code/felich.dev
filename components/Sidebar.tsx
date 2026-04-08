'use client';

import { useLayoutStore } from '@/lib/store';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { sounds } from '@/lib/sounds';
import { triggerImpact } from '@/lib/impact';

import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from '@/components/Magnetic';
import { Volume2, VolumeX, GitBranch } from 'lucide-react';

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
  { href: '/blog', label: 'Blog', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
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
  const { theme, setTheme, triggerWarp } = useLayoutStore();

  const themes: { key: 'light' | 'dark' | 'yellow'; icon: string; label: string; color: string }[] = [
    { key: 'light', icon: '☀️', label: 'Light Mode', color: '#ffffff' },
    { key: 'dark', icon: '🌙', label: 'Dark Mode', color: '#171717' },
    { key: 'yellow', icon: '⚡', label: 'Retro Mode', color: '#fef9ed' },
  ];

  return (
    <div className="flex items-center gap-1">
      {themes.map((t) => (
        <Magnetic key={t.key}>
          <button
            onClick={(e) => { 
              setTheme(t.key); 
              triggerWarp(e.clientX, e.clientY, t.color);
              triggerImpact();
              sounds.playSwitch(); 
            }}
            onMouseEnter={() => sounds.playHover()}
            className={`theme-btn ${theme === t.key ? 'active' : ''}`}
            aria-label={`Switch to ${t.key} theme`}
            title={t.label}
          >
            {t.icon}
          </button>
        </Magnetic>
      ))}
    </div>
  );
}

function LanguageSwitcher() {
  const { language, toggleLanguage } = useLayoutStore();

  return (
    <button
      onClick={() => { toggleLanguage(); sounds.playSwitch(); }}
      onMouseEnter={() => sounds.playHover()}
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

function SoundSwitcher() {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    setIsEnabled(sounds.getStatus());
  }, []);

  const handleToggle = () => {
    const newState = sounds.toggle();
    setIsEnabled(newState);
    if (newState) sounds.playSwitch();
  };

  return (
    <button
      onClick={handleToggle}
      onMouseEnter={() => sounds.playHover()}
      className={`p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 transition-all ${isEnabled ? 'bg-primary/5 text-primary border-primary/20' : 'text-neutral-400 opacity-50'}`}
      title={isEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
    >
      {isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
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
      <div className="mb-6">
        <Magnetic>
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
        </Magnetic>

        <div className="text-center">
          <h1 className="text-lg font-bold flex items-center justify-center gap-1.5 group">
            <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">Felich</span>
            <svg className="w-4 h-4 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </h1>

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

      <div className="flex items-center justify-center gap-3 mb-4">
        <LanguageSwitcher />
      </div>

      <div className="flex items-center justify-center gap-3 mb-6">
        <ThemeSwitcher />
        <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800" />
        <SoundSwitcher />
      </div>

      <hr className="border-neutral-200 dark:border-neutral-800 mb-4" />

      <nav className="flex-1 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => sounds.playPop()}
              onMouseEnter={() => sounds.playHover()}
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

      <div className="mt-4 mb-2">
        <button
          onClick={() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })); sounds.playPop(); }}
          onMouseEnter={() => sounds.playHover()}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <span className="flex-1 text-left">Command Palette</span>
          <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-[10px] font-mono">⌘K</kbd>
        </button>
      </div>

      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
        {/* Expanded Social Icons with Brand Glow */}
        <div className="flex items-center justify-center gap-4">
          <Magnetic>
            <a 
              href="https://github.com/felichpehagasaginting-code" 
              target="_blank"
              onMouseEnter={() => sounds.playHover()}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </Magnetic>
          <Magnetic>
            <a 
              href="https://www.linkedin.com/in/felich-pehagasa-ginting" 
              target="_blank"
              onMouseEnter={() => sounds.playHover()}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-[#0a66c2] hover:shadow-[0_0_15px_rgba(10,102,194,0.3)] transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </Magnetic>
          <Magnetic>
            <a 
              href="https://www.instagram.com/fel.comp" 
              target="_blank"
              onMouseEnter={() => sounds.playHover()}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-[#e4405f] hover:shadow-[0_0_15px_rgba(228,64,95,0.3)] transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.281.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </Magnetic>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400 group cursor-default">
            Available for Work
          </span>
        </div>

        <p className="text-[10px] text-neutral-400 dark:text-neutral-600 text-center">
          Press <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[9px]">⌘K</kbd> to search
        </p>

        <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 w-fit mx-auto group">
           <GitBranch className="w-3 h-3 text-neutral-400 group-hover:text-primary transition-colors" />
           <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest whitespace-nowrap">
             v1.2.4-stable <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">#MAIN</span>
           </span>
        </div>

        <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
          &copy; {new Date().getFullYear()} Felich.
          <br />All rights reserved.
        </p>
      </div>
    </aside>
  );
}