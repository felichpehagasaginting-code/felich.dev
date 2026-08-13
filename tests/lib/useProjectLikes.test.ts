import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/firebase', () => ({
  getDb: vi.fn(() => Promise.resolve({ _mock: true })),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn((...args: any[]) => ({ id: args[2] || 'test' })),
  onSnapshot: vi.fn((_ref: any, cb: any) => {
    if (typeof cb === 'function') {
      cb({ data: () => ({ count: 3 }), exists: true });
    }
    return vi.fn();
  }),
}));

describe('useProjectLikes', () => {
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
    const { useProjectLikes } = await import('@/lib/useProjectLikes');
    const { result } = renderHook(() => useProjectLikes('test-project'));
    expect(result.current).toHaveProperty('likes');
    expect(result.current).toHaveProperty('hasLiked');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('toggleLike');
  });

  it('uses project-specific localStorage key', async () => {
    localStorage.setItem('liked_project_test-project', 'true');
    const { useProjectLikes } = await import('@/lib/useProjectLikes');
    const { result } = renderHook(() => useProjectLikes('test-project'));
    expect(result.current.hasLiked).toBe(true);
  });

  it('does not share state with blog likes', async () => {
    localStorage.setItem('liked_project_project-a', 'true');
    const { useProjectLikes } = await import('@/lib/useProjectLikes');
    const { result: resultA } = renderHook(() => useProjectLikes('project-a'));
    const { result: resultB } = renderHook(() => useProjectLikes('project-b'));
    expect(resultA.current.hasLiked).toBe(true);
    expect(resultB.current.hasLiked).toBe(false);
  });
});
