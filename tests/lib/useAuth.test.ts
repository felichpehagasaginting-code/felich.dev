import { renderHook, act, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockAuth = {
  _mock: true,
  type: 'auth',
  currentUser: null,
};

vi.mock('@/lib/firebase', () => ({
  getAuth: vi.fn(() => Promise.resolve(mockAuth)),
  getGoogleProvider: vi.fn(() =>
    Promise.resolve({
      setCustomParameters: vi.fn(),
    })
  ),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_auth: any, cb: (user: any) => void) => {
    cb(null);
    return vi.fn();
  }),
  signInWithPopup: vi.fn(() =>
    Promise.resolve({
      user: {
        uid: 'mock-uid',
        displayName: 'Test User',
        email: 'test@example.com',
        photoURL: 'https://example.com/photo.jpg',
      },
    })
  ),
  signOut: vi.fn(() => Promise.resolve()),
  GoogleAuthProvider: class {
    setCustomParameters(_params: Record<string, string>) {}
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('returns loading initially', async () => {
    const { useAuth } = await import('@/lib/useAuth');
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBeDefined();
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('signInWithGoogle');
    expect(result.current).toHaveProperty('signOut');
  });

  it('exposes signInWithGoogle function', async () => {
    const { useAuth } = await import('@/lib/useAuth');
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.signInWithGoogle).toBe('function');
  });

  it('exposes signOut function', async () => {
    const { useAuth } = await import('@/lib/useAuth');
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.signOut).toBe('function');
  });

  it('signInWithGoogle can be called without error', async () => {
    const { useAuth } = await import('@/lib/useAuth');
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.signInWithGoogle();
    });
  });

  it('signOut can be called without error', async () => {
    const { useAuth } = await import('@/lib/useAuth');
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.signOut();
    });
  });
});
