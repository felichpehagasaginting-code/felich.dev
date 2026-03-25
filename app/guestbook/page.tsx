'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

const guestEntries = [
  { name: 'System', message: 'Welcome to the guestbook! Be the first to leave a message. 🎉', date: '2025-01-01', avatar: '🤖' },
];

export default function Guestbook() {
  const [entries, setEntries] = useState(guestEntries);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const newEntry = {
      name: name.trim(),
      message: message.trim(),
      date: new Date().toISOString().split('T')[0],
      avatar: '👤',
    };
    setEntries([newEntry, ...entries]);
    setName('');
    setMessage('');
  };

  return (
    <PageTransition>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Guestbook</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Leave a message for me and other visitors. ✍️
          </p>
        </motion.div>

        <hr className="dotted-divider mb-8" />

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
            <div />
          </div>
          <textarea
            placeholder="Leave a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            className="form-input mb-4"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors shadow-lg"
          >
            Sign Guestbook
          </motion.button>
        </motion.form>

        {/* Entries */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {entries.map((entry, i) => (
              <motion.div
                key={`${entry.name}-${entry.date}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
                layout
                className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-lg flex-shrink-0">
                    {entry.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm">{entry.name}</span>
                      <span className="text-[10px] text-neutral-400">{entry.date}</span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{entry.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
