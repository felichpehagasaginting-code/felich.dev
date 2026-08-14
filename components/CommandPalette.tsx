'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useLayoutStore } from '@/lib/store';
import { useFocusTrap } from '@/lib/useFocusTrap';
import {
  Home,
  User,
  Trophy,
  Package,
  BarChart2,
  Mail,
  FileEdit,
  Wrench,
  Link2,
  Sparkles,
  Moon,
  Sun,
  Palette,
  Clapperboard,
  Copy,
  Check,
  Search,
} from 'lucide-react';
import { introAudio } from '@/lib/introAudio';

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
);

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);

type CommandCategory = 'Navigation' | 'Social' | 'Actions' | 'AI';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  category: CommandCategory;
  href?: string;
  external?: boolean;
  action?: () => void;
  keywords?: string[];
}

const staticCommands: Command[] = [
  // Navigation
  { id: 'home', label: 'Home', icon: <Home size={16} />, href: '/', category: 'Navigation' },
  { id: 'about', label: 'About', description: 'Career, education & story', icon: <User size={16} />, href: '/about', category: 'Navigation' },
  { id: 'achievements', label: 'Achievements', icon: <Trophy size={16} />, href: '/achievements', category: 'Navigation' },
  { id: 'projects', label: 'Projects', description: 'Browse all projects', icon: <Package size={16} />, href: '/projects', category: 'Navigation' },
  { id: 'dashboard', label: 'Dashboard', description: 'GitHub stats & activity', icon: <BarChart2 size={16} />, href: '/dashboard', category: 'Navigation' },
  { id: 'contact', label: 'Contact', description: 'Send a message', icon: <Mail size={16} />, href: '/contact', category: 'Navigation' },
  { id: 'guestbook', label: 'Guestbook', icon: <FileEdit size={16} />, href: '/guestbook', category: 'Navigation' },
  { id: 'uses', label: 'Uses', description: 'My tools & setup', icon: <Wrench size={16} />, href: '/uses', category: 'Navigation' },
  { id: 'links', label: 'Links', icon: <Link2 size={16} />, href: '/links', category: 'Navigation' },
  // Social
  { id: 'github', label: 'GitHub', description: 'felichpehagasaginting-code', icon: <GithubIcon size={16} />, href: 'https://github.com/felichpehagasaginting-code', category: 'Social', external: true, keywords: ['code', 'repo'] },
  { id: 'instagram', label: 'Instagram', description: '@fel.comp', icon: <InstagramIcon size={16} />, href: 'https://www.instagram.com/fel.comp', category: 'Social', external: true },
  { id: 'linkedin', label: 'LinkedIn', description: 'Connect professionally', icon: <LinkedinIcon size={16} />, href: 'https://www.linkedin.com/in/felich-pehagasa-ginting', category: 'Social', external: true },
  { id: 'email-open', label: 'Send Email', description: 'felichpehagasaginting@gmail.com', icon: <Mail size={16} />, href: 'mailto:felichpehagasaginting@gmail.com', category: 'Social', external: true },
  // AI
  { id: 'ai-chat', label: 'Chat with Felich AI', description: 'Ask anything about Felich', icon: <Sparkles size={16} className="text-[var(--brand)]" />, category: 'AI', keywords: ['ai', 'chat', 'assistant', 'bot', 'gemini'] },
];


