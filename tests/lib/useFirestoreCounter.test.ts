import { renderHook, act, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/firebase', () => ({
  getDb: vi.fn(() => Promise.resolve({ _mock: true })),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ id: 'test' })),
  onSnapshot: vi.fn((_ref: any, cb: any) => {
    cb({ data: () => ({ count: 5 }), exists: true });
    return vi.fn();
  }),
}));

const mockFetch = vi.fn(() =>
  Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ success: true }) })
);

describe('useFirestoreCounter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  const defaultOptions = {
    collection: 'blog_likes',
    docId: 'test-post',
    persistenceStrategy: 'localStorage' as const,
    storageKey: 'liked_blog_test-post',
  };

  it('initializes with count 0 and loading true', async () => {
    const { useFirestoreCounter } = await import('@/lib/useFirestoreCounter');
    const { result } = renderHook(() => useFirestoreCounter(defaultOptions));
    expect(result.current.count).toBe(0);
    expect(result.current.hasActed).toBe(false);
  });

  it('reads persisted hasActed from localStorage', async () => {
    localStorage.setItem('liked_blog_test-post', 'true');
    const { useFirestoreCounter } = await import('@/lib/useFirestoreCounter');
    const { result } = renderHook(() => useFirestoreCounter(defaultOptions));
    expect(result.current.hasActed).toBe(true);
  });

  it('increment is a no-op when hasActed is true', async () => {
    localStorage.setItem('liked_blog_test-post', 'true');
    const { useFirestoreCounter } = await import('@/lib/useFirestoreCounter');
    const { result } = renderHook(() => useFirestoreCounter(defaultOptions));
    await act(async () => {
      await result.current.increment();
    });
    expect(result.current.hasActed).toBe(true);
  });

  it('optimistically sets hasActed on increment before Firebase resolves', async () => {
    const { useFirestoreCounter } = await import('@/lib/useFirestoreCounter');
    const { result } = renderHook(() => useFirestoreCounter(defaultOptions));
    expect(result.current.hasActed).toBe(false);

    act(() => { result.current.increment(); });
    expect(result.current.hasActed).toBe(true);
  });

  it('uses sessionStorage when persistenceStrategy is sessionStorage', async () => {
    localStorage.setItem('viewed_blog_test-view', 'true');
    const { useFirestoreCounter } = await import('@/lib/useFirestoreCounter');
    const { result } = renderHook(() =>
      useFirestoreCounter({
        collection: 'blog_views',
        docId: 'test-view',
        persistenceStrategy: 'sessionStorage',
        storageKey: 'viewed_blog_test-view',
      })
    );
    expect(result.current.hasActed).toBe(false);
  });

  it('hasActed is false when persistenceStrategy is none', async () => {
    localStorage.setItem('liked_none_test', 'true');
    const { useFirestoreCounter } = await import('@/lib/useFirestoreCounter');
    const { result } = renderHook(() =>
      useFirestoreCounter({
        collection: 'test',
        docId: 'test',
        persistenceStrategy: 'none',
        storageKey: 'liked_none_test',
      })
    );
    expect(result.current.hasActed).toBe(false);
  });

  it('posts an increment to the counters API', async () => {
    const { useFirestoreCounter } = await import('@/lib/useFirestoreCounter');
    const { result } = renderHook(() => useFirestoreCounter(defaultOptions));
    await act(async () => {
      await result.current.increment();
    });
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/counters',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ collection: 'blog_likes', slug: 'test-post' }),
      })
    );
    expect(result.current.hasActed).toBe(true);
  });

  it('handles errors during increment gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockRejectedValueOnce(new Error('network down'));
    const { useFirestoreCounter } = await import('@/lib/useFirestoreCounter');
    const { result } = renderHook(() => useFirestoreCounter(defaultOptions));
    await act(async () => {
      await result.current.increment();
    });
    expect(result.current.hasActed).toBe(false);
    expect(localStorage.getItem(defaultOptions.storageKey)).toBeNull();
    consoleSpy.mockRestore();
  });
});
