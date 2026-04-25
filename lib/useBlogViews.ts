'use client';

import { useEffect, useState } from 'react';
import { doc, setDoc, increment, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Tracks and displays view count for a blog post slug in Firestore.
 * Increments once per session using sessionStorage.
 */
export function useBlogViews(slug: string) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;

    const ref = doc(db, 'blog_views', slug);
    const sessionKey = `viewed_blog_${slug}`;

    // Increment once per session
    if (!sessionStorage.getItem(sessionKey)) {
      setDoc(ref, { slug, count: increment(1) }, { merge: true })
        .then(() => sessionStorage.setItem(sessionKey, 'true'))
        .catch(console.error);
    }

    // Realtime listener
    const unsub = onSnapshot(ref, (snap) => {
      setViews(snap.data()?.count ?? 0);
    });
    return () => unsub();
  }, [slug]);

  return views;
}
