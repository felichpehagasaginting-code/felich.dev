'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import PageTransition from '@/components/PageTransition';
import { Timestamp } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';

type Entry = {
  id: string;
  name: string;
  message: string;
  createdAt: Timestamp | null;
  avatar: string;
  uid: string;
};

const RATE_LIMIT_KEY = 'guestbook_last_post';
const RATE_LIMIT_MS = 30_000; // 30 seconds

export default function Guestbook() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Pre-fill name when user logs in
  useEffect(() => {
    if (user?.displayName) setName(user.displayName);
  }, [user]);

  // Rate limit countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Realtime listener via Firestore
  useEffect(() => {
    let unsub: () => void;
    (async () => {
      const db = await getDb();
      const { collection, query, orderBy, onSnapshot } = await import('firebase/firestore');
      const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));
      unsub = onSnapshot(q, (snapshot: any) => {
        const data: Entry[] = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...(doc.data() as Omit<Entry, 'id'>),
        }));
        setEntries(data);
        setLoading(false);
      });
    })();
    return () => unsub?.();
  }, []);

  const checkRateLimit = useCallback((): boolean => {
    const lastPost = localStorage.getItem(RATE_LIMIT_KEY);
    if (!lastPost) return true;
    const elapsed = Date.now() - parseInt(lastPost, 10);
    if (elapsed < RATE_LIMIT_MS) {
      const remaining = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
      setCooldown(remaining);
      return false;
    }
    return true;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim() || !message.trim()) return;
    if (!checkRateLimit()) return;

    setSubmitting(true);
    try {
      const db = await getDb();
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      await addDoc(collection(db, 'guestbook'), {
        name: name.trim().slice(0, 100),
        message: message.trim().slice(0, 500),
        avatar: user.photoURL ?? '😊',
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
      localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-4xl font-display font-bold tracking-[-0.01em] text-[var(--text-primary)]">Guestbook</h1>
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)] text-[10px] font-mono font-semibold uppercase tracking-wider" style={{ borderRadius: '4px' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
              Live
            </span>
          </div>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">
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
              className="mb-4 p-4 rounded-xl bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/30 text-sm font-medium"
            >
              ✅ Your message is live! Thanks for signing the guestbook 🎉
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rate Limit Warning */}
        <AnimatePresence>
          {cooldown > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 rounded-xl bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/30 text-sm font-medium flex items-center gap-2"
            >
              <span className="text-base">⏳</span>
              Please wait <strong>{cooldown}s</strong> before posting again.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Gate or Form */}
        {authLoading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !user ? (
          /* Sign-in Panel */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-2xl border border-[var(--border-default)] bg-[var(--glass-bg)] text-center"
          >
            <p className="text-2xl mb-2">✍️</p>
            <p className="font-semibold text-[var(--text-primary)] mb-1">
              Sign in to leave a message
            </p>
            <p className="text-[var(--text-muted)] text-sm mb-5">
              A quick Google sign-in keeps things spam-free 🛡️
            </p>
            <motion.button
              id="guestbook-google-signin"
              onClick={signInWithGoogle}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] font-semibold text-sm shadow-md hover:shadow-lg transition-all"
            >
              {/* Google SVG icon */}
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              Continue with Google
            </motion.button>
          </motion.div>
        ) : (
          /* Logged-in Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--glass-bg)]"
          >
            {/* User Info Bar */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border-default)]">
              <div className="flex items-center gap-2.5">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName ?? 'User avatar'}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-primary/30"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                    {user.displayName?.[0] ?? '?'}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold leading-none">{user.displayName}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{user.email}</p>
                </div>
              </div>
              <button
                id="guestbook-signout"
                onClick={signOut}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Sign out
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  id="guestbook-name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={submitting}
                  maxLength={100}
                  className="form-input disabled:opacity-50"
                  aria-label="Your name"
                />
                <div />
              </div>
              <textarea
                id="guestbook-message"
                placeholder="Leave a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={submitting}
                maxLength={500}
                rows={3}
                className="form-input mb-1 disabled:opacity-50"
                aria-label="Your message"
              />
              <p className="text-[11px] text-[var(--text-muted)] mb-4 text-right">
                {message.length}/500
              </p>

              <motion.button
                id="guestbook-submit"
                type="submit"
                disabled={submitting || cooldown > 0}
                whileHover={{ scale: submitting || cooldown > 0 ? 1 : 1.01 }}
                whileTap={{ scale: submitting || cooldown > 0 ? 1 : 0.99 }}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors shadow-lg disabled:opacity-70 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing...
                  </>
                ) : cooldown > 0 ? (
                  `Wait ${cooldown}s`
                ) : (
                  'Sign Guestbook'
                )}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Entry count */}
        {!loading && (
          <p className="text-xs text-[var(--text-muted)] mb-4 font-mono">
            {entries.length} {entries.length === 1 ? 'message' : 'messages'} — synced live via
            Firebase
          </p>
        )}

        {/* Entries */}
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-default)] flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-muted)] flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-[var(--bg-muted)] rounded" />
                    <div className="h-3.5 w-full bg-[var(--bg-muted)] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-[var(--text-muted)]"
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
                  className="p-4 rounded-2xl border border-[var(--border-default)] bg-[var(--glass-bg)] hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                      {entry.avatar?.startsWith('http') ? (
                        <Image
                          src={entry.avatar}
                          alt={entry.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover w-full h-full"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span>{entry.avatar}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm">{entry.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {formatDate(entry.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-primary)] break-words">
                        {entry.message}
                      </p>
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
