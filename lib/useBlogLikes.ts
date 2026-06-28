'use client';

import { useFirestoreCounter } from '@/lib/useFirestoreCounter';

/**
 * Tracks likes per blog post in Firestore.
 * Uses localStorage to prevent double-liking across sessions.
 *
 * Public API is unchanged — all existing callsites continue to work.
 */
export function useBlogLikes(slug: string) {
  const { count: likes, hasActed: hasLiked, loading, increment: toggleLike } =
    useFirestoreCounter({
      collection: 'blog_likes',
      docId: slug,
      persistenceStrategy: 'localStorage',
      storageKey: `liked_blog_${slug}`,
    });

  return { likes, hasLiked, loading, toggleLike };
}
