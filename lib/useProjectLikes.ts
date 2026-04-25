'use client';

import { useEffect, useState } from 'react';
import { doc, setDoc, increment, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Tracks likes per project in Firestore.
 * Uses localStorage to prevent double-liking across sessions.
 */
export function useProjectLikes(slug: string) {
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const storageKey = `liked_project_${slug}`;

  useEffect(() => {
    if (!slug) return;
    setHasLiked(localStorage.getItem(storageKey) === 'true');

    // Realtime listener
    const ref = doc(db, 'project_likes', slug);
    const unsub = onSnapshot(ref, (snap) => {
      setLikes(snap.data()?.count ?? 0);
      setLoading(false);
    });
    return () => unsub();
  }, [slug, storageKey]);

  const toggleLike = async () => {
    if (hasLiked) return; // one like per device
    const ref = doc(db, 'project_likes', slug);
    try {
      await setDoc(ref, { slug, count: increment(1) }, { merge: true });
      setHasLiked(true);
      localStorage.setItem(storageKey, 'true');
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  return { likes, hasLiked, loading, toggleLike };
}
