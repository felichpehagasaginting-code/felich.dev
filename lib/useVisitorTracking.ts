'use client';

import { useEffect, useState } from 'react';
import { ref, onValue, set, remove, serverTimestamp, onDisconnect } from 'firebase/database';
import { doc, setDoc, increment, getDoc } from 'firebase/firestore';
import { rtdb, db } from '@/lib/firebase';

/**
 * Tracks total page views (Firestore) + live online visitors (Realtime DB)
 */
export function useVisitorTracking(path: string = 'home') {
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [totalViews, setTotalViews] = useState<number | null>(null);

  useEffect(() => {
    // ── 1. Increment total page views in Firestore ─────────────────────────
    const docId = path.replace(/\//g, '_');
    const pageRef = doc(db, 'page_views', docId);
    const trackView = async () => {
      try {
        await setDoc(pageRef, { count: increment(1), path }, { merge: true });
        const snap = await getDoc(pageRef);
        setTotalViews(snap.data()?.count ?? 0);
      } catch (err) {
        console.error('View tracking error:', err);
      }
    };
    trackView();

    // ── 2. Register live presence in Realtime DB ───────────────────────────
    const sessionId = Math.random().toString(36).slice(2);
    const presenceRef = ref(rtdb, `presence/${path}/${sessionId}`);

    set(presenceRef, { connectedAt: serverTimestamp() });
    onDisconnect(presenceRef).remove(); // auto-cleanup on disconnect

    // Listen for total online count on this path
    const presenceListRef = ref(rtdb, `presence/${path}`);
    const unsub = onValue(presenceListRef, (snapshot) => {
      setOnlineCount(snapshot.size || 0);
    });

    return () => {
      unsub();
      remove(presenceRef); // cleanup on unmount
    };
  }, [path]);

  return { onlineCount, totalViews };
}
