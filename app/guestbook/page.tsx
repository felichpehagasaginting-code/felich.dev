'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Entry = {
  id: string;
  name: string;
  message: string;
  createdAt: Timestamp | null;
  avatar: string;
};

const AVATARS = ['😊', '🦄', '🚀', '🔥', '🌟', '🎯', '💡', '🎨', '🤖', '⚡', '🌊', '🏆'];
const randomAvatar = () => AVATARS[Math.floor(Math.random() * AVATARS.length)];

export default function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Realtime listener via Firestore
  useEffect(() => {
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Entry[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Entry, 'id'>),
      }));
      setEntries(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'guestbook'), {
        name: name.trim(),
        message: message.trim(),
        avatar: randomAvatar(),
        createdAt: serverTimestamp(),
      });
      setName('');
      setMessage('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to post entry:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (ts: Timestamp | null) => {
    if (!ts) return 'just now';
    return ts.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <PageTransition>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold">Guestbook</h1>
            {/* Realtime indicator */}
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Leave a message for me and other visitors. ✍️
          </p>
        </motion.div>

        <hr className="dotted-divider mb-8" />

        {/* Success Toast */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 text-sm font-medium"
            >
              ✅ Your message is live! Thanks for signing the guestbook 🎉
            </motion.div>
          )}
        </AnimatePresence>

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
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing...
              </>
            ) : (
              'Sign Guestbook'
            )}
          </motion.button>
        </motion.form>

        {/* Entry count */}
        {!loading && (
          <p className="text-xs text-neutral-400 mb-4 font-mono">
            {entries.length} {entries.length === 1 ? 'message' : 'messages'} — synced live via Firebase
          </p>
        )}

        {/* Entries */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : entries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-neutral-400"
            >
              <p className="text-4xl mb-3">✍️</p>
              <p className="text-sm">Be the first to sign the guestbook!</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.04 }}
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
                        <span className="text-[10px] text-neutral-400">{formatDate(entry.createdAt)}</span>
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
