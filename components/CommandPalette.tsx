'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const commands = [
  { id: 'home', label: 'Home', icon: '🏠', href: '/', category: 'Navigation' },
  { id: 'about', label: 'About', icon: '👤', href: '/about', category: 'Navigation' },
  { id: 'achievements', label: 'Achievements', icon: '🏆', href: '/achievements', category: 'Navigation' },
  { id: 'projects', label: 'Projects', icon: '📦', href: '/projects', category: 'Navigation' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/dashboard', category: 'Navigation' },
  { id: 'contact', label: 'Contact', icon: '✉️', href: '/contact', category: 'Navigation' },
  { id: 'guestbook', label: 'Guestbook', icon: '📝', href: '/guestbook', category: 'Navigation' },
  { id: 'uses', label: 'Uses', icon: '🛠️', href: '/uses', category: 'Navigation' },
  { id: 'links', label: 'Links', icon: '🔗', href: '/links', category: 'Navigation' },
  { id: 'github', label: 'GitHub', icon: '🐙', href: 'https://github.com/felichpehagasaginting-code', category: 'Social', external: true },
  { id: 'instagram', label: 'Instagram', icon: '📸', href: 'https://www.instagram.com/fel.comp', category: 'Social', external: true },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', href: 'https://www.linkedin.com/in/felich-pehagasa-ginting', category: 'Social', external: true },
  { id: 'email', label: 'Send Email', icon: '📧', href: 'mailto:felichpehagasaginting@gmail.com', category: 'Social', external: true },
];

import { sounds } from '@/lib/sounds';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = query
    ? commands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, typeof commands>);

  const handleSelect = useCallback((cmd: typeof commands[0]) => {
    setOpen(false);
    setQuery('');
    setSelectedIndex(0);
    sounds.playPop();
    if (cmd.external) {
      window.open(cmd.href, '_blank');
    } else {
      router.push(cmd.href);
    }
  }, [router]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

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
        setOpen(prev => {
          sounds.playSwitch();
          return !prev;
        });
      }
      if (e.key === 'Escape') {
        if (open) sounds.playSwitch();
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
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[101]"
          >
            <div className="mx-4 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-2xl">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 border-b border-neutral-200 dark:border-neutral-800">
                <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Type a command or search..."
                  className="flex-1 py-4 bg-transparent text-sm outline-none placeholder:text-neutral-400"
                />
                <kbd className="hidden sm:inline-flex px-2 py-1 text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-400 rounded border border-neutral-200 dark:border-neutral-700">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-y-auto p-2">
                {Object.entries(grouped).map(([category, cmds]) => (
                  <div key={category}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 px-3 py-2">
                      {category}
                    </p>
                    {cmds.map((cmd) => {
                      const globalIndex = filtered.findIndex((f) => f.id === cmd.id);
                      const isSelected = globalIndex === selectedIndex;
                      
                      return (
                      <button
                        key={cmd.id}
                        onClick={() => handleSelect(cmd)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                          isSelected 
                            ? 'bg-neutral-100 dark:bg-neutral-800 text-primary ring-1 ring-primary/30' 
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                        }`}
                      >
                        <span className="text-base">{cmd.icon}</span>
                        <span className="flex-1 font-medium">{cmd.label}</span>
                        {cmd.external && (
                          <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                          </svg>
                        )}
                      </button>
                      );
                    })}
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-neutral-400 text-center py-8">No results found.</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
