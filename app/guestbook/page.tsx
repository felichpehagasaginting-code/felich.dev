'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

type Entry = {
  id?: string;
  name: string;
  message: string;
  date: string;
  avatar: string;
};

export default function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch(`${API_URL}/api/guestbook`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Failed to fetch guestbook:', error);
      // Fallback if backend is down
      setEntries([
        { name: 'System', message: 'Welcome to the guestbook! Be the first to leave a message. 🎉', date: new Date().toISOString(), avatar: '🤖' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/guestbook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEntries([data.entry, ...entries]);
        setName('');
        setMessage('');
      }
    } catch (error) {
      console.error('Failed to post entry:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
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
              disabled={submitting}
              maxLength={50}
              className="form-input disabled:opacity-50"
            />
            <div />
          </div>
          <textarea
            placeholder="Leave a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={submitting}
            maxLength={500}
            rows={3}
            className="form-input mb-4 disabled:opacity-50"
          />
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors shadow-lg disabled:opacity-70 flex items-center gap-2"
          >
            {submitting ? 'Signing...' : 'Sign Guestbook'}
          </motion.button>
        </motion.form>

        {/* Entries */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id || `${entry.name}-${i}`}
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
                        <span className="text-[10px] text-neutral-400">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 break-words">{entry.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
