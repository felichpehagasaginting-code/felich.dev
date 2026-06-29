'use client';

import { useEffect, useState } from 'react';
import { getDb, getRtdb } from '@/lib/firebase';

/**
 * Tracks total page views (Firestore) + live online visitors (Realtime DB)
 */
export function useVisitorTracking(path: string = 'home') {
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [totalViews, setTotalViews] = useState<number | null>(null);

  useEffect(() => {
    let unsub: () => void;
    (async () => {
      const db = await getDb();
      const rtdb = await getRtdb();
      const { doc, setDoc, increment, getDoc } = await import('firebase/firestore');
      const { ref, onValue, set, remove, serverTimestamp, onDisconnect } = await import('firebase/database');

      const docId = path.replace(/\//g, '_');
      const pageRef = doc(db, 'page_views', docId);
      try {
        const sessionKey = `pv_counted_${docId}`;
        const alreadyCounted = sessionStorage.getItem(sessionKey);
        if (!alreadyCounted) {
          await setDoc(pageRef, { count: increment(1), path }, { merge: true });
          sessionStorage.setItem(sessionKey, '1');
        }
        const snap = await getDoc(pageRef);
        setTotalViews(snap.data()?.count ?? 0);
      } catch (err) {
        console.error('View tracking error:', err);
      }

      const sessionId = Math.random().toString(36).slice(2);
      const presenceRef = ref(rtdb, `presence/${path}/${sessionId}`);
      set(presenceRef, { connectedAt: serverTimestamp() });
      onDisconnect(presenceRef).remove();

      const presenceListRef = ref(rtdb, `presence/${path}`);
      unsub = onValue(presenceListRef, (snapshot) => {
        setOnlineCount(snapshot.size || 0);
      });

      return () => {
        unsub?.();
        remove(presenceRef);
      };
    })();
  }, [path]);

  return { onlineCount, totalViews };
}