export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { theme, setTheme } = useLayoutStore();

  // Lock Tab focus inside the palette while it is open
  useFocusTrap(containerRef, open, { autoFocusFirst: false });

  // Build dynamic action commands that need access to store/router
  const dynamicCommands: Command[] = [
    {
      id: 'copy-email',
      label: 'Copy Email Address',
      description: 'felichpehagasaginting@gmail.com',
      icon: copied ? <Check size={16} className="text-[var(--success)]" /> : <Copy size={16} />,
      category: 'Actions',
      keywords: ['copy', 'email', 'clipboard'],
      action: () => {
        navigator.clipboard.writeText('felichpehagasaginting@gmail.com').then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      },
    },
    {
      id: 'theme-noir',
      label: 'Switch to Noir Silver',
      description: 'Graphite & silver dark',
      icon: <Moon size={16} />,
      category: 'Actions',
      keywords: ['dark', 'noir', 'theme', 'mode'],
      action: () => { setTheme('noir'); },
    },
    {
      id: 'theme-vanilla',
      label: 'Switch to Vanilla',
      description: 'Light cream & pastel matcha',
      icon: <Sun size={16} />,
      category: 'Actions',
      keywords: ['light', 'vanilla', 'theme', 'mode'],
      action: () => { setTheme('vanilla'); },
    },
    {
      id: 'theme-violet',
      label: 'Switch to Lavender',
      description: 'Soft purple daylight',
      icon: <Palette size={16} />,
      category: 'Actions',
      keywords: ['violet', 'lavender', 'purple', 'theme', 'mode'],
      action: () => { setTheme('violet'); },
    },
    {
      id: 'replay-intro',
      label: 'Replay Intro Animation',
      description: 'Watch the cinematic preloader intro again',
      icon: <Clapperboard size={16} className="text-[var(--brand)]" />,
      category: 'Actions',
      keywords: ['intro', 'animation', 'cinematic', 'replay', 'preloader'],
      action: () => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('replay-intro'));
        }
      },
    },
  ];

  const allCommands = [...staticCommands, ...dynamicCommands];

  const filtered = query
    ? allCommands.filter((c) => {
      const q = query.toLowerCase();
      return (
        c.label.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.keywords?.some((k) => k.toLowerCase().includes(q))
      );
    })
    : allCommands;

  // Group filtered results by category in a stable order
  const categoryOrder: CommandCategory[] = ['AI', 'Navigation', 'Actions', 'Social'];
  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    (acc[cmd.category] = acc[cmd.category] || []).push(cmd);
    return acc;
  }, {});

  const sortedCategories = categoryOrder.filter((cat) => grouped[cat]?.length > 0);

  // Flat array of currently visible commands (for keyboard navigation)
  const visibleCommands = sortedCategories.flatMap((cat) => grouped[cat]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Global shortcut listener (Cmd+K / Ctrl+K) and CustomEvent listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    const handleOpenEvent = () => {
      setOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpenEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpenEvent);
    };
  }, []);

  // Focus input when opened, reset query when closed
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  // Execute a command
  const handleSelect = useCallback(
    (cmd: Command) => {
      introAudio.playTick(1.0);
      setOpen(false);
      if (cmd.action) {
        cmd.action();
      } else if (cmd.href) {
        if (cmd.external) {
          window.open(cmd.href, '_blank', 'noopener,noreferrer');
        } else {
          router.push(cmd.href);
        }
      } else if (cmd.id === 'ai-chat') {
        window.dispatchEvent(new CustomEvent('open-ai-chat'));
      }
    },
    [router]
  );

  // Keyboard navigation within the palette
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      introAudio.playTick(0.6);
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, visibleCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      introAudio.playTick(0.6);
      setSelectedIndex((prev) => (prev - 1 + visibleCommands.length) % Math.max(1, visibleCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (visibleCommands[selectedIndex]) {
        handleSelect(visibleCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selectedEl = listRef.current.querySelector('[aria-selected="true"]');
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {open && (
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
          className="fixed inset-0 z-[99999] flex items-start justify-center pt-[15vh] px-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Palette container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 border-b border-[var(--border-default)]">
              <Search className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-haspopup="listbox"
                aria-controls="command-palette-listbox"
                aria-autocomplete="list"
                aria-label="Search commands"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search pages, actions, social links..."
                className="flex-1 py-4 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
              />
              <kbd className="hidden sm:inline-flex px-2 py-1 text-[10px] font-mono bg-[var(--bg-muted)] text-[var(--text-muted)] rounded border border-[var(--border-default)]">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              id="command-palette-listbox"
              role="listbox"
              aria-label="Command results"
              className="max-h-80 overflow-y-auto p-2"
              data-lenis-prevent
            >
              {sortedCategories.map((category) => (
                <div key={category} role="group" aria-label={category}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-3 py-2 flex items-center gap-2" aria-hidden="true">
                    {category === 'AI' && <Sparkles size={12} className="text-[var(--brand)]" />}
                    {category}
                  </p>
                  {grouped[category].map((cmd) => {
                    const globalIndex = visibleCommands.findIndex((f) => f.id === cmd.id);
                    const isSelected = globalIndex === selectedIndex;

                    return (
                      <button
                        key={cmd.id}
                        id={`cmd-option-${cmd.id}`}
                        role="option"
                        aria-selected={isSelected}
                        data-selected={isSelected}
                        onClick={() => handleSelect(cmd)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--bg-muted)] ring-1 ring-[var(--brand)]/30'
                            : 'hover:bg-[var(--bg-muted)]/50'
                        }`}
                      >
                        <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-[var(--text-muted)]" aria-hidden="true">
                          {cmd.icon}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className={`font-medium block ${isSelected ? 'text-[var(--brand)]' : 'text-[var(--text-primary)]'}`}>
                            {cmd.label}
                          </span>
                          {cmd.description && (
                            <span className="text-[11px] text-[var(--text-muted)] truncate block">
                              {cmd.description}
                            </span>
                          )}
                        </span>
                        {cmd.external && (
                          <svg className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Opens in new tab">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                        {cmd.id === 'ai-chat' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--brand-bg)] text-[var(--brand)] font-semibold flex-shrink-0">
                            New
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-10" role="status">
                  <Search className="w-8 h-8 mx-auto mb-2 text-[var(--text-muted)] opacity-50" />
                  <p className="text-sm text-[var(--text-muted)]">No results for &quot;{query}&quot;</p>
                </div>
              )}
            </div>

            {/* Footer hints */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border-default)] bg-[var(--bg-muted)]/30 text-[11px] text-[var(--text-muted)]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-[var(--bg-muted)] rounded border border-[var(--border-default)]">↑</kbd>
                  <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-[var(--bg-muted)] rounded border border-[var(--border-default)]">↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-[var(--bg-muted)] rounded border border-[var(--border-default)]">↵</kbd>
                  Select
                </span>
              </div>
              <span>Press <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-[var(--bg-muted)] rounded border border-[var(--border-default)]">ESC</kbd> to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
