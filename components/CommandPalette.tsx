'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useLayoutStore } from '@/lib/store';
import { useFocusTrap } from '@/lib/useFocusTrap';

type CommandCategory = 'Navigation' | 'Social' | 'Actions' | 'AI';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: string;
  category: CommandCategory;
  href?: string;
  external?: boolean;
  action?: () => void;
  keywords?: string[];
}

const staticCommands: Command[] = [
  // Navigation
  { id: 'home', label: 'Home', icon: '🏠', href: '/', category: 'Navigation' },
  { id: 'about', label: 'About', description: 'Career, education & story', icon: '👤', href: '/about', category: 'Navigation' },
  { id: 'achievements', label: 'Achievements', icon: '🏆', href: '/achievements', category: 'Navigation' },
  { id: 'projects', label: 'Projects', description: 'Browse all projects', icon: '📦', href: '/projects', category: 'Navigation' },
  { id: 'dashboard', label: 'Dashboard', description: 'GitHub stats & activity', icon: '📊', href: '/dashboard', category: 'Navigation' },
  { id: 'contact', label: 'Contact', description: 'Send a message', icon: '✉️', href: '/contact', category: 'Navigation' },
  { id: 'guestbook', label: 'Guestbook', icon: '📝', href: '/guestbook', category: 'Navigation' },
  { id: 'uses', label: 'Uses', description: 'My tools & setup', icon: '🛠️', href: '/uses', category: 'Navigation' },
  { id: 'links', label: 'Links', icon: '🔗', href: '/links', category: 'Navigation' },
  // Social
  { id: 'github', label: 'GitHub', description: 'felichpehagasaginting-code', icon: '🐙', href: 'https://github.com/felichpehagasaginting-code', category: 'Social', external: true, keywords: ['code', 'repo'] },
  { id: 'instagram', label: 'Instagram', description: '@fel.comp', icon: '📸', href: 'https://www.instagram.com/fel.comp', category: 'Social', external: true },
  { id: 'linkedin', label: 'LinkedIn', description: 'Connect professionally', icon: '💼', href: 'https://www.linkedin.com/in/felich-pehagasa-ginting', category: 'Social', external: true },
  { id: 'email-open', label: 'Send Email', description: 'felichpehagasaginting@gmail.com', icon: '📧', href: 'mailto:felichpehagasaginting@gmail.com', category: 'Social', external: true },
  // AI
  { id: 'ai-chat', label: 'Chat with Felich AI', description: 'Ask anything about Felich', icon: '✨', category: 'AI', keywords: ['ai', 'chat', 'assistant', 'bot', 'gemini'] },
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
      icon: copied ? '✅' : '📋',
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
      description: 'Monochrome cinematic dark',
      icon: '🌙',
      category: 'Actions',
      keywords: ['dark', 'noir', 'theme', 'mode'],
      action: () => { setTheme('noir'); },
    },
    {
      id: 'theme-vanilla',
      label: 'Switch to Vanilla',
      description: 'Light cream & pastel matcha',
      icon: '☀️',
      category: 'Actions',
      keywords: ['light', 'vanilla', 'theme', 'mode'],
      action: () => { setTheme('vanilla'); },
    },
    {
      id: 'theme-violet',
      label: 'Switch to Violet Deep',
      description: 'Ambient royal night',
      icon: '🔮',
      category: 'Actions',
      keywords: ['violet', 'purple', 'theme', 'mode'],
      action: () => { setTheme('violet'); },
    },
  ];

  const allCommands = [...staticCommands, ...dynamicCommands];

  const filtered = query
    ? allCommands.filter((c) => {
      const q = query.toLowerCase();
      return (
        c.label.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.keywords?.some((k) => k.includes(q))
      );
    })
    : allCommands;

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  const handleSelect = useCallback(
    (cmd: Command) => {
      setOpen(false);
      setQuery('');
      setSelectedIndex(0);

      if (cmd.id === 'ai-chat') {
        // Dispatch custom event to open AI chatbot
        document.dispatchEvent(new CustomEvent('open-ai-chatbot'));
        return;
      }

      if (cmd.action) {
        cmd.action();
        return;
      }

      if (cmd.external && cmd.href) {
        window.open(cmd.href, '_blank');
      } else if (cmd.href) {
        router.push(cmd.href);
      }
    },
    [router]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector('[data-selected="true"]');
      selectedEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter' && filtered.length > 0) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const CATEGORY_ORDER: CommandCategory[] = ['AI', 'Navigation', 'Actions', 'Social'];
  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => CATEGORY_ORDER.indexOf(a as CommandCategory) - CATEGORY_ORDER.indexOf(b as CommandCategory)
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={() => { setOpen(false); setQuery(''); }}
          />
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101]"
          >
            <div className="mx-4 rounded-2xl overflow-hidden border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-2xl">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 border-b border-[var(--border-default)]">
                <svg className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  id="command-palette-input"
                  type="text"
                  role="combobox"
                  aria-expanded={open}
                  aria-autocomplete="list"
                  aria-controls="command-palette-listbox"
                  aria-activedescendant={filtered[selectedIndex] ? `cmd-option-${filtered[selectedIndex].id}` : undefined}
                  aria-label="Search commands"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search pages, actions, social links..."
                  className="flex-1 py-4 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
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
                      {category === 'AI' && <span className="text-[var(--brand)]">✨</span>}
                      {category}
                    </p>
                    {grouped[category].map((cmd) => {
                      const globalIndex = filtered.findIndex((f) => f.id === cmd.id);
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
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${isSelected
                              ? 'bg-[var(--bg-muted)] ring-1 ring-[var(--brand)]/30'
                              : 'hover:bg-[var(--bg-muted)]/50'
                            }`}
                        >
                          <span className="text-base w-6 text-center flex-shrink-0" aria-hidden="true">{cmd.icon}</span>
                          <span className="flex-1 min-w-0">
                            <span className={`font-medium block ${isSelected ? 'text-[var(--brand)]' : 'text-[var(--text-primary)]'}`}>{cmd.label}</span>
                            {cmd.description && (
                              <span className="text-[11px] text-[var(--text-muted)] truncate block">{cmd.description}</span>
                            )}
                          </span>
                          {cmd.external && (
                            <svg className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Opens in new tab">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          )}
                          {cmd.id === 'ai-chat' && isSelected && (
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
                    <p className="text-3xl mb-2" aria-hidden="true">🔍</p>
                    <p className="text-sm text-[var(--text-muted)]">No results for &quot;{query}&quot;</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-[var(--border-default)] flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-[var(--bg-muted)] rounded border border-[var(--border-default)]">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-[var(--bg-muted)] rounded border border-[var(--border-default)]">↵</kbd>
                  select
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-[var(--bg-muted)] rounded border border-[var(--border-default)]">esc</kbd>
                  close
                </span>
                <span className="ml-auto opacity-60">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
