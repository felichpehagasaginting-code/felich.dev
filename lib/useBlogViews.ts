'use client';

import { useEffect } from 'react';
import { useFirestoreCounter } from '@/lib/useFirestoreCounter';

/**
 * Tracks and displays the view count for a blog post slug in Firestore.
 * Increments once per browser session using sessionStorage.
 *
 * Public API is unchanged — the hook still returns a `number | null`.
 */
export function useBlogViews(slug: string): number | null {
  const { count, increment } = useFirestoreCounter({
    collection: 'blog_views',
    docId: slug,
    // sessionStorage guard — fires once per browser tab session.
    persistenceStrategy: 'sessionStorage',
    storageKey: `viewed_blog_${slug}`,
    countField: 'count',
  });

  // Auto-increment on first render. The guard inside the generic hook
  // ensures this is a no-op on any subsequent renders within the same session.
  useEffect(() => {
    void increment();
    // We intentionally omit `increment` from deps to avoid re-firing on
    // every render. The generic hook's own guard is the source of truth.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return count ?? null;
}
