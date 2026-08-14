'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import PageTransition from '@/components/PageTransition';
import { Timestamp } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
import { Heart, Sparkles, Pin, ShieldCheck, Flame, Rocket, Lightbulb, ThumbsUp, Send } from 'lucide-react';
import { introAudio } from '@/lib/introAudio';

type Entry = {
  id: string;
  name: string;
  message: string;
  createdAt: Timestamp | null;
  avatar: string;
  uid: string;
  reactions?: Record<string, number>;
};

const RATE_LIMIT_KEY = 'guestbook_last_post';
const RATE_LIMIT_MS = 30_000; // 30 seconds

const EMOJI_REACTIONS = [
  { emoji: '❤️', key: 'heart' },
  { emoji: '🔥', key: 'fire' },
  { emoji: '🚀', key: 'rocket' },
  { emoji: '💡', key: 'bulb' },
  { emoji: '👏', key: 'clap' },
];

export default function Guestbook() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [localReactions, setLocalReactions] = useState<Record<string, Record<string, number>>>({});
  const [userReacted, setUserReacted] = useState<Record<string, string[]>>({});

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

  const handleReaction = useCallback((entryId: string, emojiKey: string) => {
    introAudio.playTick(1.2);
    
    // Toggle reaction locally
    setUserReacted(prev => {
      const existing = prev[entryId] || [];
      const hasReacted = existing.includes(emojiKey);
      const next = hasReacted ? existing.filter(k => k !== emojiKey) : [...existing, emojiKey];
      return { ...prev, [entryId]: next };
    });

    setLocalReactions(prev => {
      const currentEntryReactions = prev[entryId] || {};
      const currentCount = currentEntryReactions[emojiKey] || 0;
      const hasReacted = (userReacted[entryId] || []).includes(emojiKey);
      const nextCount = hasReacted ? Math.max(0, currentCount - 1) : currentCount + 1;
      return {
        ...prev,
        [entryId]: {
          ...currentEntryReactions,
          [emojiKey]: nextCount,
        },
      };
    });
  }, [userReacted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim() || !message.trim()) return;
    if (!checkRateLimit()) return;

    const trimmedName = name.trim().slice(0, 100);
    const trimmedMessage = message.trim().slice(0, 500);

    // Optimistic UI insertion
    const optimisticEntry: Entry = {
      id: `temp-${Date.now()}`,
      name: trimmedName,
      message: trimmedMessage,
      avatar: user.photoURL ?? '😊',
      uid: user.uid,
      createdAt: null,
    };

    setEntries(prev => [optimisticEntry, ...prev]);
    setMessage('');
    setSubmitting(true);
    introAudio.playTick(0.9);

    try {
      const db = await getDb();
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      await addDoc(collection(db, 'guestbook'), {
        name: trimmedName,
        message: trimmedMessage,
        avatar: user.photoURL ?? '😊',
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
      localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
      setSuccess(true);
      introAudio.playChime();
      setTimeout(() => setSuccess(false), 3500);
    } catch (error) {
      console.error('Failed to post entry:', error);
      // Remove optimistic entry if failed
      setEntries(prev => prev.filter(item => item.id !== optimisticEntry.id));
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (ts: Timestamp | null) => {
    if (!ts) return 'Just now';
    return ts.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-4xl font-display font-bold tracking-[-0.01em] text-[var(--text-primary)]">Guestbook</h1>
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)] text-[10px] font-mono font-semibold uppercase tracking-wider rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">
            Leave a message, note, or say hi to Felich and other visitors from around the world! ✍️
          </p>
        </motion.div>

        {/* ── Sticky Pinned Owner Welcome Card ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="p-5 rounded-2xl border-2 border-[var(--brand)]/40 bg-[var(--brand-bg)]/40 shadow-xs relative overflow-hidden"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--brand)] text-[var(--brand-contrast)] flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">
              F
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-display font-bold text-sm text-[var(--text-primary)]">Felich Pehagasa Ginting</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--brand)] text-[var(--brand-contrast)]">
                  <ShieldCheck size={11} />
                  <span>Owner &amp; Developer</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)] ml-auto">
                  <Pin size={11} className="text-[var(--brand)]" />
                  <span>Pinned Note</span>
                </span>
              </div>
              <p className="text-xs md:text-sm text-[var(--text-primary)] leading-relaxed">
                Welcome to my portfolio guestbook! Feel free to leave your feedback, project ideas, or just say hi. Thank you for visiting! ✨
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success Toast */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/30 text-xs font-medium flex items-center gap-2"
            >
              <Sparkles size={16} />
              <span>Your message is live! Thanks for signing the guestbook 🎉</span>
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
              className="p-4 rounded-xl bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/30 text-xs font-medium flex items-center gap-2"
            >
              <span>⏳</span>
              <span>Please wait <strong>{cooldown}s</strong> before posting another message.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Gate or Sign Form */}
        {authLoading ? (
          <div className="flex justify-center p-8">
            <div className="w-6 h-6 border-2 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !user ? (
          /* Sign-in Panel */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border border-[var(--border-default)] bg-[var(--glass-bg)] text-center space-y-3"
          >
            <p className="text-2xl">✍️</p>
            <h3 className="font-bold text-sm text-[var(--text-primary)]">
              Sign in to leave a message
            </h3>
            <p className="text-[var(--text-muted)] text-xs max-w-sm mx-auto">
              A quick Google sign-in keeps the guestbook spam-free and authentic 🛡️
            </p>
            <motion.button
              id="guestbook-google-signin"
              onClick={signInWithGoogle}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] font-semibold text-xs shadow-sm hover:border-[var(--brand)] transition-all cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              <span>Continue with Google</span>
            </motion.button>
          </motion.div>
        ) : (
          /* Logged-in Form */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-default)]">
              <div className="flex items-center gap-2.5">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName ?? 'User avatar'}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-[var(--brand)]/30"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[var(--brand-bg)] text-[var(--brand)] flex items-center justify-center text-xs font-bold">
                    {user.displayName?.[0] ?? '?'}
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold leading-none">{user.displayName}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{user.email}</p>
                </div>
              </div>
              <button
                id="guestbook-signout"
                onClick={signOut}
                className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                id="guestbook-message"
                placeholder="Write a warm message or greeting..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={submitting}
                maxLength={500}
                rows={3}
                className="form-input text-xs"
                aria-label="Your message"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {message.length}/500
                </span>

                <motion.button
                  id="guestbook-submit"
                  type="submit"
                  disabled={submitting || cooldown > 0 || !message.trim()}
                  whileHover={{ scale: submitting || cooldown > 0 ? 1 : 1.02 }}
                  whileTap={{ scale: submitting || cooldown > 0 ? 1 : 0.98 }}
                  className="px-5 py-2 rounded-xl bg-[var(--brand)] text-[var(--brand-contrast)] font-semibold text-xs hover:brightness-110 transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Signing...</span>
                    </>
                  ) : cooldown > 0 ? (
                    <span>Wait {cooldown}s</span>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Post Message</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Message count */}
        {!loading && (
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
            <span>{entries.length} {entries.length === 1 ? 'Message' : 'Messages'} recorded</span>
            <span>Synced live via Firebase Firestore</span>
          </div>
        )}

        {/* Message Cards List */}
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
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
            <div className="text-center py-12 text-[var(--text-muted)]">
              <p className="text-3xl mb-2">✍️</p>
              <p className="text-xs">Be the first to sign the guestbook!</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {entries.map((entry, i) => {
                const entryReactions = localReactions[entry.id] || {};
                const userReactedKeys = userReacted[entry.id] || [];

                return (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: i * 0.03 }}
                    className="p-4 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--brand)]/40 transition-all space-y-3 shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-sm flex-shrink-0 overflow-hidden ring-1 ring-[var(--border-default)]">
                        {entry.avatar?.startsWith('http') ? (
                          <Image
                            src={entry.avatar}
                            alt={entry.name}
                            width={36}
                            height={36}
                            className="rounded-full object-cover w-full h-full"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span>{entry.avatar || '👤'}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-[var(--text-primary)] truncate">{entry.name}</span>
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">
                            {formatDate(entry.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-primary)] leading-relaxed break-words">
                          {entry.message}
                        </p>
                      </div>
                    </div>

                    {/* Emoji Reaction Bar */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-[var(--border-default)]/60">
                      {EMOJI_REACTIONS.map(({ emoji, key }) => {
                        const count = (entry.reactions?.[key] || 0) + (entryReactions[key] || 0);
                        const isReacted = userReactedKeys.includes(key);

                        return (
                          <button
                            key={key}
                            onClick={() => handleReaction(entry.id, key)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all cursor-pointer ${
                              isReacted
                                ? 'bg-[var(--brand-bg)] border border-[var(--brand)]/40 text-[var(--brand)] scale-105'
                                : 'bg-[var(--bg-muted)] hover:bg-[var(--bg-base)] border border-transparent hover:border-[var(--border-default)] text-[var(--text-muted)]'
                            }`}
                            title={`React with ${emoji}`}
                          >
                            <span>{emoji}</span>
                            {count > 0 && <span className="text-[10px] font-mono font-bold">{count}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
