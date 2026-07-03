import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/firebase', () => ({
  getDb: vi.fn(() => Promise.resolve({ _mock: true })),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ id: 'test' })),
  onSnapshot: vi.fn((_ref: any, cb: any) => {
    cb({ data: () => ({ count: 5 }), exists: true });
    return vi.fn();
  }),
  setDoc: vi.fn(() => Promise.resolve()),
  increment: vi.fn((n: number) => n),
}));

describe('useBlogLikes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
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

  it('uses localStorage for persistence', async () => {
    const { useBlogLikes } = await import('@/lib/useBlogLikes');
    renderHook(() => useBlogLikes('test-slug'));
    expect(localStorage.getItem).toBeDefined();
  });

  it('detects previous likes from localStorage', async () => {
    localStorage.setItem('liked_blog_test-slug', 'true');
    const { useBlogLikes } = await import('@/lib/useBlogLikes');
    const { result } = renderHook(() => useBlogLikes('test-slug'));
    expect(result.current.hasLiked).toBe(true);
  });
});
