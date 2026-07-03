import { renderHook, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/firebase', () => ({
  getDb: vi.fn(() => Promise.resolve({ _mock: true })),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ id: 'test' })),
  onSnapshot: vi.fn((_ref: any, cb: any) => {
    cb({ data: () => ({ count: 7 }), exists: true });
    return vi.fn();
  }),
  setDoc: vi.fn(() => Promise.resolve()),
  increment: vi.fn((n: number) => n),
}));

describe('useBlogViews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('returns a number or null', async () => {
    const { useBlogViews } = await import('@/lib/useBlogViews');
    const { result } = renderHook(() => useBlogViews('test-view'));
    expect(typeof result.current === 'number' || result.current === null).toBe(true);
  });

  it('uses sessionStorage for view dedup', async () => {
    const { useBlogViews } = await import('@/lib/useBlogViews');
    renderHook(() => useBlogViews('test-view'));
    expect(sessionStorage.getItem('viewed_blog_test-view')).toBe('true');
  });
});
