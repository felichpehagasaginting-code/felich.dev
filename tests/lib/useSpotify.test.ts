import { renderHook, cleanup, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockSpotifyData = {
  isPlaying: true,
  title: 'Test Song',
  artist: 'Test Artist',
  album: 'Test Album',
  albumImageUrl: 'https://example.com/album.jpg',
  songUrl: 'https://open.spotify.com/track/test',
  progressMs: 50000,
  durationMs: 200000,
  isSimulated: false,
};

describe('useSpotify', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSpotifyData),
      })
    ) as any;
  });

  afterEach(() => {
    cleanup();
  });

  it('fetches Spotify data on mount', async () => {
    const { useSpotify } = await import('@/lib/useSpotify');
    const { result } = renderHook(() => useSpotify());
    await vi.waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/spotify/now-playing');
    });
  });

  it('returns isLoading state', async () => {
    const { useSpotify } = await import('@/lib/useSpotify');
    const { result } = renderHook(() => useSpotify());
    expect(result.current.isLoading).toBe(true);
    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('resolves with data on success', async () => {
    const { useSpotify } = await import('@/lib/useSpotify');
    const { result } = renderHook(() => useSpotify());
    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toEqual(mockSpotifyData);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch errors gracefully', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error'))) as any;
    const { useSpotify } = await import('@/lib/useSpotify');
    const { result } = renderHook(() => useSpotify());
    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeDefined();
    });
  });

  it('polls every 15 seconds', async () => {
    vi.useFakeTimers();
    const { useSpotify } = await import('@/lib/useSpotify');
    renderHook(() => useSpotify());
    expect(fetch).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(15000);
    });
    expect(fetch).toHaveBeenCalledTimes(2);
    act(() => {
      vi.advanceTimersByTime(15000);
    });
    expect(fetch).toHaveBeenCalledTimes(3);
    vi.useRealTimers();
  });
});
