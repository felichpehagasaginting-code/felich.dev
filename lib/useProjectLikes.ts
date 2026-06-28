'use client';

import { useFirestoreCounter } from '@/lib/useFirestoreCounter';

/**
 * Tracks likes per project in Firestore.
 * Uses localStorage to prevent double-liking across sessions.
 *
 * Public API is unchanged — all existing callsites continue to work.
 */
export function useProjectLikes(slug: string) {
  const { count: likes, hasActed: hasLiked, loading, increment: toggleLike } =
    useFirestoreCounter({
      collection: 'project_likes',
      docId: slug,
      persistenceStrategy: 'localStorage',
      storageKey: `liked_project_${slug}`,
    });

  return { likes, hasLiked, loading, toggleLike };
}
