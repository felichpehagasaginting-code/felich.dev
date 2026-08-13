'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, FileText, MessageCircle, Plus } from 'lucide-react';

const GithubIcon = ({ size = 16, strokeWidth = 2.5 }: { size?: number, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.3 6-1.5 6-6.76a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.15-3.8s-1.2-.4-3.9 1.4a13.4 13.4 0 0 0-7 0C4.7 3.8 3.5 4.2 3.5 4.2a5.5 5.5 0 0 0-.15 3.8A5.5 5.5 0 0 0 2 12.24c0 5.2 3 6.4 6 6.74A4.8 4.8 0 0 0 7 22" />
  </svg>
);

const LinkedinIcon = ({ size = 16, strokeWidth = 2.5 }: { size?: number, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const WhatsAppIcon = ({ size = 16, strokeWidth = 2.5 }: { size?: number, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21l1.65-4.9A8.5 8.5 0 1 1 8.9 19.35L3 21z" />
  </svg>
);

export default function QuickConnect() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'GitHub', icon: GithubIcon, url: 'https://github.com/felichpehagasaginting-code' },
    { name: 'LinkedIn', icon: LinkedinIcon, url: 'https://www.linkedin.com/in/felich-pehagasa-ginting' },
    { name: 'WhatsApp', icon: WhatsAppIcon, url: 'https://wa.me/6281234567890' },
    { name: 'Email Me', icon: Mail, url: 'mailto:hello@felich.dev' },
    { name: 'Resume (CV)', icon: FileText, url: '/CV_ATS_English.md' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[89] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15, filter: 'blur(5px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, y: 15, filter: 'blur(5px)' }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex flex-col gap-2 pointer-events-auto mb-2"
          >
            {links.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target={link.url.startsWith('http') ? '_blank' : undefined}
                  rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 300 }}
                  className="glass-panel flex items-center gap-3.5 px-4 py-3 shadow-xl hover:border-[var(--brand)] transition-all duration-300 group"
                >
                  <span className="text-sm font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                    {link.name}
                  </span>
                  <div className="p-1.5 rounded-lg bg-[var(--bg-muted)] text-[var(--text-muted)] group-hover:text-[var(--brand)] transition-colors duration-300">
                    <Icon size={16} strokeWidth={2.5} />
                  </div>
                </motion.a>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto outline-none ${
          isOpen ? 'bg-[var(--brand)] text-[var(--brand-contrast)]' : 'bg-[var(--brand)] text-[var(--brand-contrast)]'
        }`}
        title="Toggle quick links"
        aria-label="Toggle quick links"
        aria-expanded={isOpen}
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Plus size={26} strokeWidth={2.5} />
        </motion.div>
      </button>
    </div>
  );
}