import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/firebase', () => ({
  getDb: vi.fn(() => Promise.resolve({ _mock: true })),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn((...args: any[]) => ({ id: args[2] || 'test' })),
  onSnapshot: vi.fn((_ref: any, cb: any) => {
    if (typeof cb === 'function') {
      cb({ data: () => ({ count: 5 }), exists: true });
    }
    return vi.fn();
  }),
}));

describe('useBlogLikes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: true, status: 200 }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the expected API shape', async () => {
    const { useBlogLikes } = await import('@/lib/useBlogLikes');
    const { result } = renderHook(() => useBlogLikes('test-slug'));
    expect(result.current).toHaveProperty('likes');
    expect(result.current).toHaveProperty('hasLiked');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('toggleLike');
    expect(typeof result.current.toggleLike).toBe('function');
  });

  it('sets localStorage on toggle', async () => {
    const { useBlogLikes } = await import('@/lib/useBlogLikes');
    const { result } = renderHook(() => useBlogLikes('test-slug'));
    result.current.toggleLike();
    expect(localStorage.getItem('liked_blog_test-slug')).toBe('true');
  });

  it('reads previous likes from localStorage', async () => {
    localStorage.setItem('liked_blog_test-slug', 'true');
    const { useBlogLikes } = await import('@/lib/useBlogLikes');
    const { result } = renderHook(() => useBlogLikes('test-slug'));
    expect(result.current.hasLiked).toBe(true);
  });
});
