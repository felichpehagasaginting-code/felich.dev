import { describe, it, expect, vi, beforeEach } from 'vitest';
import { triggerImpact } from '@/lib/impact';

describe('triggerImpact', () => {
  beforeEach(() => {
    document.body.classList.remove('shake-impact');
    vi.restoreAllMocks();
  });

  it('adds shake-impact class to body', () => {
    triggerImpact();
    expect(document.body.classList.contains('shake-impact')).toBe(true);
  });

  it('removes and re-adds class to re-trigger animation', () => {
    document.body.classList.add('shake-impact');
    triggerImpact();
    expect(document.body.classList.contains('shake-impact')).toBe(true);
  });

  it('calls navigator.vibrate when supported', () => {
    const vibrateSpy = vi.fn();
    Object.defineProperty(navigator, 'vibrate', {
      value: vibrateSpy,
      configurable: true,
      writable: true,
    });
    triggerImpact();
    expect(vibrateSpy).toHaveBeenCalledWith(10);
  });

  it('handles vibrate errors gracefully', () => {
    Object.defineProperty(navigator, 'vibrate', {
      value: vi.fn(() => { throw new Error('blocked'); }),
      configurable: true,
      writable: true,
    });
    expect(() => triggerImpact()).not.toThrow();
  });
});
