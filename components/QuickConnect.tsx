'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { Mail, FileText, Calendar, MessageCircle, Plus } from 'lucide-react';

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

export default function QuickConnect() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Schedule Call', icon: Calendar, url: '#', color: 'group-hover:text-amber-500' },
    { name: 'WhatsApp', icon: MessageCircle, url: '#', color: 'group-hover:text-green-500' },
    { name: 'GitHub', icon: GithubIcon, url: 'https://github.com/felichpehagasaginting-code', color: 'group-hover:text-neutral-800 dark:group-hover:text-white' },
    { name: 'LinkedIn', icon: LinkedinIcon, url: '#', color: 'group-hover:text-blue-500' },
    { name: 'Email Me', icon: Mail, url: 'mailto:your.email@example.com', color: 'group-hover:text-red-500' },
    { name: 'Resume (CV)', icon: FileText, url: '#', color: 'group-hover:text-primary' }
  ];

  return (
    <div className="fixed bottom-24 right-6 md:bottom-6 md:right-6 z-[99] flex flex-col items-end gap-3 pointer-events-none">
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
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 300 }}
                  onMouseEnter={() => sounds.playHover()}
                  onClick={() => sounds.playPop()}
                  className="flex items-center gap-3.5 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 px-4 py-2.5 rounded-2xl shadow-xl hover:shadow-2xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 group"
                >
                  <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                    {link.name}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors duration-300 ${link.color}`}>
                    <Icon size={16} strokeWidth={2.5} />
                  </div>
                </motion.a>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.playPop();
        }}
        onMouseEnter={() => sounds.playHover()}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto outline-none ${
          isOpen ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'bg-primary text-white'
        }`}
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
