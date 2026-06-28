'use client';

import { useEffect, useState, useCallback } from 'react';
import { doc, setDoc, increment, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
    const ref = doc(db, collectionName, docId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setCount(snap.data()?.[countField] ?? 0);
        setLoading(false);
      },
      (err) => {
        console.error(`[useFirestoreCounter] Snapshot error on ${collectionName}/${docId}:`, err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [collectionName, docId, countField]);

  // ── Increment action ───────────────────────────────────────────────────────
  const doIncrement = useCallback(async () => {
    if (hasActed) return;

    const ref = doc(db, collectionName, docId);
    try {
      // Persist the action before the network call to prevent duplicate taps.
      if (persistenceStrategy !== 'none') {
        const storage =
          persistenceStrategy === 'localStorage' ? localStorage : sessionStorage;
        storage.setItem(storageKey, 'true');
      }
      setHasActed(true);

      await setDoc(ref, { [countField]: increment(1), id: docId }, { merge: true });
    } catch (err) {
      // Roll back optimistic client-side guard on failure
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
