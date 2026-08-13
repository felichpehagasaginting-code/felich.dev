'use client';

import { useEffect, useState, useCallback } from 'react';
import { getDb } from '@/lib/firebase';

export type PersistenceStrategy = 'localStorage' | 'sessionStorage' | 'none';

export interface UseFirestoreCounterOptions {
  /** Firestore collection name, e.g. 'blog_likes' */
  collection: string;
  /** Document ID within the collection, typically a slug */
  docId: string;
  /**
   * Where to persist the "already acted" state so that a user cannot
   * duplicate their interaction across page reloads or navigations.
   * - 'localStorage'   → survives browser restarts (likes)
   * - 'sessionStorage' → survives page navigations, cleared on close (views)
   * - 'none'           → no client-side guard (advanced use-cases only)
   */
  persistenceStrategy: PersistenceStrategy;
  /** The localStorage / sessionStorage key to mark that the action was taken */
  storageKey: string;
  /** Field inside the Firestore document that holds the numeric counter */
  countField?: string;
}

export interface UseFirestoreCounterReturn {
  count: number;
  hasActed: boolean;
  loading: boolean;
  /**
   * Increments the Firestore counter by 1 and marks the action in storage.
   * Is a no-op when `hasActed` is already true.
   */
  increment: () => Promise<void>;
}

/**
 * Generic real-time Firestore counter hook.
 *
 * Handles:
 * - Real-time subscription via onSnapshot
 * - One-action-per-device guard via configurable client storage
 * - Optimistic UI (hasActed updates immediately, count via Firestore listener)
 * - Full cleanup on unmount
 *
 * @example
 * const { count, hasActed, loading, increment } = useFirestoreCounter({
 *   collection: 'blog_likes',
 *   docId: slug,
 *   persistenceStrategy: 'localStorage',
 *   storageKey: `liked_blog_${slug}`,
 * });
 */
export function useFirestoreCounter({
  collection: collectionName,
  docId,
  persistenceStrategy,
  storageKey,
  countField = 'count',
}: UseFirestoreCounterOptions): UseFirestoreCounterReturn {
  const [count, setCount] = useState<number>(0);
  const [hasActed, setHasActed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // ── Read persisted state on mount ──────────────────────────────────────────
  useEffect(() => {
    if (persistenceStrategy === 'none') return;
    const storage =
      persistenceStrategy === 'localStorage' ? localStorage : sessionStorage;
    setHasActed(storage.getItem(storageKey) === 'true');
  }, [persistenceStrategy, storageKey]);

  // ── Real-time Firestore listener ───────────────────────────────────────────
  useEffect(() => {
    if (!docId) return;
    let unsub: () => void;
    let active = true;
    (async () => {
      try {
        const db = await getDb();
        if (!active) return;
        const { doc, onSnapshot } = await import('firebase/firestore');
        if (!active) return;
        const ref = doc(db, collectionName, docId);
        if (!active) return;
        unsub = onSnapshot(
          ref,
          (snap: any) => {
            if (active) {
              setCount(snap.data()?.[countField] ?? 0);
              setLoading(false);
            }
          },
          () => {
            if (active) setLoading(false);
          }
        );
      } catch {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
      unsub?.();
    };
  }, [collectionName, docId, countField]);

  // ── Increment action ───────────────────────────────────────────────────────
  const doIncrement = useCallback(async () => {
    if (hasActed) return;

    try {
      if (persistenceStrategy !== 'none') {
        const storage =
          persistenceStrategy === 'localStorage' ? localStorage : sessionStorage;
        storage.setItem(storageKey, 'true');
      }
      setHasActed(true);

      // Writes go through the API route (Admin SDK + server-side rate limiting)
      // instead of direct Firestore writes, so clients cannot spam counters.
      const res = await fetch('/api/counters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: collectionName, slug: docId }),
      });
      if (!res.ok) {
        throw new Error(`Counter increment failed (${res.status})`);
      }
    } catch (err) {
      if (persistenceStrategy !== 'none') {
        const storage =
          persistenceStrategy === 'localStorage' ? localStorage : sessionStorage;
        storage.removeItem(storageKey);
      }
      setHasActed(false);
      console.error(`[useFirestoreCounter] Increment error on ${collectionName}/${docId}:`, err);
    }
  }, [hasActed, collectionName, docId, countField, persistenceStrategy, storageKey]);

  return { count, hasActed, loading, increment: doIncrement };
}
