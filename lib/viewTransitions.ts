/**
 * Helper to wrap DOM updates or navigation with the native View Transitions API.
 * Gracefully falls back to an immediate synchronous callback on unsupported browsers
 * or when the user prefers reduced motion.
 */
export function safeViewTransition(updateFn: () => void | Promise<void>): Promise<void> {
  if (typeof window === 'undefined') {
    updateFn();
    return Promise.resolve();
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('startViewTransition' in document) || typeof (document as any).startViewTransition !== 'function') {
    const res = updateFn();
    return res instanceof Promise ? res : Promise.resolve();
  }

  return new Promise((resolve) => {
    (document as any).startViewTransition(async () => {
      await updateFn();
      resolve();
    });
  });
}
