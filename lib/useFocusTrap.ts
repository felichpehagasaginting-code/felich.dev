'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary',
].join(', ');

/**
 * Locks Tab-key focus inside `containerRef` when `active` is true.
 * Focus is automatically restored to the previously focused element on deactivation.
 *
 * @param containerRef - ref to the container that should trap focus
 * @param active - whether the trap should be active
 * @param options.autoFocusFirst - auto-focus the first focusable element when activated (default: true)
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  active: boolean,
  options: { autoFocusFirst?: boolean } = {},
) {
  const { autoFocusFirst = true } = options;
  const previouslyFocusedRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!active) return;

    // Save element that was focused before we open the trap
    previouslyFocusedRef.current = document.activeElement;

    if (autoFocusFirst && containerRef.current) {
      const firstFocusable = containerRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
      firstFocusable?.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !containerRef.current) return;

      const focusableEls = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
      ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);

      if (focusableEls.length === 0) {
        e.preventDefault();
        return;
      }

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if at first element, wrap to last
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        // Tab: if at last element, wrap back to first
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to wherever it was before this trap activated
      if (previouslyFocusedRef.current && (previouslyFocusedRef.current as HTMLElement).focus) {
        (previouslyFocusedRef.current as HTMLElement).focus();
      }
    };
  }, [active, autoFocusFirst, containerRef]);
}
