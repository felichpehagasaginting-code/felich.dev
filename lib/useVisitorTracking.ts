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
    let cleanupPresence: (() => void) | undefined;
    let active = true;

    const startTracking = () => {
      (async () => {
        if (!active) return;
        try {
          const db = await getDb();
          const rtdb = await getRtdb();
          const { doc, getDoc } = await import('firebase/firestore');
          const { ref, onValue, set, remove, serverTimestamp, onDisconnect } = await import('firebase/database');

          if (!active) return;

          const docId = path.replace(/\//g, '_');
          const pageRef = doc(db, 'page_views', docId);
          try {
            const sessionKey = `pv_counted_${docId}`;
            const alreadyCounted = sessionStorage.getItem(sessionKey);
            if (!alreadyCounted) {
              await fetch('/api/counters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collection: 'page_views', slug: docId }),
              });
              sessionStorage.setItem(sessionKey, '1');
            }
            const snap = await getDoc(pageRef);
            if (active) setTotalViews(snap.data()?.count ?? 0);
          } catch (err: any) {
            // Silently swallow offline / demo fallback errors in development or unconfigured environments
            if (err?.code !== 'unavailable' && !err?.message?.includes('offline')) {
              console.error('View tracking error:', err);
            }
          }

          if (!active) return;

          const sessionId = Math.random().toString(36).slice(2);
          const presenceRef = ref(rtdb, `presence/${path}/${sessionId}`);
          set(presenceRef, { connectedAt: serverTimestamp() }).catch(() => {});
          onDisconnect(presenceRef).remove();

          cleanupPresence = () => {
            remove(presenceRef).catch(() => {});
          };

          const presenceListRef = ref(rtdb, `presence/${path}`);
          unsub = onValue(
            presenceListRef,
            (snapshot) => {
              if (active) setOnlineCount(snapshot.size || 0);
            },
            () => {
              // Gracefully ignore RTDB error when database URL is demo or offline
            }
          );
        } catch (err) {
          console.error('Visitor tracking setup error:', err);
        }
      })();
    };

    const idleId =
      'requestIdleCallback' in window
        ? window.requestIdleCallback(startTracking, { timeout: 2000 })
        : globalThis.setTimeout(startTracking, 1000);

    return () => {
      active = false;
      if ('cancelIdleCallback' in window && typeof idleId === 'number') {
        window.cancelIdleCallback(idleId);
      } else {
        globalThis.clearTimeout(idleId);
      }
      unsub?.();
      cleanupPresence?.();
    };
  }, [path]);

  return { onlineCount, totalViews };
}
